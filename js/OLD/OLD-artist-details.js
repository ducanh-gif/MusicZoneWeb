async function fetchArtistData(artistId) {
  try {
    // URL API thay artistId bằng ID thật nếu cần
    const response = await fetch(`https://sonnguyen741.pythonanywhere.com/api/artists/${artistId}`);
    if (!response.ok) throw new Error("Lỗi tải dữ liệu");
    const artist = await response.json();

    // Render Artist Header
    document.getElementById('artist-avatar').src = artist.avatar || '';
    document.getElementById('artist-fullname').textContent = artist.fullname || artist.username;
    document.getElementById('artist-username').textContent = artist.username ? `@${artist.username}` : '';

    // Render Album list
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = ''; // reset
    artist.albums.forEach(album => {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.style.display = 'flex';
        li.style.flexDirection = 'column';   // đổi thành cột để chữ xuống dưới hình
        li.style.alignItems = 'center';      // căn giữa theo chiều ngang
        li.style.marginBottom = '20px';      // khoảng cách dưới mỗi album

        // Tạo img poster
        const img = document.createElement('img');
        img.src = album.poster;
        img.alt = album.title;
        img.style.width = '120px';            // tăng kích thước cho đẹp
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '12px';
        img.style.marginBottom = '8px';       // khoảng cách giữa hình và chữ

        // Tạo span cho tiêu đề album
        const span = document.createElement('span');
        span.textContent = album.title;
        span.style.textAlign = 'center';
        span.style.fontWeight = '600';
        span.style.fontSize = '16px';
        span.style.color = '#ffffffff';

        li.appendChild(img);
        li.appendChild(span);

        li.addEventListener('click', () => renderAlbumDetails(album));

        albumList.appendChild(li);

    });

    // Ẩn chi tiết album lúc đầu
    document.getElementById('album-details').style.display = 'none';

  } catch (error) {
    console.error(error);
  }
}

// Hàm render chi tiết album + bài hát
function renderAlbumDetails(album) {
  document.getElementById('album-poster').src = album.poster || '';
  document.getElementById('album-title').textContent = album.title;

  const tbody = document.getElementById('song-table-body');
  tbody.innerHTML = ''; // reset

  album.songs.forEach((song, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${song.thumbnail}" alt="${song.title}" style="width:50px; height:50px; object-fit: cover; border-radius: 6px;"></td>
      <td>${song.title}</td>
      <td>${song.artist?.map(a => a.username).join(", ") || "Không rõ tác giả"}</td>
    `;

    // Nếu bạn muốn thêm event play cho từng bài:
    tr.style.cursor = "pointer";
    tr.onclick = () => playSong(song);

    tbody.appendChild(tr);
  });

  // Hiện phần chi tiết album
  document.getElementById('album-details').style.display = 'block';
}

// Hàm play nhạc demo
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

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  if (artistId) {
    await fetchArtistData(artistId);
  } else {
    console.error("Không có ID nghệ sĩ trong URL");
  }
});
