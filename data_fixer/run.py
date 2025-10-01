#!/usr/bin/env python3
import argparse
import csv
import os
from pathlib import Path, PurePosixPath
import re
import sys
import unicodedata
from urllib.parse import quote, unquote


# These paths are copied verbatim from the frontend code (do not refactor)
PEOPLE_CSV_PATH_STR = "/data/Web 1de9bb83ec3b80b6a257e12869803932/People aa379227474043d7a198275297c2fa3f_all.csv"
NEWS_CSV_PATH_STR = "/data/Web 1de9bb83ec3b80b6a257e12869803932/News acdaa45f52dd43c09e2773b1e2070fd6.csv"


def compute_repo_root() -> Path:
    # repo root = parent of this script's directory
    return Path(__file__).resolve().parent.parent


def to_ascii_filename(filename: str) -> str:
    """Convert filename to an ASCII slug, retaining some signal for non-ASCII chars.

    Strategy (simple and good-enough):
    - Keep extension as-is
    - For stem characters:
      - ASCII alnum kept; spaces → '_'; '._-' kept; others → '_'
      - Non-ASCII: try NFKD transliteration; keep ASCII alnum result if any;
        otherwise insert 'o' placeholder
    - Collapse multiple underscores, trim leading/trailing '._-'
    - Ensure non-empty stem → 'file'
    """
    basename = filename
    stem, ext = os.path.splitext(basename)

    pieces: list[str] = []
    for ch in stem:
        code = ord(ch)
        if code < 128:
            if ch.isalnum():
                pieces.append(ch)
            elif ch.isspace():
                pieces.append("_")
            elif ch in ".-_":
                pieces.append(ch)
            else:
                pieces.append("_")
        else:
            # Try to decompose and keep ascii letters/digits
            decomp = unicodedata.normalize("NFKD", ch)
            ascii_decomp = re.sub(r"[^A-Za-z0-9]", "", decomp.encode("ascii", "ignore").decode("ascii"))
            if ascii_decomp:
                pieces.append(ascii_decomp)
            else:
                pieces.append("o")

    ascii_stem = "".join(pieces)
    ascii_stem = re.sub(r"_+", "_", ascii_stem).strip("._-")
    if not ascii_stem:
        ascii_stem = "file"

    return f"{ascii_stem}{ext}"


def is_ascii(s: str) -> bool:
    try:
        return s.isascii()  # type: ignore[attr-defined]
    except AttributeError:
        return all(ord(ch) < 128 for ch in s)


def ensure_unique_path(target_path: Path) -> Path:
    """Legacy helper: unique by adding -N. Kept for compatibility, unused now."""
    if not target_path.exists():
        return target_path
    stem = target_path.stem
    ext = target_path.suffix
    parent = target_path.parent
    counter = 1
    while True:
        candidate = parent / f"{stem}-{counter}{ext}"
        if not candidate.exists():
            return candidate
        counter += 1


def ensure_unique_path_with_reserved(target_path: Path, reserved: set[Path]) -> Path:
    """Ensure unique filename using (1), (2) suffix style, considering reserved set.

    Suffix is inserted before extension: 'name(1).ext'.
    """
    parent = target_path.parent
    stem = target_path.stem
    ext = target_path.suffix

    if (not target_path.exists()) and (target_path not in reserved):
        return target_path

    counter = 1
    while True:
        candidate = parent / f"{stem}({counter}){ext}"
        if (not candidate.exists()) and (candidate not in reserved):
            return candidate
        counter += 1


def _segmentwise_encode(path_like: PurePosixPath, encode_space: bool) -> PurePosixPath:
    safe_chars = "-_.()A-Za-z0-9"
    if not encode_space:
        safe_chars = " " + safe_chars
    encoded_parts = [quote(part, safe=safe_chars) for part in path_like.parts]
    return PurePosixPath(*encoded_parts)


def _segmentwise_decode(path_like: PurePosixPath) -> PurePosixPath:
    decoded_parts = [unquote(part) for part in path_like.parts]
    return PurePosixPath(*decoded_parts)


def _names_equal_fuzzy(a: str, b: str) -> bool:
    if a == b:
        return True
    for form in ("NFC", "NFD", "NFKC", "NFKD"):
        if unicodedata.normalize(form, a) == unicodedata.normalize(form, b):
            return True
    # Case-insensitive fallback (mostly for ASCII)
    if a.lower() == b.lower():
        return True
    return False


