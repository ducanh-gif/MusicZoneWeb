import * as artistService from "../services/artist-service.js";
import * as albumService from "../services/album-service.js";
import * as songService from "../services/songs-service.js";


const avatarEl = document.getElementById('artist-avatar');
const fullnameEl = document.getElementById('artist-fullname');
const usernameEl = document.getElementById('artist-username');
const albumListEl = document.getElementById('album-list');
const albumDetailsEl = document.getElementById('album-details');
const albumPosterEl = document.getElementById('album-poster');
const albumTitleEl = document.getElementById('album-title');
const songTableBody = document.getElementById('song-table-body');
let artist = null;
async function renderArtist(){
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id');
  artist = await artistService.getArtistById(artistId);
  if (artist) {
      avatarEl.src = artist.avtURL;
      fullnameEl.textContent = artist.name;
      usernameEl.textContent = `@${artist.username}`;
  } 
}

async function renderAlbum(){
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get('id');
  const albums= await albumService.getAlbumByArtistId(artistId);
  console.log(albums);
  albumListEl.innerHTML = '';
  albums.forEach((album, index) => {
    console.log(artist)
      const li = document.createElement('li');
      li.classList.add('album-item');
      li.innerHTML = `
          <tr class="song-row" data-song-id="${album.id}">
            <td class="album-thumb">
              <img src=${album.thumbnail} alt="thumbnail 5" width="60" height="60">
            </td>
            <td class="album-title">
              <a href="#" class="play-link">${album.title}</a>

            </td>
            <td class="album-author">${artist.name}</td>
          </tr>
      `;
      li.addEventListener('click', () => renderAlbumDetails(album));
      albumListEl.appendChild(li);
  });
}

async function renderAlbumDetails(album){
  albumPosterEl.src = album.thumbnail;
  albumTitleEl.textContent = album.title;
  songTableBody.innerHTML = '';
  const songs = await songService.getSongsByAlbumId(album.id);
  songs.forEach(song => {
    const tr = document.createElement('tr')
    tr.innerHTML=`
      <td class="song-index">${song.id}</td>
      <td class="song-thumb">
        <img src=${song.thumbnail} alt="thumbnail 1" width="60" height="60">
      </td>
      <td class="song-title">
        <a href="#" class="play-link">${song.title}</a>
      </td>
      <td class="song-author">${artist.name}</td>  
    `;
    songTableBody.appendChild(tr);
  })
  albumDetailsEl.style.display = 'block';
}

window.addEventListener("DOMContentLoaded", async () => {
  await renderArtist();
  await renderAlbum();
}
);