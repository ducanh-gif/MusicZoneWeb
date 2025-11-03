import * as model from '../config/model.js';
import * as db from '../config/db.js';

// Hàm lấy dữ liệu album từ Firestore theo document id
export async function fetchAlbumFromFirebase(albumId) {
  try {
    const album = await db.getDbById("album", albumId, model.albumConverter);
    return album; // Trả về object Album hoặc null nếu không có
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
}

export async function  getAllAlbum() {
    const album = await db.getAllDb("album", model.albumConverter);
    return album;
}

export async function  getAlbumByArtistId(artistId) {
    const album = await db.getDbByQuery("album", {
      field: "author",
      operator: "array-contains",
      value: artistId
    }, model.albumConverter);
    return album;
}
