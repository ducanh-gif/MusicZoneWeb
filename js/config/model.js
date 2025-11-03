// favourtite 
class Favourite {
  constructor(id, songId, name , isDeleted) {
    this.id = id; 
    this.songId = songId;
    this.name = name;
    this.isDeleted = isDeleted;
  }
}

let favouriteConverter = {
  toFirestore: function(favourite) {
    return {
      songId: favourite.songId,
      name: favourite.name,
      isDeleted: favourite.isDeleted,
    };
  },


fromFirestore: function(snapshot) {
    const data = snapshot.data();
    return new Favourite(
      snapshot.id,
      data.songId,
      data.name,
      data.isDeleted
    );
  }
}
// USER 
class User {
  constructor(id, email, name, password, roleId, favourite, avtURL, isDeleted) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.roleId = roleId;
    this.favourite = favourite;
    this.avtURL = avtURL;
    this.id = id;
    this.isDeleted = isDeleted;
  }
}

let userConverter = {
  toFirestore: function(user) {
    return {
      email: user.email,
      name: user.name,
      password: user.password,
      roleId: user.roleId,
      favourite: user.favourite,
      avtURL: user.avtURL,
      isDeleted: user.isDeleted,
    };
  },

  fromFirestore: function(snapshot) {
    const data = snapshot.data();
    return new User(
      snapshot.id,
      data.email,
      data.name,
      data.password,
      data.roleId,
      data.favourite,
      data.avtURL,
      data.isDeleted
    );
  }
}

// ARTIST
class Artist {
  constructor(id, name, followers, avtURL, album, songs, isDeleted) {
    this.id = id;
    this.name = name;
    this.followers = followers;
    this.avtURL = avtURL;
    this.album = album;
    this.songs = songs;
    this.isDeleted = isDeleted;
  }
}

let artistConverter = {
  toFirestore: function(artist) {
    return {
      name: artist.name,
      followers: artist.followers,
      avtURL: artist.avtURL,
      album: artist.album,
      songs: artist.songs,
      isDeleted: artist.isDeleted,
    };
  },

  fromFirestore: function(snapshot) {
    const data = snapshot.data();
    return new Artist(
      snapshot.id,
      data.name,
      data.followers,
      data.avtURL,
      data.album,
      data.songs,
      data.isDeleted
    );
  }
}

// SONG
class Song {
  constructor(id,url, title, author, thumbnail, luotNghe, duration, album, isDeleted) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.luotNghe = luotNghe;
    this.duration = duration;
    this.album = album;
    this.isDeleted = isDeleted;
    this.url = url;
  }
}

let songConverter = {
  toFirestore: function(song) {
    return {
      title: song.title,
      url: song.url,
      author: song.author,
      thumbnail: song.thumbnail,
      luotNghe: song.luotNghe,
      duration: song.duration,
      album: song.album,
      isDeleted: song.isDeleted,
    };
  },

  fromFirestore: function(snapshot) {
    const data = snapshot.data();
    return new Song(
      snapshot.id,
      data.url,
      data.title,
      data.author,
      data.thumbnail,
      data.luotNghe,
      data.duration,
      data.album,
      data.isDeleted,
      
    );
  }
}

// ALBUM
class Album {
  constructor(id, title, author, thumbnail, songId, isDeleted) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.songId = songId;
    this.isDeleted = isDeleted;
  }
}

let albumConverter = {
  toFirestore: function(album) {
    return {
      title: album.title,
      author: album.author,
      thumbnail: album.thumbnail,
      songId: album.songId,
      isDeleted: album.isDeleted,
    };
  },

  fromFirestore: function(snapshot) {
    const data = snapshot.data();
    return new Album(
      snapshot.id,
      data.title,
      data.author,
      data.thumbnail,
      data.songId,
      data.isDeleted
    );
  }
}

export { User, Artist, Song, Album, userConverter, 
  artistConverter, songConverter, albumConverter, Favourite, favouriteConverter  };