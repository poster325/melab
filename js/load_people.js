let selected = "none"; // "member_name"

// XMLHttpRequest

// function testImage(URL) {
//   var tester=new Image();
//   tester.onload=imageFound;
//   tester.onerror=imageNotFound;
//   tester.src=URL;
// }



const response = await fetch('/data/people/People aa379227474043d7a198275297c2fa3f_all.csv')
if (!response.ok) {
    throw new Error('error')
}
// console.log(response);
const text = await response.text();
// console.log(text);
let [data_list, headers] = csvToArray(text);
// console.log(data_list, headers)

const profile_type_container = document.getElementById("profile_type_list");

let types = [
  "Professor",
  "Research Associate Professor",
  "Post-doctoral Researcher",
  "Doctoral Program",
  "Master's program",
  "Undergraduated",
  
  "Alumni"
]
types.forEach(type => {
  const contatiner = document.createElement('div');
  contatiner.id = type;
  contatiner.style.width = "100%";
  // contatiner.style.maxWidth = "1128px";
  contatiner.style.display = "grid";
  contatiner.style.gridTemplateColumns = "repeat(auto-fill, minmax(196px, 1fr))";
  contatiner.style.rowGap = "52px";
  contatiner.style.columnGap = "52px";
  contatiner.style.transition = "300ms";
  if(type == "Alumni") contatiner.style.marginBottom = "256px"

  
  data_list
  .filter(data => {
    if(type == "Alumni"){
      return data["Type"] == "Alumni"
    } else {
      return data["Position"] == type && data["Type"] != "Alumni"
    }
  })
  .sort((a, b) => {
    if(type == "Alumni"){
      return b["Year"] - a["Year"]
    } else {
      let a_num;
      switch(a["Type"]){
        case "Full-time":
          a_num = 3
          break;
        case "Part-time":
          a_num = 2
          break;
        case "leave of absence":
          a_num = 1
          break;
      }

      let b_num;
      switch(b["Type"]){
        case "Full-time":
          b_num = 3
          break;
        case "Part-time":
          b_num = 2
          break;
        case "leave of absence":
          b_num = 1
          break;
      }

      return b_num - a_num || b["Year"] - a["Year"]
    }
  })
  .forEach(data => {
    const name = data["Name"];
    const email = data["email"];
    const position = data["Position"];
    const campus = data["Campus"];
    const image = data["image"] != "" ? "data/people/" + data["image"] : '/assets/people/placeholder.png';

    const temp_people_card = document.createElement('a');
    temp_people_card.classList.add("hover_dim");
    temp_people_card.style.textDecoration = "none";
    temp_people_card.style.width = "100%";
    temp_people_card.style.display = "flex";
    temp_people_card.style.flexDirection = "column";
    temp_people_card.style.gap = "12px";
    temp_people_card.style.textDecoration = "none";
    temp_people_card.style.color = "black";
    temp_people_card.style.cursor = "pointer"

    temp_people_card.innerHTML = `
        ${
          type != "Alumni" ? `<img src="${image}" style="width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px;"/>` : ``
        }
        
        <div style="display: flex; flex-direction: column; justify-content: space-between; flex: 1; gap: 4px">
            <div style="display: flex; flex-direction: column; gap: 0px;">
                <div style="font-size: 16px; font-weight: 600;">${name}</div>
                <div style="font-size: 12px; font-weight: 600;">${position}</div>
            </div>
            <div style="height: 1px; width: 100%; border-bottom: solid 1px #EFEFEF; margin: 0px;"></div>
            <div style="width: 100%; display: flex; flex-direction: column; gap: 0px;">
                <div style="font-size: 12px;">${email}</div>
            </div>
        </div>
    `
    contatiner.appendChild(temp_people_card);

    temp_people_card.onclick = () => {
      // console.log(name.includes("|") ? name.split("|")[1].trim(): name)
      let search_name = name.includes("|") ? name.split("|")[1].trim(): name;

      // console.log(search_name, selected)
      if(search_name == selected){
        selected = "";
        loadMemberData(undefined);
        temp_people_card.scrollIntoView({block: "center"});
      } else {
        fetch('/js/members.json')
        .then(response => response.json())
        .then(members => {
          //console.log(members)
  
          if (search_name) {
            selected = search_name;
            loadMemberData(data);
            temp_people_card.scrollIntoView({block: "center"});
          } else {
            
          }
        })
        .catch(error => {
            
        });
      }
    }
  })

  let temp = document.createElement('div');
  let title = document.createElement('div');
  let hr = document.createElement('hr');
  title.innerHTML = `${type}`
  title.style.fontSize = "16px"
  title.style.fontWeight = "600"
  title.style.color = "rgba(0,0,0,30%)"
  temp.style.display = "flex"
  temp.style.flexDirection = "column"
  temp.style.gap = "24px"
  temp.style.width = "100%"
  temp.appendChild(title);
  temp.appendChild(contatiner);
  temp.appendChild(hr);
  profile_type_container.appendChild(temp);
});

