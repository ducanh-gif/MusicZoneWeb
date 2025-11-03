
// Nếu chưa có mảng favoriteSongs thì tạo mới
if (!Array.isArray(currentUser.favoriteSongs)) {
  currentUser.favoriteSongs = [];
}

const favoriteListContainer = document.getElementById('favorite-songs-list');

// Hàm fetch tất cả bài hát từ API
async function fetchAllSongs() {
  try {
    const res = await fetch('https://sonnguyen741.pythonanywhere.com/api/songs');
    return await res.json(); // Trả về mảng bài hát
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
}

// Hàm render danh sách yêu thích
function renderFavoriteSongs(songs) {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  // Lọc ra bài hát yêu thích
    const favoriteSongs = songs.filter(song =>
    currentUser.favoriteSongs.includes(String(song.id))
    );
  if (favoriteSongs.length === 0) {
    favoriteListContainer.innerHTML = "<p>Bạn chưa có bài hát yêu thích nào.</p>";
    return;
  }

  favoriteListContainer.innerHTML = favoriteSongs.map(song => `
    <li class="song-item" data-id="${song.id}">
      <div class="song-index">${song.id}</div>
      <img  src="${song.thumbnail}" alt="Song Cover" />
      <div class="song-info">
        <strong>${song.title}</strong>
        <span>${song.artist?.map(a => a.username).join(", ") || "Không rõ tác giả"}</span>
      </div>
      <div class="song-duration">${song.duration}</div>
    </li>
  `).join('');

    favoriteListContainer.querySelectorAll('.song-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      playSong(favoriteSongs[index]);
    });
  });
}

function playSong(song) {
  const playerBanner = document.getElementById('player-banner');
  const audioPlayer = document.getElementById('audio-player');
  const playerThumbnail = document.getElementById('player-thumbnail');
  const nowPlayingInfo = document.getElementById('now-playing-info');

  playerThumbnail.src = song.thumbnail || '';
  nowPlayingInfo.textContent = `${song.title} — ${song.artist?.map(a => a.username).join(", ") || ""}`;

  audioPlayer.src = song.url;
  audioPlayer.play();

  playerBanner.style.display = 'flex';
}

// Chạy
(async function () {
  const allSongs = await fetchAllSongs();
  renderFavoriteSongs(allSongs);
})();
