import * as songService from "../services/songs-service.js";
import * as artistService from "../services/artist-service.js";
import * as albumService from "../services/album-service.js";
import * as model from "../config/model.js";
import * as util from "../controller/until.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function renderTrendingAlbums() {
  const albums = await albumService.getAllAlbum();
  albums.slice(0, 4);
  const list = document.getElementById("trending-albums");
  list.innerHTML = "";
  albums.forEach(async (album) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <img src="${album.thumbnail}" alt="${album.title}">
        <div>
          <strong>${album.title}</strong>
          <div class="author">${await artistService.getNameArtist(
            album.author
          )}</div>
        </div>
      `;
    list.appendChild(li);
  });
}

async function renderTrendingSongs() {
  const songs = await songService.getAllSongs();
  const trending = songs.slice(0, 4); // Lấy 4 bài hát đầu tiên
  const list = document.getElementById("trending-songs");
  list.innerHTML = "";
  trending.forEach(async (song) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${song.thumbnail}" alt="${song.title}">
      <div>
        <strong>${song.title}</strong>
        <div class="author">${
          (await artistService.getNameArtist(song.author)) || ""
        }</div>
      </div>
    `;
    list.appendChild(li);
  });
}

async function renderTrendingArtists() {
  const artists = await artistService.getAllArtist();
  const shuffled = shuffleArray(artists).slice(0, 4);
  const list = document.getElementById("trending-artists");
  list.innerHTML = "";
  shuffled.forEach((artist) => {
    const li = document.createElement("li");
    li.innerHTML = `
     <img src="${artist.avtURL || ""}" alt="${artist.name}">
<div class="author">🎤 ${artist.name}</div>`;
    list.appendChild(li);
  });
}

// Render các bài hát khác
async function renderOtherSongs() {
  const songs = await songService.getAllSongs();
  const list = document.getElementById("other-songs");
  list.innerHTML = "";
  for (const song of songs) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card d-flex flex-row align-items-center p-2 mb-2">
        <img src="${song.thumbnail}" alt="${
      song.title
    }" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
        <div class="info flex-grow-1">
          <strong>${song.title}</strong><br>
          <small class="author text-muted">${
            (await artistService.getNameArtist(song.author)) ||
            "Không rõ tác giả"
          }</small>
        </div>
        <button class="play-btn btn btn-success" data-id="${
          song.id
        }" data-thumbnail="${song.thumbnail}" data-src="${
      song.url
    }" data-title="${song.title}" data-author="${
      (await artistService.getNameArtist(song.author)) || "Không rõ tác giả"
    }">▶</button>
      </div>
    `;
    list.appendChild(li);
  }
  // Gắn sự kiện play cho từng nút
  const playButtons = document.querySelectorAll(".play-btn");
  playButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      const title = btn.getAttribute("data-title");
      const author = btn.getAttribute("data-author");
      const thumbnail = btn.getAttribute("data-thumbnail");

      const audioPlayer = document.getElementById("audio-player");
      const banner = document.getElementById("player-banner");
      const nowPlaying = document.getElementById("now-playing-info");
      const playerThumbnail = document.getElementById("player-thumbnail");

      playerThumbnail.src = thumbnail || "default-thumbnail.jpg";
      audioPlayer.src = src;
      audioPlayer.play();

      nowPlaying.innerHTML = `<strong>${title}</strong> - ${author}`;
      banner.style.display = "flex";
      util.changeParamLocation(btn.getAttribute("data-id"));
    });
  });
}

// Render các nghệ sĩ khác
async function renderOtherArtists() {
  const artists = await artistService.getAllArtist();
  const list = document.getElementById("other-artists");
  list.innerHTML = "";
  artists.forEach((artist) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card">
        <img src="${artist.avtURL || ""}" alt="${artist.name}">
        <div class="info">
          <strong>${artist.name}</strong>
          <div class="author">Nghệ sĩ</div>
        </div>
      </div>
    `;
    li.addEventListener("click", () => {
      window.location.href = `artists-details.html?id=${artist.id}`;
    });
    list.appendChild(li);
  });
}

// Render các album khác
async function renderOtherAlbums() {
  const albums = await albumService.getAllAlbum();
  const list = document.getElementById("other-albums");
  list.innerHTML = "";
  albums.forEach(async (album) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card d-flex flex-row align-items-center p-2 mb-2">
        <img src="${album.thumbnail}" alt="${
      album.title
    }" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
        <div class="info flex-grow-1">
          <strong>${album.title}</strong><br>
          <small class="author text-muted">${
            (await artistService.getNameArtist(album.author)) ||
            "Không rõ tác giả"
          }</small>
        </div>
      </div>
    `;
    li.addEventListener("click", () => {
      window.location.href = `albums-songs.html?id=${album.id}`;
    });
    list.appendChild(li);
  });
}

// Gọi các hàm khi trang tải
document.addEventListener("DOMContentLoaded", () => {
  renderTrendingAlbums();
  renderTrendingSongs();
  renderTrendingArtists();
  renderOtherSongs();
  renderOtherArtists();
  renderOtherAlbums();
});
