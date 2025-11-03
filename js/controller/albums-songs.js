import * as songService from "../services/songs-service.js";
import * as albumService from "../services/album-service.js";
import * as util from "./until.js";


function renderAlbumDetails(album) {
    console.log('renderAlbumDetails -> album:', album);
    const poster = document.getElementById('album-poster');
    const titleEl = document.getElementById('album-title');
    if (!poster && !titleEl) {
        console.warn('Không tìm thấy #album-poster hoặc #album-title trong DOM');
        return;
    }
    if (titleEl) titleEl.textContent = album?.title || '';
    const posterUrl = album?.poster || album?.thumbnail || '';
    // dùng ảnh mặc định nếu không có url hợp lệ
    const fallback = '../asset/default-album.jpg';
    if (poster) {
        poster.src = posterUrl || fallback;
        poster.onerror = () => { poster.src = fallback; };
    }
}

function loadSongByAlbum(songs) {
    console.log(songs);
    if(songs){
        const tbody = document.getElementById('song-table-body');
        tbody.innerHTML = "";

        songs.forEach((song, index) => {
            console.log(song)
            const tr = document.createElement('tr');
            tr.id = "play-btn";
            tr.setAttribute("data-src", song.url);
            tr.setAttribute("data-title", song.title);
            tr.setAttribute("data-artist", song.author.map(a => a.name).join(', '));
            tr.setAttribute("data-thumbnail", song.thumbnail);
            tr.setAttribute("data-id", song.id);

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><img class="song-thumbnail" src="${song.thumbnail}" alt="${song.title}"></td>
                <td>${song.title}</td>
                <td class="author-name">${song.author.map(a => a.name).join(', ')}</td>
            `;

            // 🔹 Gắn sự kiện click phát nhạc
            tr.addEventListener("click", () => {
                const audioPlayer = document.getElementById("audio-player");
                const banner = document.getElementById("player-banner");
                console.log(banner);
                const nowPlaying = document.getElementById("now-playing-info");
                const playerThumbnail = document.getElementById("player-thumbnail");

                playerThumbnail.src = song.thumbnail || "default-thumbnail.jpg";
                audioPlayer.src = song.url;
                audioPlayer.play();

                nowPlaying.innerHTML = `<strong>${song.title}</strong> - ${song.author.map(a => a.name).join(', ')}`;
                banner.style.display = "flex";

                const params = new URLSearchParams(window.location.search);
                params.set('song', song.id);
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.replaceState({}, '', newUrl);
                changeParamLocation(song.id);
            });

            tbody.appendChild(tr);
        });
    } else {
        document.body.innerHTML = "<p>Không tìm thấy album.</p>";
    }
}

async function loadAlbumFromURLParam() {
  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("id");



  if (!albumId) return; // Không có ?song=id → không làm gì
    const album = await albumService.fetchAlbumFromFirebase(albumId);
    renderAlbumDetails(album);
    const songs = await songService.getSongsByAlbumId(albumId);
    loadSongByAlbum(songs);  
  
}

window.addEventListener("DOMContentLoaded", () => {
  loadAlbumFromURLParam();
});