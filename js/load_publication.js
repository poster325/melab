const contatiner = document.getElementById("publications_container");
let prev_year = 3000;


// const response = await fetch('/assets/egu')
// if (!response.ok) {
//     throw new Error('error')
// }
// const text = await response.text();
// console.log(text);


readTextFile();
function readTextFile() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "./assets/publication/publication.tsv", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            let data_str = allText;
            // console.log(data_str)
            let [data_list, headers] = csvToArray(data_str);
            
            let category = {};
            headers.forEach(e => {
                category[e] = [];
            })
            data_list.forEach(e => {
                headers.forEach(h => {
                    if(category[h].indexOf(e[h]) == -1) {
                        category[h].push(e[h]);
                    }
                })
            });
            // console.log(category);
        
            let data_element = [];
            let area_data = document.getElementById("area-data");
            let data = data_list;
            // console.log(data)
        
            data.forEach((e, i, a) => {
                // console.log(e);
                const title = e["논문제목"];
                let author = e["전체저자(최대 1000명)"].slice(1);
                author = author.split("; ").map(e => {
                    return e.split("[")[0]
                }).join("; ")
                const year = e["게재년도"];
                const journal = e["저널명"];
                const link = e["DOI"];
                const temp_publication_card = document.createElement('a');
                temp_publication_card.classList.add("hover_dim");
                temp_publication_card.style.textDecoration = "none";
                // temp_publication_card.href = e["Link"];
                temp_publication_card.target = "_blank"
                temp_publication_card.innerHTML = `
                <div style="display: flex; gap: 24px; padding: 12px">
                    <div style="flex: 1; font-size: 14px; font-weight: 600; color: black; cursor: pointer;" OnClick="window.open('${link}', '_newtab')">
                        ${title}
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                        <div class="clamp" style="font-size: 10px; color: black;", OnClick="if(this.classList.contains('clamp')){this.classList.remove('clamp');}else{this.classList.add('clamp');}">
                            ${author}
                        </div>
                        <div style="font-size: 10px; color: #D9D9D9;">
                            ${year}${journal ? ", "+ journal : ""}
                        </div>
                    </div>
                </div>
                `

                if(parseInt(year) < prev_year){
                    temp_publication_card.id = year;
                    prev_year = parseInt(year);
                }
                contatiner.appendChild(temp_publication_card);

                if(i != data.length - 1){
                    const line = document.createElement('div');
                    line.style.height = "1px";
                    line.style.width = "100%";
                    line.style.borderBottom = "solid 1px #EFEFEF";
                    line.style.margin = "0"
                    contatiner.appendChild(line);
                }
            })
            
            // Trigger reveal animations after content is loaded
            setTimeout(() => {
              if (window.triggerContentReveals) {
                window.triggerContentReveals();
              }
            }, 300);
        }
    }

    rawFile.send();
}

function csvToArray(str, delimiter = "\t") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
        // console.log(row);
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return [arr, category];
    return [arr, headers];
}