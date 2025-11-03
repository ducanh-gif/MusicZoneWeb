    

function renderAlbumDetails(album) {
    if (album) {
        document.getElementById('album-poster').src = album.poster;
        document.getElementById('album-title').textContent = album.title;

        const tbody = document.getElementById('song-table-body');
        tbody.innerHTML = "";

        album.songs.forEach((song, index) => {
            const tr = document.createElement('tr');
            tr.id = "play-btn";
            tr.setAttribute("data-src", song.url);
            tr.setAttribute("data-title", song.title);
            tr.setAttribute("data-artist", song.artist.map(a => a.username).join(', '));
            tr.setAttribute("data-thumbnail", song.thumbnail);
            tr.setAttribute("data-id", song.id);

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><img class="song-thumbnail" src="${song.thumbnail}" alt="${song.title}"></td>
                <td>${song.title}</td>
                <td class="author-name">${song.artist.map(a => a.username).join(', ')}</td>
            `;

            // 🔹 Gắn sự kiện click phát nhạc
            tr.addEventListener("click", () => {
                const audioPlayer = document.getElementById("audio-player");
                const banner = document.getElementById("player-banner");
                const nowPlaying = document.getElementById("now-playing-info");
                const playerThumbnail = document.getElementById("player-thumbnail");

                playerThumbnail.src = song.thumbnail || "default-thumbnail.jpg";
                audioPlayer.src = song.url;
                audioPlayer.play();

                nowPlaying.innerHTML = `<strong>${song.title}</strong> - ${song.artist.map(a => a.username).join(', ')}`;
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


function loadAlbumFromURLParam() {
  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("id");



  if (!albumId) return; // Không có ?song=id → không làm gì

  // Gọi API để lấy bài hát theo id
  fetch(`https://sonnguyen741.pythonanywhere.com/api/albums/${albumId}`)
    .then(res => res.json())
    .then(album => {
       renderAlbumDetails(album);
    })
    .catch(err => {
      console.error("Không thể tải bài hát:", err);
    });
}
window.addEventListener("DOMContentLoaded", () => {
  loadAlbumFromURLParam();
});
    
 