def _find_entry_by_name_fuzzy(parent: Path, target_name: str) -> Path | None:
    try:
        for entry in parent.iterdir():
            if _names_equal_fuzzy(entry.name, target_name):
                return entry
    except FileNotFoundError:
        return None
    return None


def resolve_existing_path(base_dir: Path, posix_rel_value: PurePosixPath) -> Path | None:
    """Try multiple encodings/decodings of path segments to find an existing file."""
    candidates: list[PurePosixPath] = []
    # 1) as-is
    candidates.append(posix_rel_value)
    # 2) percent-encode non-ascii, keep spaces
    candidates.append(_segmentwise_encode(posix_rel_value, encode_space=False))
    # 3) percent-encode non-ascii and spaces
    candidates.append(_segmentwise_encode(posix_rel_value, encode_space=True))
    # 4) decode percent-encodings
    candidates.append(_segmentwise_decode(posix_rel_value))

    for cand in candidates:
        abs_path = (base_dir / Path(str(cand))).resolve()
        if abs_path.exists():
            return abs_path
        # Try fuzzy name match in the parent directory (handles NFC/NFD differences)
        parent_abs = (base_dir / Path(str(cand.parent))).resolve()
        if parent_abs.exists() and parent_abs.is_dir():
            found = _find_entry_by_name_fuzzy(parent_abs, cand.name)
            if found is not None:
                return found
    return None


def process_csv(csv_abs_path: Path, image_column_name: str, repo_root: Path, dry_run: bool) -> dict:
    """Process a CSV file, renaming non-ASCII filenames on disk and updating CSV.

    Returns a summary dict.
    """
    rel_base_for_files = Path("data")  # in JS they use "data/" + <value>

    # Read CSV
    with csv_abs_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    if image_column_name not in (fieldnames or []):
        print(f"[WARN] Column '{image_column_name}' not found in {csv_abs_path}")
        return {"processed": 0, "renamed": 0}

    processed = 0
    renamed = 0
    changes = []  # (old_rel_value, new_rel_value, old_file_abs, new_file_abs)
    reserved_new_paths: set[Path] = set()
    value_to_new_value = {}

    for row in rows:
        value = (row.get(image_column_name) or "").strip()
        if not value:
            continue

        processed += 1

        # If we already converted this value before, reuse
        if value in value_to_new_value:
            new_rel_value = value_to_new_value[value]
            row[image_column_name] = new_rel_value
            continue

        # Value example: 'Web .../filename.jpg' → real file under repo_root/'data'
        posix_rel_value = PurePosixPath(value)
        data_dir_abs = (repo_root / rel_base_for_files).resolve()
        old_abs = resolve_existing_path(data_dir_abs, posix_rel_value)

        # 1) Try opening the file via resolvers; if it doesn't exist, skip
        if old_abs is None:
            print(f"[WARN] File not found for CSV value: data/{value}")
            continue

        # 2) Check ASCII based on actual on-disk file name
        old_filename = old_abs.name
        if is_ascii(old_filename):
            continue

        # 3) Non-ASCII: compute ASCII name, plan/perform rename, update CSV
        new_filename = to_ascii_filename(old_filename)
        if new_filename == old_filename:
            # Should not happen, but guard anyway
            continue

        new_posix_rel_value = str(posix_rel_value.with_name(new_filename))
        new_abs = old_abs.with_name(new_filename)

        # Ensure uniqueness of the new file path
        unique_new_abs = ensure_unique_path_with_reserved(new_abs, reserved_new_paths)
        if unique_new_abs.name != new_filename:
            # Also reflect unique suffix in the CSV value
            new_posix_rel_value = str(posix_rel_value.with_name(unique_new_abs.name))

        # Record the change
        changes.append((value, new_posix_rel_value, old_abs, unique_new_abs))
        row[image_column_name] = new_posix_rel_value
        value_to_new_value[value] = new_posix_rel_value
        renamed += 1
        reserved_new_paths.add(unique_new_abs)

    # Report
    for old_rel, new_rel, old_abs, new_abs in changes:
        print(f"- {csv_abs_path.name}: '{old_rel}' → '{new_rel}'")
        print(f"  file: {old_abs} → {new_abs}")

    # Apply file renames and write CSV (unless dry-run)
    if not dry_run:
        for _, _, old_abs, new_abs in changes:
            if not old_abs.exists():
                print(f"[WARN] File not found: {old_abs}")
                continue
            new_abs.parent.mkdir(parents=True, exist_ok=True)
            try:
                old_abs.rename(new_abs)
            except OSError as e:
                print(f"[ERROR] Failed to rename '{old_abs}' → '{new_abs}': {e}")

        # Write back CSV with updated rows
        with csv_abs_path.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)

    return {"processed": processed, "renamed": renamed}


