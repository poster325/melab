var page = 2;

var scroll_buffer = 0;
const sec2_scroll_buffer_max = 5000;

var scroll_ended = true;

currentPage(2);

window.addEventListener("wheel", function(e) {
    if(scroll_ended == false) return;
    if(e.deltaY > 0) {
        if(page == 3) return;
        if(page == 2){
        if(scroll_buffer < sec2_scroll_buffer_max){
            scroll_buffer += e.deltaY * 10;
            //console.log(scroll_buffer);
            changeImage(scroll_buffer, sec2_scroll_buffer_max);
            return;
        }
        }
        page++;
        if(page == 2) {
        scroll_buffer = 0;
        changeImage(0, sec2_scroll_buffer_max);
        }
        if(page > 3) page = 3;
    }
    if(e.deltaY < 0) {
        if(page == 1) return;
        if(page == 2){
            if(scroll_buffer > 0){
                scroll_buffer += e.deltaY * 10;
                // console.log(scroll_buffer);
                changeImage(scroll_buffer, sec2_scroll_buffer_max);
                return;
            }
        }
        page--;
        if(page == 2) {
        scroll_buffer = sec2_scroll_buffer_max;
        changeImage(sec2_scroll_buffer_max, sec2_scroll_buffer_max);
        }
        if(page < 1) page = 1;
    }
    currentPage(page);
})


var earth_year = 1;
var earth_image_storage = [];
page = 2;

document.addEventListener("DOMContentLoaded", function() {
    for(let i=1; i<=251; i++){
        earth_image_storage[i] = new Image();
        earth_image_storage[i].src = "./assets/index/earth_animation/" + i.toString().padStart(4, '0') + ".png";
    }

    changeImage(0, sec2_scroll_buffer_max);

    window.scrollTo({
        top: (2 - 1) * window.innerHeight,
        left: 0,
        behavior: "instant",
    });
});

function currentPage(idx) {
    page = idx;
    window.scrollTo({
        top: (page - 1) * window.innerHeight,
        left: 0,
        behavior: "smooth",
    });
    scroll_ended = false;
    addEventListener("scrollend", () => {
        scroll_ended = true;
    });

    if(idx == 1){
        if(document.getElementById("latest_news").style.opacity = "40%"){
            document.getElementById("latest_news").style.opacity = "100%";
        }
        if(document.getElementById("introduction").style.opacity = "100%"){
            document.getElementById("introduction").style.opacity = "40%";
        }
        if(document.getElementById("public_work").style.opacity = "100%"){
          document.getElementById("public_work").style.opacity = "40%";
        }
      }
      else if(idx == 2){
        if(document.getElementById("latest_news").style.opacity = "100%"){
            document.getElementById("latest_news").style.opacity = "40%";
        }
        if(document.getElementById("introduction").style.opacity = "40%"){
            document.getElementById("introduction").style.opacity = "100%";
        }
        if(document.getElementById("public_work").style.opacity = "100%"){
          document.getElementById("public_work").style.opacity = "40%";
        }
      }
      else if(idx == 3){
        if(document.getElementById("latest_news").style.opacity = "100%"){
            document.getElementById("latest_news").style.opacity = "40%";
        }
        if(document.getElementById("introduction").style.opacity = "100%"){
            document.getElementById("introduction").style.opacity = "40%";
        }
        if(document.getElementById("public_work").style.opacity = "40%"){
          document.getElementById("public_work").style.opacity = "100%";
        }
      }
}

function changeImage(idx, idx_max) {
    imsi = parseInt(1 + 250 * (idx / idx_max));
    if(imsi < 1) imsi = 1;
    if(imsi > 251) imsi = 251;
    if(imsi > earth_year){
        for(let i=earth_year; i <= imsi; i++){
        document.getElementById("earth").src = earth_image_storage[i].src;
        if(i <= 151 + 15) document.getElementById('earth_date').innerHTML = "Historical, A.D. " + (1849 + i)
        else document.getElementById('earth_date').innerHTML = "SSP585, A.D. " + (1849 + i)
        }
    } else {
        for(let i=earth_year; i >= imsi; i--){
        document.getElementById("earth").src = earth_image_storage[i].src;
        if(i <= 151 + 15) document.getElementById('earth_date').innerHTML = "Historical, A.D. " + (1849 + i)
        else document.getElementById('earth_date').innerHTML = "SSP585, A.D. " + (1849 + i)
        }
    }
    earth_year = imsi;
}