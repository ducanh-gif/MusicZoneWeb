
import * as model from '../config/model.js';
import * as db from '../config/db.js';

// Hàm lấy dữ liệu artist từ Firestore
async function fetchArtistFromFirebase(artistId) {
  try {
    // Lấy document artist theo ID
    const artist = await db.getDbById("artist", artistId, model.artistConverter);
    return artist; // Giả sử chỉ có một artist với ID này
    }catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
}

export async function  getAllArtist() {
    const artist = await db.getAllDb("artist", model.artistConverter);
    console.log(artist);
    return artist;
}

export async function getArtistById(artistId) {
    const artist = await fetchArtistFromFirebase(artistId);
    return artist;
}

export async function getNameArtist(artistIds) {
    const artistNames = [];
      for (const artistId of artistIds) {
        try {
          const artist = await getArtistById(artistId);
          if (artist) artistNames.push(artist.name);
        } catch (e) {
          console.error('Lỗi khi lấy artist:', e);
        }
      }
      return artistNames.join(', ');
}
