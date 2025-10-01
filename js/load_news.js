const contatiner = document.getElementById("news");

const response = await fetch('./data/news/News acdaa45f52dd43c09e2773b1e2070fd6.csv')
if (!response.ok) {
    throw new Error('error')
}
// console.log(response);
const text = await response.text();
//console.log(text);
let [data_list, headers] = csvToArray(text);
// console.log(data_list, headers)

// Store highlighted news data
let highlightedNews = [];

for(let i=0; i<data_list.length; i++){
    let data = data_list[i]

    //console.log(data);
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
    // console.log(content.split('\n\n').splice(2).join('\n\n'))

    // Store first 3 for highlighted section
    if (highlightedNews.length < 3) {
        highlightedNews.push({
            title: title,
            time: time,
            image: image,
            location: location,
            content: content,
            link: link
        });
    }

    const temp_news_card = document.createElement('a');
    temp_news_card.classList.add("hover_dim");
    temp_news_card.style.textDecoration = "none";
    temp_news_card.style.aspectRatio = "4/3";
    temp_news_card.style.backgroundColor = "#F9F9F9";
    temp_news_card.style.borderRadius = "8px";
    temp_news_card.style.display = "flex";
    temp_news_card.style.flexDirection = "column";
    temp_news_card.style.color = "black";

    temp_news_card.innerHTML = `
        <div style="width: 100%; flex: 1; border-radius: 4px 4px 0px 0px; background-image: url(${image}); background-size: cover;"></div>
        <div style="padding: 12px; background-color: #F9F9F9; border-radius: 0px 0px 4px 4px; display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 12px; font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</div>
            <div style="font-size: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${content}</div>
            <div style="font-size: 10px; color: #A6A6A6;">${time}, ${location}</div>
        </div>
    `
    contatiner.appendChild(temp_news_card);
}

// Initialize highlighted news slideshow
if (highlightedNews.length > 0) {
    initHighlightedNews(highlightedNews);
}



// Initialize highlighted news slideshow
function initHighlightedNews(newsData) {
    const highlightedImage = document.getElementById('highlighted_image');
    const highlightedTitle = document.getElementById('highlighted_title');
    const highlightedContent = document.getElementById('highlighted_content');
    const highlightedTime = document.getElementById('highlighted_time');
    
    const btn1 = document.getElementById('highlight_btn1');
    const btn2 = document.getElementById('highlight_btn2');
    const btn3 = document.getElementById('highlight_btn3');
    
    function changeHighlighted(index) {
        const news = newsData[index];
        highlightedImage.style.backgroundImage = `url(${news.image})`;
        highlightedTitle.textContent = news.title;
        highlightedContent.textContent = news.content;
        highlightedTime.textContent = `${news.time}, ${news.location}`;
        
        // Update dots
        btn1.style.backgroundColor = index === 0 ? '#000' : '#ccc';
        btn2.style.backgroundColor = index === 1 ? '#000' : '#ccc';
        btn3.style.backgroundColor = index === 2 ? '#000' : '#ccc';
    }
    
    // Initial load
    changeHighlighted(0);
    
    // Attach click handlers
    btn1.onclick = () => changeHighlighted(0);
    btn2.onclick = () => changeHighlighted(1);
    btn3.onclick = () => changeHighlighted(2);
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