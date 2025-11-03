import * as adminService from "../services/admin-service.js";
import * as artistService from "../services/artist-service.js";
import * as model from "../config/model.js";
import { uploadImage } from "./until.js";
import { user } from "../config/check_session.js";
import * as profileService from "../services/profile-service.js";
// Hiển thị danh sách user
async function renderUserList() {
  console.log("A");
  const users = (await adminService.getAllUsers()).filter((u) => !u.isDeleted);
  const tbody = document.querySelector("#users .admin-table tbody");
  tbody.innerHTML = "";
  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Không có user nào.</td></tr>`;
    return;
  }
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.name}</td>             
      <td>${user.roleId == 1 ? "Admin" : "User"}</td>
      <td>${
        user.avtURL
          ? `<img src="${user.avtURL}" alt="${user.name}" class="admin-avatar">`
          : "N/A"
      }</td>
      <td>${user.password}</td>
      <td class="admin-actions">
        <button class="edit-user">✏️</button>
        <button class="delete delete-user">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
    tr.querySelector(".edit-user").addEventListener("click", async () => {
      currentRow = tr;
      currentSection = "users"; // users, artists, albums, songs
      showEditForm(currentSection, currentRow);
    });
    tr.querySelector(".delete-user").addEventListener("click", async () => {
      if (!confirm(`Bạn có chắc muốn xóa artist ID=${user.id}?`)) return;
      await deleteUser(user.id);
      renderUserList(); // refresh lại list
    });
  });
}

// hien thi artist
async function renderArtistList() {
  const artist = (await adminService.getAllArtist()).filter(
    (a) => !a.isDeleted
  );
  console.log(artist);
  const tbody = document.querySelector("#artists .admin-table tbody");
  tbody.innerHTML = "";
  if (!artist || artist.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Không có artist nào.</td></tr>`;
    return;
  }
  artist.forEach((artist) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${artist.id}</td>
      <td>${artist.name}</td>             
      <td>${artist.followers}</td>
      <td>${
        artist.avtURL
          ? `<img src="${artist.avtURL}" alt="${artist.name}" class="admin-avatar">`
          : "N/A"
      }</td>
     
        <td class="admin-actions">
        <button class="edit-artist">✏️</button>
        <button class="delete delete-artist" onclick="deleteArtist('${
          artist.id
        }')">🗑️</button>
      </td>
      `;
    tbody.appendChild(tr);
    tr.querySelector(".edit-artist").addEventListener("click", async () => {
      currentRow = tr;
      currentSection = "artists"; // users, artists, albums, songs
      showEditForm(currentSection, currentRow);
    });

    tr.querySelector(".delete-artist").addEventListener("click", async () => {
      if (!confirm(`Bạn có chắc muốn xóa artist ID=${artist.id}?`)) return;
      await deleteArtist(artist.id);
      renderArtistList(); // refresh lại list
    });
  });
}

// hien thi album
async function renderAlbumList() {
  const albums = (await adminService.getAllAlbum()).filter((a) => !a.isDeleted);
  const tbody = document.querySelector("#album .admin-table tbody");
  tbody.innerHTML = "";
  if (!album || album.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Không có album nào.</td></tr>`;
    return;
  }
  for (let album of albums) {
    let author_name = await artistService.getNameArtist(album.author);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${album.id}</td>
      <td>${album.title}</td>             
      <td>${author_name}</td>
      <td>${
        album.thumbnail
          ? `<img src="${album.thumbnail}" class="admin-avatar">`
          : "N/A"
      }</td>
      <td class="admin-actions">
        <button class="edit-album">✏️</button>
        <button class="delete delete-album">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
    tr.querySelector(".edit-album").addEventListener("click", async () => {
      currentRow = tr;
      currentSection = "album"; // users, artists, albums, songs
      showEditForm(currentSection, currentRow);
    });

    tr.querySelector(".delete-album").addEventListener("click", async () => {
      if (!confirm(`Bạn có chắc muốn xóa album ID=${album.id}?`)) return;
      await deleteAlbum(album.id);
      renderAlbumList(); // refresh lại list
    });
  }
}

