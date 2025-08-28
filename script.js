// let audio = new Audio();
// let currentSong = null;

// async function getSongs() {
//     let a = await fetch("http://127.0.0.1:5501/songs/");
//     let response = await a.text();

//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     let songs = [];

//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             let url = element.href;
//             let fileName = decodeURIComponent(url.split("/").pop());
//             songs.push({ name: fileName, url: url });
//         }
//     }
//     return songs;
// }

// getSongs().then(songs => {
//     let songList = document.getElementById("songList");

//     songs.forEach((song, i) => {
//         let li = document.createElement("li");
//         li.textContent = song.name;
//         li.addEventListener("click", () => {
//             audio.src = song.url;
//             audio.play();
//             currentSong = i;
//         });
//         songList.appendChild(li);
//     });

//     // Play/Pause button
//     let playBtn = document.getElementById("playbtn");
//     playBtn.addEventListener("click", () => {
//         if (!audio.src && songs.length > 0) {
//             audio.src = songs[0].url;
//             audio.play();
//             currentSong = 0;
//         } else if (audio.paused) {
//             audio.play();
//         } else {
//             audio.pause();
//         }
//     });
// });


// // Set max seekbar value when metadata is loaded
// audio.onloadedmetadata = () => {
//     seekbar.max = Math.floor(audio.duration);
// };

// // Update seekbar as song plays
// audio.ontimeupdate = () => {
//     seekbar.value = Math.floor(audio.currentTime);
// };

// // Seek when user drags slider
// seekbar.oninput = () => {
//     audio.currentTime = seekbar.value;
// };








// script.js

let audio = new Audio();
let currentSong = null;
let songs = [];

// UI elements
const songList = document.getElementById("songList"); 

const playBtn = document.getElementById("playbtn");
const nextBtn = document.getElementById("nextbtn");
const prevBtn = document.getElementById("prevbtn");
const seekbar = document.getElementById("seekbar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Fetch songs from backend API
async function getSongs() {
    let res = await fetch("/api/songs");   // ✅ call API
    let files = await res.json();

    // Append to songs array
    songs = files.map(file => ({
        name: file,
        url: `/songs/${file}`   // ✅ served statically by express
    }));

    renderSongs();
}

// Render song list
function renderSongs() {
    songList.innerHTML = "";
    songs.forEach((song, i) => {
        let li = document.createElement("li");
        li.textContent = song.name;
        li.classList.add("song-item");

        // Append logic ✅
        li.addEventListener("click", () => {
            playSong(i);
        });

        songList.appendChild(li);
    });
}

// Play specific song
function playSong(index) {
    audio.src = songs[index].url;
    audio.play();
    currentSong = index;
    updatePlayButton();
}

// Toggle play/pause
function togglePlay() {
    if (!audio.src && songs.length > 0) {
        playSong(0);
    } else if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayButton();
}

// Next song
function playNext() {
    if (currentSong !== null) {
        let nextIndex = (currentSong + 1) % songs.length;
        playSong(nextIndex);
    }
}

// Previous song
function playPrev() {
    if (currentSong !== null) {
        let prevIndex = (currentSong - 1 + songs.length) % songs.length;
        playSong(prevIndex);
    }
}

// Format time in mm:ss
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Update play button UI
function updatePlayButton() {
    if (audio.paused) {
        playBtn.textContent = "▶️"; // play icon
    } else {
        playBtn.textContent = "⏸️"; // pause icon
    }
}

// Event listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

audio.addEventListener("loadedmetadata", () => {
    seekbar.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    seekbar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

seekbar.addEventListener("input", () => {
    audio.currentTime = seekbar.value;
});

// Auto play next song when one ends
audio.addEventListener("ended", playNext);

// Load songs on start
getSongs();
