if(!localStorage.getItem('currentUser')) {
  window.location.href = './login,register.html';
}

function signOut() {
  const signOutBtn = document.getElementById('sign_out');
  console.log("signOutBtn:", signOutBtn);

  if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
          const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
          if (confirmLogout) {
              localStorage.removeItem('currentUser');
              window.location.href = './login,register.html';
          }
      });
  } else {
      console.warn("Không tìm thấy nút Sign out với id 'sign_out'");
  }
}
// fetch api test
  function renderTrendingSongs(songs) {
    const list = document.getElementById('trending-songs');
    list.innerHTML = '';
    songs.forEach(song => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${song.thumbnail}" alt="${song.title}">
        <div>
          <strong>${song.title}</strong>
          <div class="author">${song.artist}</div>
        </div>
      `;
      list.appendChild(li);
    });
  }

  function renderTrendingArtists(artists) {
    const list = document.getElementById('trending-artists');
    list.innerHTML = '';
    artists.forEach(artist => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${artist.thumbnail}" alt="${artist.name}">
        <div class="author">🎤 ${artist.name}</div>
      `;
      list.appendChild(li);
    });
  }

  function renderTrendingAlbums(albums) {
    const list = document.getElementById('trending-albums');
    list.innerHTML = '';
    albums.forEach(album => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${album.thumbnail}" alt="${album.title}">
        <div>
          <strong>${album.title}</strong>
          <div class="author">${album.artist}</div>
        </div>
      `;
      list.appendChild(li);
    });
  }



//DIFF-SONGS-TEST


function renderOtherSongs(songs) {
  const list = document.getElementById('other-songs');
  list.innerHTML = '';

  songs.forEach(song => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="card d-flex flex-row align-items-center p-2 mb-2">
        <img src="${song.thumbnail}" alt="${song.title}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
        <div class="info flex-grow-1">
          <strong>${song.title}</strong><br>
          <small class="author text-muted">${song.artist?.map(a => a.username).join(", ") || "Không rõ tác giả"}</small>
        </div>
        <button class="play-btn btn btn-success" data-id="${song.id}" data-thumbnail="${song.thumbnail}" data-src="${song.url}" data-title="${song.title}" data-artist="${song.artist?.map(a => a.username).join(", ")}">▶</button>
      </div>
    `;
    list.appendChild(li);
  });

  // Gắn sự kiện play cho từng nút
  const playButtons = document.querySelectorAll(".play-btn");
  playButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      const title = btn.getAttribute("data-title");
      const artist = btn.getAttribute("data-artist");
      const thumbnail = btn.getAttribute("data-thumbnail");
      const songId = btn.getAttribute("data-id"); // Lấy ID bài hát

      const audioPlayer = document.getElementById("audio-player");
      const banner = document.getElementById("player-banner");
      const nowPlaying = document.getElementById("now-playing-info");
      const playerThumbnail = document.getElementById("player-thumbnail");
      
      playerThumbnail.src = thumbnail || "default-thumbnail.jpg"; // Thay thế bằng hình ảnh mặc định nếu không có thumbnail

      audioPlayer.src = src;
      audioPlayer.play();

      nowPlaying.innerHTML = `<strong>${title}</strong> - ${artist}`;
      banner.style.display = "flex";

          // 🔺 Đẩy ID lên URL (không reload trang)
      const params = new URLSearchParams(window.location.search);
      params.set('song', songId); // key: song, value: songId
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      changeParamLocation(songId); // Cập nhật các liên kết khác với ID bài hát
      updateFavoriteIcon();
    });
  });
}






function renderOtherArtists(artists) {
  const list = document.getElementById('other-artists');
  list.innerHTML = '';
  
  artists.forEach(artist => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="card">
        <img src="${artist.avatar.startsWith('http') ? artist.avatar : 'https://sonnguyen741.pythonanywhere.com/media/' + artist.avatar}" alt="${artist.fullname || artist.username}">
        <div class="info">
          <strong>${artist.fullname || artist.username}</strong>
          <div class="author">Nghệ sĩ</div>
        </div>
      </div>
    `;
       li.addEventListener('click', () => {
      window.location.href = `artists-details.html?id=${artist.id}`;
    });
    list.appendChild(li);
  });
}


function renderOtherAlbums(albums) {
  const list = document.getElementById('other-albums');
  list.innerHTML = '';

  albums.forEach(album => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="card d-flex flex-row align-items-center p-2 mb-2">
        <img src="${album.poster}" alt="${album.title}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
        <div class="info flex-grow-1">
          <strong>${album.title}</strong><br>
          <small class="author text-muted">
            ${album.creator?.fullname || album.creator?.username || "Không rõ tác giả"}
          </small>
        </div>
      </div>
    `;
        li.addEventListener('click', () => {
      window.location.href = `albums-songs.html?id=${album.id}`;
    });
    list.appendChild(li);
  });
}
// fetch api test
async function fetchSongs() {
  try {
    const response = await fetch("https://sonnguyen741.pythonanywhere.com/api/songs/");
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ API");
    }

    const data = await response.json();
    renderOtherSongs(data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}
async function fetchAlbums() {
  try {
    const response = await fetch("https://sonnguyen741.pythonanywhere.com/api/albums/");
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ API");
    }

    const data = await response.json();
    renderOtherAlbums(data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}
async function fetchArtists() {
  try {
    const response = await fetch("https://sonnguyen741.pythonanywhere.com/api/artists/");
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ API");
    }

    const data = await response.json();
    renderOtherArtists(data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}



// Gọi hàm khi trang tải
document.addEventListener("DOMContentLoaded", () => {
  fetchSongs();
  fetchAlbums();
  fetchArtists();
  signOut();
});

