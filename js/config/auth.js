import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { auth } from "../config/config.js";
import * as db from "../config/db.js";
import * as model from "../config/model.js";
import * as profileService from "../services/profile-service.js";

// Lấy các input theo id
const inpUsername = document.getElementById("username");
const inpEmail = document.getElementById("email");
const inpPwd = document.getElementById("password");
const inpConfirmPwd = document.getElementById("confirmpassword");

async function handleLogin(event) {
  event.preventDefault();
  try {
    let email = inpEmail.value;
    let password = inpPwd.value;

    if (!email || !password) {
      alert("Vui lòng điền đủ các trường");
      return;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    alert("Đăng nhập thành công 🎉");

    const userSession = {
      user: user,
      expiry: new Date().getTime() + 2 * 60 * 60 * 1000, // 2 tiếng
    };

    localStorage.setItem("user_session", JSON.stringify(userSession));
    profile = await profileService.getUserByEmail(user.email);
    if (profile.roleId == 1) {
      window.location.href = "./admin.html";
    } else {
      window.location.href = "./index.html";
    }
  } catch (error) {
    alert("Mật khẩu hoặc email không đúng");
  }
}

async function handleRegister(event) {
  event.preventDefault();

  let username = inpUsername.value;
  let email = inpEmail.value;
  let password = inpPwd.value;
  let confirmPassword = inpConfirmPwd.value;
  let roleId = 2; // 1: Admin, 2: Guest

  if (!username || !email || !password || !confirmPassword) {
    alert("Vui lòng điền đủ các trường");
    return;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp");
    return;
  }

  try {
    // Đăng ký với Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Tạo dữ liệu người dùng theo model.User
    const userData = new model.User(
      user.id, // id
      email, // email
      username, // name
      password, // password
      roleId, // roleId
      null, // favourite
      "", // avtURL
      false // isDeleted
    );

    await db.addDb("users", userData, model.userConverter);

    alert("Đăng ký thành công 🎉");
    window.location.href = "./login.html";
  } catch (error) {
    console.error("Registration error:", error);
    alert(`Lỗi: ${error.message}`);
  }
}

document.getElementById("register")?.addEventListener("submit", handleRegister);
document.getElementById("login")?.addEventListener("submit", handleLogin);