function csvToArray(str, delimiter = ",") {
    // console.log(str)
    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);
    // console.log(headers)
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");
    // console.log(rows)

    const arr = rows.map(row => {
      // console.log(row)
      let values = row.match(/(".*?"|[^",]+|(?<=,)(?=,)|(?<=^)(?=,)|(?<=,)(?=$))/gs);
      // console.log(values)
      values = values ? values.map(value => value.replace(/^"|"$/g, '')) : [];
      // console.log(values)
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      // console.log(el)
      return el;
    });
    
    return [arr, headers];
}




// Function to group publications by year
function groupByYear(publications) {
    return publications.reduce((acc, publication) => {
        const year = publication.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(publication);
        return acc;
    }, {});
}

// Function to load member data based on the name parameter
function loadMemberData(person) {
  const mainContent = document.getElementById('main-info');
  const headerElement = document.getElementById('profile-info');

  if (person) {
    profile_type_container.style.width = "256px";
    types.forEach(type => {
      document.getElementById(type).style.gridTemplateColumns = "repeat(1, minmax(196px, 1fr))";
    })

    
    // Build the HTML content
    let html = '';

    // Main info
    html += `<div class="main-info">`;

    // About section (Research Interest and Background only)
    html += `
        <div>
            <h2>Research</h2>
            <h4>Research Interest</h4>
            <p class="research-theme">${person.Interest || 'No research theme provided.'}</p>
            <h4>Background</h4>
            <p class="research-theme">${person.Background || 'No background information provided.'}</p>
        </div>
    `;

    // Education section
    html += `
        <div class="education">
            <h2>Education</h2>
    `;

    if (person.Education) {
      person.Education.split("\n").forEach(education => {
        html += `<p>${education}</p>`;
      });
    } else {
      html += `<p>No education information provided.</p>`;
    }

    html += `</div>`; // Close education div

    // Publications section
    // html += `
    //     <div class="publications">
    //         <h2>Publications</h2>
    //         <div class="publications-list">
    // `;

    // if (person.hasPublished && person.publications && person.publications.length > 0) {
    //     const publicationsByYear = groupByYear(person.publications);
    //     const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

    //     sortedYears.forEach(year => {
    //         html += `<div class="year-group"><h3>${year}</h3>`;

    //         publicationsByYear[year].forEach((publication, index) => {
    //           let author_text = "";
    //           publication.authors.forEach((author, idx) => {
    //             const isPerson = author.includes(person.name);
    //             author_text += `<span style="${isPerson ? 'font-weight: bold; color: black;' : ''}">${author}</span>`;
    //             if (idx < publication.authors.length -1) {
    //               author_text += ', ';
    //             }
    //           });
    //           html += `
    //           <a class="hover_dim" style="text-decoration: none;" target="_blank">
    //             <div style="display: flex; gap: 24px; padding: 12px">
    //                 <div style="flex: 1; font-size: 14px; font-weight: 600; color: black; cursor: pointer;" OnClick="window.open('${publication.link || '#'}', '_newtab')">
    //                     ${publication.title}
    //                 </div>
    //                 <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
    //                     <div class="clamp" style="font-size: 10px; color: black;", OnClick="if(this.classList.contains('clamp')){this.classList.remove('clamp');}else{this.classList.add('clamp');}">
    //                         ${author_text}
    //                     </div>
    //                     <div style="font-size: 10px; color: #D9D9D9;">
    //                         ${publication.journal || 'N/A'}
    //                     </div>
    //                 </div>
    //             </div>
    //           </a>
    //           `
    //           if(index != publicationsByYear[year] - 1){
    //             html += `<div style="height: 1px; width: 100%; border-bottom: solid 1px #EFEFEF; margin: 0;"></div>`
    //           }
    //         });

    //         html += `</div>`; // Close year-group div
    //     });
    // } else {
    //     html += `<p>No publications available.</p>`;
    // }

    // html += `</div>`; // Close publications-list div
    // html += `</div>`; // Close publications div

    html += `</div>`; // Close main-info div

    // Insert the HTML content into mainContent
    mainContent.innerHTML = html;



    //console.log(person)
    headerElement.innerHTML = `
      <div class="personal-info">
        ${
          person.type != "Alumni" ? `<img src="${person.image == "" ? '/assets/people/placeholder.png' : "data/people/" + person.image}" alt="${person.Name}'s profile" class="profile-img" />` : ``
        }
        <div class="profile-text">
          <div class="name">${person.Name}</div>
          ${person.Position ? `<div class="position">${person.Position}</div>` : ""}
          <div class="email">${person.email}</div>
        </div>
      </div>
    `;

  } else {
    profile_type_container.style.width = "";

    types.forEach(type => {
      document.getElementById(type).style.gridTemplateColumns = "repeat(auto-fill, minmax(196px, 1fr))";
    })

    mainContent.innerHTML = "";
    headerElement.innerHTML = "";
  }
}