// hien thi songs
async function renderSongsList() {
  const songs = (await adminService.getAllSongs()).filter((s) => !s.isDeleted);
  console.log(songs);

  const tbody = document.querySelector("#songs .admin-table tbody");
  tbody.innerHTML = "";
  if (!songs || songs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Không có song nào.</td></tr>`;
    return;
  }
  for (let song of songs) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${song.id}</td>
        <td>${song.title}</td>             
        <td>${await artistService.getNameArtist(song.author)}</td>
        <td>${
          song.thumbnail
            ? `<img src="${song.thumbnail}" alt="${song.title}" class="admin-avatar">`
            : "N/A"
        }</td>
        <td>${song.luotNghe}</td>
        <td class="admin-actions">
          <button class="edit-song">✏️</button>
          <button class="delete delete-song">🗑️</button>
        </td>
      `;
    tbody.appendChild(tr);
    tr.querySelector(".edit-song").addEventListener("click", async () => {
      currentRow = tr;
      currentSection = "songs"; // users, artists, albums, songs
      showEditForm(currentSection, currentRow);
    });
    tr.querySelector(".delete-song").addEventListener("click", async () => {
      if (!confirm(`Bạn có chắc muốn xóa artist ID=${song.id}?`)) return;
      await deleteSong(song.id);
      renderSongsList(); // refresh lại list
    });
  }
}

// === FORM CHỈNH SỬA ===
const editForm = document.getElementById("editForm");
const editFormTitle = document.getElementById("editFormTitle");
const formFields = document.getElementById("formFields");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let currentRow = null;
let currentSection = null;
let dataOld = null;

// Khi bấm nút Edit (🔧)

// Hiển thị form theo bảng
async function showEditForm(section, row) {
  formFields.innerHTML = ""; // reset
  editForm.style.display = "flex";

  let labels = [];
  let values = [];

  if (section === "users") {
    editFormTitle.textContent = "✏️ Edit User";
    labels = ["ID", "Email", "Name", "Role", "Avatar URL", "password"];
    values = [
      row.cells[0].textContent,
      row.cells[1].textContent,
      row.cells[2].textContent,
      row.cells[3].textContent,
      row.querySelector("img")?.src || "",
      row.getAttribute("data-password") || "",
    ];
  } else if (section === "artists") {
    editFormTitle.textContent = "🎤 Edit Artist";
    labels = ["ID", "Name", "Followers", "Avatar URL"];
    values = [
      row.cells[0].textContent,
      row.cells[1].textContent,
      row.cells[2].textContent,
      row.querySelector("img")?.src || "",
    ];
  } else if (section === "album") {
    editFormTitle.textContent = "💿 Edit Album";
    labels = ["ID", "Title", "Author", "Poster URL"];
    values = [
      row.cells[0].textContent,
      row.cells[1].textContent,
      row.cells[2].textContent,
      row.querySelector("img")?.src || "",
    ];
  } else if (section === "songs") {
    editFormTitle.textContent = "🎵 Edit Song";
    labels = ["ID", "Title", "Artist", "Album URL", "Listens"];
    values = [
      row.cells[0].textContent,
      row.cells[1].textContent,
      row.cells[2].textContent,
      row.querySelector("img")?.src || "",
      row.cells[4]?.textContent || "",
    ];
  }
  console.log(labels, values);
  // 🔧 Tạo input động (với các kiểu đặc biệt cho Role và URL)
  labels.forEach(async (label, i) => {
    let inputHTML = "";

    if (label === "Role") {
      // Select cho role
      inputHTML = `
        <label>${label}</label>
        <select data-field="${label}">
          <option value=2 ${
            values[i] === "User" ? "selected" : ""
          }>User</option>
          <option value=1 ${
            values[i] === "Admin" ? "selected" : ""
          }>Admin</option>
        </select>
      `;
    } else if (label === "Author" || label === "Artist") {
      // Trường tác giả (nhiều artist)select multiple
      const artistList = await artistService.getAllArtist();
      const options = artistList
        .map(
          (artist) =>
            `<option value="${artist.id}" ${
              values[i].includes(artist.name) ? "selected" : ""
            }>${artist.name}</option>`
        )
        .join("");

      inputHTML = `
        <label>${label}</label>
        <select data-field="${label}" multiple>
          ${options}
        </select>
      `;
    } else if (label.includes("URL")) {
      // Trường file (ảnh, poster, album)
      inputHTML = `
        <label>${label}</label>
        <input type="file" data-field="${label}">
        ${
          values[i]
            ? `<small>Hiện tại: <img src="${values[i]}" target="_blank"></img></small>`
            : ""
        }
      `;
    } else {
      // Trường text thông thường
      inputHTML = `
        <label>${label}</label>
        <input 
          type="text" 
          data-field="${label}" 
          value="${values[i] || ""}" 
          ${label === "ID" ? "readonly" : ""}
        >
      `;
    }

    formFields.insertAdjacentHTML("beforeend", inputHTML);
  });
}

