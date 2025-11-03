import * as db from '../config/db.js';
import * as model from '../config/model.js';

// get all users
export async function getAllUsers() {
    return await db.getDbByQuery ("users", { field: "isDeleted", operator: "==", value: false }, model.userConverter);
}


// get all artists
export async function getAllArtist() {
      return await db.getDbByQuery("artist", { field: "isDeleted", operator: "==", value: false }, model.artistConverter);
}

// get all albums
export async function getAllAlbum() {
      return await db.getDbByQuery("album", { field: "isDeleted", operator: "==", value: false }, model.albumConverter);
}

// get all songs
export async function getAllSongs() {
      return await db.getDbByQuery("songs", { field: "isDeleted", operator: "==", value: false }, model.songConverter);
}

// delete user by id (soft delete)
export async function deleteUserById(userId) {
    return await db.updateDb("users", { id: userId, isDeleted: true }, model.userConverter);
}

// delete artist by id (soft delete)
export async function deleteArtistById(artistId) {
    return await db.updateDb("artist", { id: artistId, isDeleted: true }, model.artistConverter);
}

// delete album by id (soft delete)
export async function deleteAlbumById(albumId) {
    return await db.updateDb("album", { id: albumId, isDeleted: true }, model.albumConverter);
}
// delete song by id (soft delete)
export async function deleteSongById(songId) {
    return await db.updateDb("songs", { id: songId, isDeleted: true }, model.songConverter);
}
// update user by id
export async function updateUserById(user) {
    return await db.updateDb("users", user, model.userConverter);
}

// update artist by id
export async function updateArtistById(artist) {
    return await db.updateDb("artist", artist, model.artistConverter);
}

// update album by id   
export async function updateAlbumById(album) {
    return await db.updateDb("album", album, model.albumConverter);
}

// update song by id
export async function updateSongById(song) {
    return await db.updateDb("songs", song, model.songConverter);
}


//add user 
export async function addUser(user) {
    return await db.addDb("users", user, model.userConverter);
}
//add artist
export async function addArtist(artist) {
    return await db.addDb("artist", artist, model.artistConverter);
}
//add album     
export async function addAlbum(album) {
    return await db.addDb("album", album, model.albumConverter);
}
//add song
export async function addSong(song) {
    return await db.addDb("songs", song, model.songConverter);
}

// export 
export async function getUserById(userId) {
    return await db.getDbById("users", userId, model.userConverter);
}
export async function getArtistById(artistId) {
    return await db.getDbById("artist", artistId, model.artistConverter);
}
export async function getAlbumById(albumId) {
    return await db.getDbById("album", albumId, model.albumConverter);
}
export async function getSongById(songId) {
    return await db.getDbById("songs", songId, model.songConverter);
}


