export const user = JSON.parse(localStorage.getItem("user_session"))?.user;
console.log(user);
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("user_session");

  const loginLink = document.getElementById("login-link");
  const signupLink = document.getElementById("signup-link");
  const profileLink = document.getElementById("profile-link");
  const logoutLink = document.getElementById("logout-link");

  if (isLoggedIn) {
    // Nếu đã đăng nhập
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    profileLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
  } else {
    // Nếu chưa đăng nhập
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    profileLink.style.display = "none";
    logoutLink.style.display = "none";
  }

  // Log out
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user_session"); 
    window.location.href = "index.html"; 
  });
});