// Nút Save
saveEdit.addEventListener("click", async () => {
  const inputs = formFields.querySelectorAll("input, select");
  const data = {};
  inputs.forEach((input) => {
    if (input.type === "file") {
      // Đối với file, lưu trữ đối tượng File
      data[input.dataset.field] = input.files[0] || null;
    } else if (
      input.tagName.toLowerCase() === "select" &&
      input.hasAttribute("multiple")
    ) {
      // Đối với select multiple, lấy tất cả các giá trị được chọn
      const selectedOptions = Array.from(input.selectedOptions).map(
        (option) => option.value
      );
      data[input.dataset.field] = selectedOptions;
    } else {
      data[input.dataset.field] = input.value;
    }
  });

  // Cập nhật lại hàng trong bảng
  if (currentRow && currentSection) {
    // 🧩 USERS
    if (currentSection === "users") {
      if (data["Avatar URL"] != null) {
        const imageUrl = await uploadImage(data["Avatar URL"]);
        data["Avatar URL"] = imageUrl;
      }
      let oldUser = await adminService.getUserById(data["ID"]);
      const newUSer = new model.User(
        data["ID"],
        data["Email"],
        data["Name"],
        data["password"],
        data["Role"],
        null,
        data["Avatar URL"],
        false
      );
      console.log(oldUser);
      for (const key of Object.keys(oldUser)) {
        const newValue = newUSer[key];
        const oldValue = oldUser[key];
        console.log(`Comparing ${key}: old=${oldValue}, new=${newValue}`);
        // chỉ cập nhật nếu giá trị mới khác giá trị cũ và khác null/rỗng
        if (newValue !== null && newValue !== "" && newValue !== oldValue) {
          oldUser[key] = newValue;
        }
      }
      console.log(oldUser);
      await adminService.updateUserById(oldUser);
      await renderUserList();
    }
    // 🧩 ARTIST
    else if (currentSection === "artists") {
      // Nếu có ảnh mới → upload ảnh và lấy URL mới
      if (data["Avatar URL"] != null && data["Avatar URL"] instanceof File) {
        const imageUrl = await uploadImage(data["Avatar URL"]);
        data["Avatar URL"] = imageUrl;
      }

      // Lấy dữ liệu artist cũ từ Firebase
      let oldArtist = await adminService.getArtistById(data["ID"]);

      // Tạo instance artist mới
      const newArtist = new model.Artist(
        data["ID"],
        data["Name"],
        data["Followers"],
        data["Avatar URL"],
        null,
        null,
        null
      );

      // So sánh và chỉ cập nhật những giá trị khác & hợp lệ
      for (const key of Object.keys(oldArtist)) {
        const newValue = newArtist[key];
        const oldValue = oldArtist[key];
        console.log(`Comparing ${key}: old=${oldValue}, new=${newValue}`);
        if (newValue !== null && newValue !== "" && newValue !== oldValue) {
          oldArtist[key] = newValue;
        }
      }

      // Lưu lên Firebase và cập nhật giao diện
      await adminService.updateArtistById(oldArtist);
      await renderArtistList();
    }
    // 🧩 ALBUM
    else if (currentSection === "album") {
      // Nếu có upload file ảnh mới → upload lên Firebase và cập nhật URL
      if (data["Poster URL"] != null && data["Poster URL"] instanceof File) {
        const imageUrl = await uploadImage(data["Poster URL"]);
        data["Poster URL"] = imageUrl;
      }

      // Lấy dữ liệu cũ từ Firebase
      let oldAlbum = await adminService.getAlbumById(data["ID"]);

      // Tạo instance album mới
      const newAlbum = new model.Album(
        data["ID"],
        data["Title"],
        data["Author"],
        data["Poster URL"],
        null,
        null
      );

      // So sánh từng trường và chỉ cập nhật nếu có thay đổi
      for (const key of Object.keys(oldAlbum)) {
        const newValue = newAlbum[key];
        const oldValue = oldAlbum[key];
        console.log(`Comparing ${key}: old=${oldValue}, new=${newValue}`);
        if (newValue !== null && newValue !== "" && newValue !== oldValue) {
          oldAlbum[key] = newValue;
        }
      }

      // Cập nhật lên Firebase
      await adminService.updateAlbumById(oldAlbum);

      // Render lại danh sách + gán lại nút Edit
      await renderAlbumList();
    }

    // 🧩 SONGS
    else if (currentSection === "songs") {
      // Lấy dữ liệu cũ từ Firebase
      let oldSong = await adminService.getSongById(data["ID"]);

      // Lấy input file từ form
      const fileInput = formFields.querySelector(
        'input[data-field="AlbumUrl"]'
      );
      let albumUrl = oldSong.albumUrl || "";

      // Nếu có upload file mới → xử lý file upload
      if (fileInput && fileInput.files.length > 0) {
        albumUrl = await uploadImage(fileInput.files[0]);
      }

      // Tạo instance mới
      const newSong = new model.Song(
        data["ID"],
        null,
        data["Title"],
        data["Artist"],
        data["Album URL"] || albumUrl,
        data["Listens"],
        null
      );

      // So sánh và cập nhật từng field (chỉ khi khác)
      for (const key of Object.keys(oldSong)) {
        const newValue = newSong[key];
        const oldValue = oldSong[key];

        if (
          newValue !== undefined && // tránh lỗi undefined
          newValue !== null &&
          newValue !== "" &&
          newValue !== oldValue
        ) {
          oldSong[key] = newValue;
        }
      }

      // Xóa field undefined trước khi lưu (phòng trường hợp sót)
      Object.keys(oldSong).forEach((key) => {
        if (oldSong[key] === undefined) delete oldSong[key];
      });

      // Cập nhật lại trong Firebase
      await adminService.updateSongById(oldSong);

      // Render lại bảng
      await renderSongsList();
    }

    editForm.style.display = "none";
  }
});

