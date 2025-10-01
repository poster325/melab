const response = await fetch('./data/news/News acdaa45f52dd43c09e2773b1e2070fd6.csv')
if (!response.ok) {
    throw new Error('error')
}
// console.log(response);
const text = await response.text();
// console.log(text);
let [data_list, headers] = csvToArray(text);

let recentData = [];
for(let i=0; i<3; i++){
    let data = data_list[i]

    const title = data["Title"];
    const time = data["Time"];
    const image = "./data/news/" + data["Title Image"];
    const location = data["Location"];
    let link = data["URL"];

    const path = data["Path"];

    let content = await loadNewsMD(path);
    if (content == null) {
        continue
    }
    content = content.split('\n\n').splice(2).join('\n\n')

    recentData.push({
        title: title,
        time: time,
        image: image,
        location: location,
        link: link,
        path: path,
        content: content,
    });
}
changeNews(0);



function changeNews(i){
    const e = recentData[i];

    const title = e["title"];
    const time = e["time"];
    const content = e["content"];
    const image = e["image"];
    const location = e["location"];
    let link = e["link"];

    document.getElementById("image").style.backgroundImage = `url(${image})`;
    document.getElementById("title").innerHTML = title;
    document.getElementById("content").innerHTML = content;
    document.getElementById("time").innerHTML = time;
}

const btn1 = document.getElementById("slideshow_btn1");
btn1.onclick = () => {
    changeNews(0);
    btn1.style.backgroundColor = "grey"
    btn2.style.backgroundColor = "white"
    btn3.style.backgroundColor = "white"
}
const btn2 = document.getElementById("slideshow_btn2");
btn2.onclick = () => {
    changeNews(1);
    btn1.style.backgroundColor = "white"
    btn2.style.backgroundColor = "grey"
    btn3.style.backgroundColor = "white"
}
const btn3 = document.getElementById("slideshow_btn3");
btn3.onclick = () => {
    changeNews(2);
    btn1.style.backgroundColor = "white"
    btn2.style.backgroundColor = "white"
    btn3.style.backgroundColor = "grey"
}

btn1.style.backgroundColor = "grey"
btn2.style.backgroundColor = "white"
btn3.style.backgroundColor = "white"



function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
        const values = CSVToArray(row, delimiter)[0];
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return [arr, category];
    return [arr, headers];
}

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
  
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
  
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
  
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );
  
  
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
  
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
  
  
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
  
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];
  
      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {
  
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
  
      }
  
      var strMatchedValue;
  
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
  
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );
  
      } else {
  
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
  
      }
  
  
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }
  
    // Return the parsed data.
    return (arrData);
}
async function loadNewsMD(filepath, use_regex = false) {
    // console.log(filepath)
    if (use_regex) {
      var matches = filepath.match(/\((.*?)\)/);
      if (matches) {
        filepath = matches[1];
      }
    }
    if (filepath) {
        const response = await fetch('./data/news/' + filepath)
        if (!response.ok) {
            throw new Error('error')
        }
        const text = await response.text();
        // console.log(text);
        return text;
    }
}