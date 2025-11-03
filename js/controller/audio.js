
import * as model from "../config/model.js";
import * as db from "../config/db.js";
import * as util from '../controller/until.js';
import * as songService from "../services/songs-service.js";

// Các phần tử DOM

const audio = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause");
const seekBar = document.getElementById("seek-bar");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");

// Format time (s -> mm:ss)
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<img src="../asset/media-player-music-pause-svgrepo-com.svg" alt="Play/Pause" style="width: 24px; height: 24px;">';;
  } else {
    audio.pause();
    playPauseBtn.innerHTML =  '<img src="../asset/music-play-play-button-svgrepo-com.svg" alt="Play/Pause" style="width: 24px; height: 24px;">';
  }
});

// Update duration when audio loaded
audio.addEventListener("loadedmetadata", () => {
  seekBar.max = Math.floor(audio.duration);
  durationSpan.textContent = formatTime(audio.duration);
});

// Update seek bar while playing
audio.addEventListener("timeupdate", () => {
  seekBar.value = Math.floor(audio.currentTime);
  currentTimeSpan.textContent = formatTime(audio.currentTime);
});

// Seek when user changes bar
seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

// function changeParamLocation(songId) {
//       document.querySelectorAll('a').forEach(link => {
//       const url = new URL(link.href);
//       const currentParams = new URLSearchParams(window.location.search);
//       const params = Object.fromEntries(currentParams);
//       const songId = currentParams.get('song');

//       if (songId) {
//         url.searchParams.set('song', songId);
//         link.href = url.toString();
//       }
// });
// }




async function loadSongFromURLParam() {
  const params = new URLSearchParams(window.location.search);
  const songId = params.get("song");
  const time = params.get("time");
  if (!songId) return; // Không có ?song=id → không làm gì

  const song = await songService.fetchSongFromFirebase(songId);
  console.log(song);
  if (song) {
    const audioPlayer = document.getElementById("audio-player");
    const banner = document.getElementById("player-banner");
    const nowPlaying = document.getElementById("now-playing-info");
    const playerThumbnail = document.getElementById("player-thumbnail");

    audioPlayer.src = song.url;
    nowPlaying.innerHTML = `<strong>${song.title}</strong> - ${song.author?.map(a => a.name).join(", ") || "Không rõ tác giả"}`;
    playerThumbnail.src = song.thumbnail || "default-thumbnail.jpg";
    banner.style.display = "flex";
    if (time) audioPlayer.currentTime = time;
    util.changeParamLocation(songId); // Cập nhật các liên kết khác với ID bài hát
  } else {
    console.error("Không thể tải bài hát từ Firebase");
  }
}

// Gắn sự kiện cho tất cả các thẻ <a> để giữ lại param song và time khi chuyển trang
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    const audio = document.getElementById('audio-player');
    if (!audio) return;

    const currentTime = Math.floor(audio.currentTime); // thời gian hiện tại
    const params = new URLSearchParams(window.location.search);
    const songId = params.get('song');

    if (!songId) return; // không có bài hát → không cần xử lý

    // Ngăn chuyển trang ngay
    e.preventDefault();

    // Gắn lại param vào URL đích
    const url = new URL(link.href, window.location.origin);
    url.searchParams.set('song', songId);
    url.searchParams.set('time', currentTime);

    // Chuyển hướng với URL mới
    window.location.href = url.toString();
  });
});



//favorite
const favoriteBtn = document.getElementById('favorite-btn');
const favoriteIcon = document.getElementById('favorite-icon');
let isFavorite = false;

// Giả sử đây là id bài hát hiện tại



// Lấy danh sách yêu thích từ localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
let users = JSON.parse(localStorage.getItem('users')) || [];

// Nếu chưa có mảng favoriteSongs thì tạo mới
if (!Array.isArray(currentUser.favoriteSongs)) {
  currentUser.favoriteSongs = [];
}

// Cập nhật icon trái tim khi load
function updateFavoriteIcon() {
  const params = new URLSearchParams(window.location.search);
  const currentSongId = params.get("song");
  const isFavorite = currentUser.favoriteSongs.includes(currentSongId);
  favoriteIcon.src = isFavorite 
    ? '../asset/favorite_24dp_75FBFD_FILL1_wght400_GRAD0_opsz24.svg'
    : '../asset/favorite_24dp_75FBFD_FILL0_wght400_GRAD0_opsz24.svg';
}

// Xử lý khi bấm nút yêu thích
favoriteBtn.addEventListener('click', () => {
  const params = new URLSearchParams(window.location.search);
  const currentSongId = params.get("song");
  const isFavorite = currentUser.favoriteSongs.includes(currentSongId);

  if (isFavorite) {
    // Nếu đã có thì xóa
    currentUser.favoriteSongs = currentUser.favoriteSongs.filter(id => id !== currentSongId);
  } else {
    // Nếu chưa có thì thêm
    currentUser.favoriteSongs.push(currentSongId);
  }

  // Lưu lại user hiện tại
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Cập nhật lại trong danh sách users (nếu có nhiều tài khoản)
  const index = users.findIndex(u => u.username === currentUser.username);
  if (index !== -1) {
    users[index] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Cập nhật icon
  updateFavoriteIcon();
});


window.addEventListener("DOMContentLoaded", () => {
  loadSongFromURLParam();
  updateFavoriteIcon();
});

window.addEventListener("beforeunload", function (e) {
    console.log("User is leaving the page...");
});