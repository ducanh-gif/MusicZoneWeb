import * as profileService from "../services/profile-service.js";
import { user } from "../config/check_session.js";
// Hiển thị thông tin user ra giao diện
 async function renderUserProfile(email) {
  const userInfo = await profileService.getUserByEmail(email);
  console.log(userInfo);
  if (!userInfo) {
    document.getElementById("profile-info").innerHTML = "<p>Không tìm thấy người dùng.</p>";
    return;
  }
  document.getElementById("profile-info").innerHTML = `
    <div class="profile-card">
      <img src="${userInfo.avtURL || 'https://placehold.co/100x100'}" alt="Avatar" class="profile-avatar">
      <h2>${userInfo.name}</h2>
      <p>Email: ${userInfo.email}</p>
      <p>Role: ${userInfo.roleId === 1 ? "Admin" : "User"}</p>
    </div>
  `;
}


document.addEventListener("DOMContentLoaded", () => {
    renderUserProfile(user.email);});  