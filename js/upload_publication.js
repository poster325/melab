// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// import { getDatabase, ref, child, get, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// import { getStorage, ref as sRef, uploadBytes } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyDkGbaEx-dVM3zsyAqJwP7AhSP0YvZd-XQ",
//     authDomain: "meweb-abd9d.firebaseapp.com",
//     databaseURL: "https://meweb-abd9d-default-rtdb.firebaseio.com",
//     projectId: "meweb-abd9d",
//     storageBucket: "meweb-abd9d.appspot.com",
//     messagingSenderId: "544724623742",
//     appId: "1:544724623742:web:c758ff73078fbcb6f2132f"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const title = document.getElementById("title");
// const image = document.getElementById("image");
// const contents = document.getElementById("contents");
// const datetime = document.getElementById("datetime");
// const submit = document.getElementById("submit");

// const db = getDatabase();
// const storage = getStorage();
// const storageRef = sRef(storage, 'News');

// document.getElementById('image').onchange = function (evt) {
//     var tgt = evt.target || window.event.srcElement,
//         files = tgt.files;
    
//     // FileReader support
//     if (FileReader && files && files.length) {
//         var fr = new FileReader();
//         fr.onload = function () {
//             document.getElementById('img').src = fr.result;
//         }
//         fr.readAsDataURL(files[0]);
//     }
    
//     // Not supported
//     else {
//         // fallback -- perhaps submit the input to an iframe and temporarily store
//         // them on the server until the user's session ends.
//     }
// }


// submit.onclick = () => {
//     const selectedFile = image.files[0];
//     console.log(selectedFile)

//     uploadBytes(storageRef, selectedFile).then((snapshot) => {
//         console.log('Uploaded a blob or file!');
//     });
    

//     // const newsData = {
//     //     url: "",
//     //     img: "",
//     //     location: "",
//     //     text: contents.value,
//     //     time: datetime.value,
//     //     title: title.value,
//     // }
//     // const newPostKey = push(child(ref(db), 'news')).key;

//     // const updates = {};
//     // updates['/news/' + newPostKey] = newsData;
//     // const result = update(ref(db), updates);
// }