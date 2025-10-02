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
        // Skip this news item if file doesn't exist
        continue;
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
    const container = document.getElementById('highlight_cards_container');
    
    const btn1 = document.getElementById('highlight_btn1');
    const btn2 = document.getElementById('highlight_btn2');
    const btn3 = document.getElementById('highlight_btn3');
    
    const prevBtn = document.getElementById('highlight_prev');
    const nextBtn = document.getElementById('highlight_next');
    
    let currentIndex = 0;
    let isAnimating = false;
    const cards = [];
    
    // Create all cards
    newsData.forEach((news, index) => {
        const card = document.createElement('div');
        card.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            background-image: url(${news.image});
            background-size: cover;
            background-position: center;
            transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
            transform: translateX(${index === 0 ? '0%' : '105%'});
            z-index: ${index === 0 ? '10' : '0'};
        `;
        
        // Create text overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 48px 32px;
            box-sizing: border-box;
        `;
        
        const textContainer = document.createElement('div');
        textContainer.style.cssText = 'max-width: 100%; overflow: hidden;';
        
        const title = document.createElement('div');
        title.textContent = news.title;
        title.style.cssText = `
            color: white;
            font-weight: 600;
            font-size: 28px;
            margin-bottom: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `;
        
        const content = document.createElement('div');
        content.textContent = news.content;
        content.style.cssText = `
            color: rgba(255,255,255,0.9);
            font-weight: 400;
            font-size: 16px;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.5;
        `;
        
        const time = document.createElement('div');
        time.textContent = `${news.time}, ${news.location}`;
        time.style.cssText = `
            color: rgba(255,255,255,0.7);
            font-weight: 400;
            font-size: 14px;
        `;
        
        textContainer.appendChild(title);
        textContainer.appendChild(content);
        textContainer.appendChild(time);
        overlay.appendChild(textContainer);
        card.appendChild(overlay);
        container.appendChild(card);
        
        cards.push(card);
    });
    
    function updateDots() {
        btn1.style.backgroundColor = currentIndex === 0 ? '#000' : '#ccc';
        btn2.style.backgroundColor = currentIndex === 1 ? '#000' : '#ccc';
        btn3.style.backgroundColor = currentIndex === 2 ? '#000' : '#ccc';
    }
    
    function updateButtons() {
        // Disable/hide prev button on first slide
        if (currentIndex === 0) {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }
        
        // Disable/hide next button on last slide
        if (currentIndex === newsData.length - 1) {
            nextBtn.style.opacity = '0.3';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    }
    
    function goToSlide(newIndex, direction = 'next') {
        if (isAnimating || newIndex === currentIndex) return;
        
        isAnimating = true;
        const oldIndex = currentIndex;
        
        // Determine slide direction with spacing
        const slideOutDirection = direction === 'next' ? '-105%' : '105%';
        const slideInFrom = direction === 'next' ? '105%' : '-105%';
        
        // Set up new card
        cards[newIndex].style.zIndex = '9';
        cards[newIndex].style.transform = `translateX(${slideInFrom})`;
        
        // Force reflow
        cards[newIndex].offsetHeight;
        
        // Slide out current card
        cards[oldIndex].style.transform = `translateX(${slideOutDirection})`;
        
        // Slide in new card
        cards[newIndex].style.transform = 'translateX(0)';
        
        currentIndex = newIndex;
        updateDots();
        updateButtons();
        
        setTimeout(() => {
            // Reset old card
            cards[oldIndex].style.zIndex = '0';
            
            // Set new card as active
            cards[newIndex].style.zIndex = '10';
            
            isAnimating = false;
        }, 600);
    }
    
    function goToNext() {
        // Don't cycle - stop at last card
        if (currentIndex < newsData.length - 1) {
            goToSlide(currentIndex + 1, 'next');
        }
    }
    
    function goToPrev() {
        // Don't cycle - stop at first card
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1, 'prev');
        }
    }
    
    // Initial state
    updateDots();
    updateButtons();
    
    // Attach click handlers for dots
    btn1.onclick = () => {
        const direction = currentIndex > 0 ? 'prev' : 'next';
        goToSlide(0, direction);
    };
    btn2.onclick = () => {
        const direction = currentIndex > 1 ? 'prev' : 'next';
        goToSlide(1, direction);
    };
    btn3.onclick = () => {
        const direction = currentIndex > 2 ? 'prev' : 'next';
        goToSlide(2, direction);
    };
    
    // Attach click handlers for arrow buttons
    prevBtn.onclick = goToPrev;
    nextBtn.onclick = goToNext;
    
    // Add hover effects for arrow buttons (only when enabled)
    prevBtn.onmouseenter = () => {
        if (currentIndex > 0) {
            prevBtn.style.background = 'rgba(255,255,255,1)';
            prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
        }
    };
    prevBtn.onmouseleave = () => {
        if (currentIndex > 0) {
            prevBtn.style.background = 'rgba(255,255,255,0.9)';
            prevBtn.style.transform = 'translateY(-50%) scale(1)';
        }
    };
    
    nextBtn.onmouseenter = () => {
        if (currentIndex < newsData.length - 1) {
            nextBtn.style.background = 'rgba(255,255,255,1)';
            nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
        }
    };
    nextBtn.onmouseleave = () => {
        if (currentIndex < newsData.length - 1) {
            nextBtn.style.background = 'rgba(255,255,255,0.9)';
            nextBtn.style.transform = 'translateY(-50%) scale(1)';
        }
    };
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
      try {
        const response = await fetch('./data/news/' + filepath)
        if (!response.ok) {
          console.warn('News file not found:', filepath);
          return null;
        }
        const text = await response.text();
        // console.log(text);
        return text;
      } catch (error) {
        console.warn('Error loading news file:', filepath, error);
        return null;
      }
    }
    return null;
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