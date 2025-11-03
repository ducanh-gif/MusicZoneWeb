const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

const API_SONGS = 'https://sonnguyen741.pythonanywhere.com/api/songs';
const API_ALBUMS = 'https://sonnguyen741.pythonanywhere.com/api/albums';
const API_ARTISTS = 'https://sonnguyen741.pythonanywhere.com/api/artists';

// Hàm fetch tất cả dữ liệu
async function fetchAllData() {
  try {
    const [songsRes, albumsRes, artistsRes] = await Promise.all([
      fetch(API_SONGS),
      fetch(API_ALBUMS),
      fetch(API_ARTISTS)
    ]);

    const [songs, albums, artists] = await Promise.all([
      songsRes.json(),
      albumsRes.json(),
      artistsRes.json()
    ]);

    return { songs, albums, artists };
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu:", err);
    return { songs: [], albums: [], artists: [] };
  }
}

// Hàm search dữ liệu theo keyword
function searchData({ songs, albums, artists }, keyword) {
  keyword = keyword.toLowerCase();

  const foundSongs = songs.filter(song => song.title.toLowerCase().includes(keyword));
  const foundAlbums = albums.filter(album => album.title.toLowerCase().includes(keyword));
  const foundArtists = artists.filter(artist => artist.username.toLowerCase().includes(keyword));

  return { foundSongs, foundAlbums, foundArtists };
}

// Hàm render kết quả
function renderSearchResults({ foundSongs, foundAlbums, foundArtists }) {
  let html = '';

  if (foundSongs.length > 0) {
    html += `<h3>Bài hát</h3>` + foundSongs.map(song => `
      <div class="result-item song-item" data-id="${song.id}">
        <img src="${song.thumbnail}" alt="${song.title}">
        <span>${song.title} - ${song.artist?.map(a=>a.username).join(", ") || ""}</span>
      </div>
    `).join('');
  }

  if (foundAlbums.length > 0) {
    html += `<h3>Album</h3>` + foundAlbums.map(album => `
      <div class="result-item album-item" data-id="${album.id}">
        <img src="${album.poster}" alt="${album.title}">
        <span>${album.title}</span>
      </div>
    `).join('');
  }

  if (foundArtists.length > 0) {
    html += `<h3>Artist</h3>` + foundArtists.map(artist => `
      <div class="result-item artist-item" data-id="${artist.id}">
        <img src="${artist.avatar}" alt="${artist.username}" style="border-radius:50%;">
        <span>${artist.username}</span>
      </div>
    `).join('');
  }

  if (html === '') html = "<p>Không tìm thấy kết quả.</p>";

  searchResults.innerHTML = html;
  searchResults.style.display = 'block';

  // Thêm event click cho từng loại
  document.querySelectorAll('.song-item').forEach(el => {
    el.addEventListener('click', () => {
      const songId = el.dataset.id;
      const song = foundSongs.find(s => s.id == songId);
      if (song) playSong(song);  // gọi hàm phát nhạc
      searchResults.style.display = 'none';
    });
  });

  document.querySelectorAll('.album-item').forEach(el => {
    el.addEventListener('click', () => {
      const albumId = el.dataset.id;
      window.location.href = `albums-songs.html?id=${albumId}`;
    });
  });

  document.querySelectorAll('.artist-item').forEach(el => {
    el.addEventListener('click', () => {
      const artistId = el.dataset.id;
      window.location.href = `artists-details.html?id=${artistId}`;
    });
  });
}


// Event search
searchBtn.addEventListener('click', async () => {
  const keyword = searchInput.value.trim();
  if (!keyword) return;

  const allData = await fetchAllData();
  const results = searchData(allData, keyword);
  renderSearchResults(results);
});

document.addEventListener("DOMContentLoaded", () => {

});

searchBtn.addEventListener('click', async () => {
  const keyword = searchInput.value.trim();
  if (!keyword) return;

  const allData = await fetchAllData();
  const results = searchData(allData, keyword);
  renderSearchResults(results);

  // Hiện dropdown
  searchResults.style.display = 'block';
});
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

// Ẩn kết quả khi click ra ngoài
document.addEventListener('click', (e) => {
  if (!document.querySelector('.search-bar').contains(e.target)) {
    searchResults.style.display = 'none';
  }
});