// Nút Cancel hoặc click ra ngoài
cancelEdit.addEventListener("click", () => (editForm.style.display = "none"));
editForm.addEventListener("click", (e) => {
  if (e.target === editForm) editForm.style.display = "none";
});

document.addEventListener("DOMContentLoaded", async () => {
  await renderSongsList();
  await renderAlbumList();
  await renderUserList();
  await renderArtistList();
});

// 🗑️ Nút Delete

async function deleteUser(id) {
  const user = await adminService.getUserById(id);
  if (!user) return alert("Không tìm thấy user!");
  user.isDeleted = true;
  await adminService.updateUserById(user);
  await renderUserList();
}

async function deleteArtist(id) {
  const artist = await adminService.getArtistById(id);
  if (!artist) return alert("Không tìm thấy artist!");
  artist.isDeleted = true;
  await adminService.updateArtistById(artist);
}

async function deleteAlbum(id) {
  const album = await adminService.getAlbumById(id);
  if (!album) return alert("Không tìm thấy album!");
  album.isDeleted = true;
  await adminService.updateAlbumById(album);
}

async function deleteSong(id) {
  const song = await adminService.getSongById(id);
  if (!song) return alert("Không tìm thấy bài hát!");
  song.isDeleted = true;
  await adminService.updateSongById(song);
}

async function checkRole() {
  if (!user) {
    window.location.href = "./login.html";
  } else {
    profile = profileService.getUserByEmail(user.email);
    if (profile.roleId != 1) {
      localStorage.removeItem("user_session");
      window.location.href = "./login.html";
    }
  }
}
checkRole();
