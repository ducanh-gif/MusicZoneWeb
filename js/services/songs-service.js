import * as model from '../config/model.js';
import * as db from '../config/db.js';


// Hàm lấy dữ liệu song từ Firestore theo document id
export async function fetchSongFromFirebase(songId) {
  try {
    const song = await db.getDbById("songs", songId, model.songConverter);
    return song; // Trả về object Song hoặc null nếu không có
  } catch (error) {
    console.error("Error fetching song:", error);
    return null;
  }
}

export async function  getAllSongs() {
    const songs = await db.getAllDb("songs", model.songConverter);
    return songs;
}

export async function getSongsByAlbumId(albumId) {
  try {
    const songs = await db.getDbByQuery('songs', { field: 'album', operator: '==', value: albumId }, model.songConverter);
    return songs;
  } catch (error) {
    console.log('Error getting songs by albumId:', error);
    return [];
  }
}