def transform_csv_column(csv_abs_path: Path, column_name: str, pattern: str, replacement: str, dry_run: bool) -> dict:
    """Apply a regex substitution to each value in a column and overwrite the CSV.

    Returns a summary dict with counts.
    """
    # Read CSV
    with csv_abs_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    if column_name not in (fieldnames or []):
        print(f"[WARN] Column '{column_name}' not found in {csv_abs_path}")
        return {"rows": 0, "changed": 0, "removed": 0, "kept": 0}

    regex = re.compile(pattern)
    total_rows = 0
    changed = 0
    removed = 0
    new_rows: list[dict[str, str]] = []

    for row in rows:
        original_value = row.get(column_name)
        total_rows += 1

        # Treat missing as empty → remove row
        if original_value is None:
            removed += 1
            continue

        new_value = regex.sub(replacement, original_value)

        # If target column becomes empty after transform, drop the row
        if (new_value or "").strip() == "":
            removed += 1
            continue

        if new_value != original_value:
            row[column_name] = new_value
            changed += 1

        # Drop rows that are entirely empty across all fields (avoid blank data rows)
        if not any(((str(v).strip()) if v is not None else "") for v in row.values()):
            removed += 1
            continue

        new_rows.append(row)

    print(
        f"- {csv_abs_path.name}: column '{column_name}' regex transform → changed {changed}/{total_rows}, removed {removed}"
    )

    if not dry_run:
        with csv_abs_path.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(new_rows)

    return {"rows": total_rows, "changed": changed, "removed": removed, "kept": len(new_rows)}


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Fix non-ASCII image filenames referenced by CSVs and rename files accordingly.")
    parser.add_argument("--dry-run", action="store_true", help="Show planned changes without modifying files or CSVs")
    args = parser.parse_args(argv)

    repo_root = compute_repo_root()

    # Resolve absolute CSV paths from the copied strings
    people_csv_abs = (repo_root / PEOPLE_CSV_PATH_STR.lstrip("/")).resolve()
    news_csv_abs = (repo_root / NEWS_CSV_PATH_STR.lstrip("/")).resolve()

    print(f"Repo root: {repo_root}")
    print(f"People CSV: {people_csv_abs}")
    print(f"News CSV:   {news_csv_abs}")
    print(f"Dry run:    {args.dry_run}")

    totals = {"processed": 0, "renamed": 0}

    # People CSV, column 'image'
    if people_csv_abs.exists():
        res_people = process_csv(people_csv_abs, "image", repo_root, args.dry_run)
        totals["processed"] += res_people["processed"]
        totals["renamed"] += res_people["renamed"]
    else:
        print(f"[WARN] People CSV not found: {people_csv_abs}")

    # News CSV, column 'Title Image'
    if news_csv_abs.exists():
        # Apply regex transform to Path column: "제목 없음 (값)" → "값"
        transform_csv_column(
            news_csv_abs,
            "Path",
            r"^제목\s*없음\s*\(([^)]*)\)\s*$",
            r"\1",
            args.dry_run,
        )

        res_news_title_image = process_csv(news_csv_abs, "Title Image", repo_root, args.dry_run)
        totals["processed"] += res_news_title_image["processed"]
        totals["renamed"] += res_news_title_image["renamed"]

        res_news_path = process_csv(news_csv_abs, "Path", repo_root, args.dry_run)
        totals["processed"] += res_news_path["processed"]
        totals["renamed"] += res_news_path["renamed"]
    else:
        print(f"[WARN] News CSV not found: {news_csv_abs}")

    print("")
    print(f"Done. Rows with images processed: {totals['processed']}, filenames changed: {totals['renamed']}")
    if args.dry_run:
        print("No changes were written due to --dry-run.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


