var page = 2;

var scroll_ended = true;

currentPage(2);

window.addEventListener("wheel", function(e) {
    if(scroll_ended == false) return;
    if(e.deltaY > 0) {
        if(page == 3) return;
        page++;
        if(page > 3) page = 3;
    }
    if(e.deltaY < 0) {
        if(page == 1) return;
        page--;
        if(page < 1) page = 1;
    }
    currentPage(page);
})


document.addEventListener("DOMContentLoaded", function() {
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
