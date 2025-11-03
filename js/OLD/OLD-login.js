    if (localStorage.getItem("currentUser")){
      location.href='./index.html'
    }

   
    function showRegister() {
      document.getElementById("login-form").classList.remove("active");
      document.getElementById("register-form").classList.add("active");
    }

    function showLogin() {
      document.getElementById("register-form").classList.remove("active");
      document.getElementById("login-form").classList.add("active");
    }
let form = document.querySelector("#login");



function login (e){
  console.log(e);
  e.preventDefault();

  if (!localStorage.getItem("users")){
    alert("No user found");
  }else {
    let users= JSON.parse(localStorage.getItem("users"));
    let email = document.getElementById("email")
    let password = document.getElementById("password");
    let existingUser = null ;
    users.forEach((element) => {
      if (element.email === email.value.trim()){
        if (element.password === password.value.trim()){
          existingUser = element;
        }
      }
    })
    if (existingUser){
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      location.href = "./index.html";
    } else {
      alert("Email or password is incorrect");
    }
  }
}

form.addEventListener("submit", (e) => login (e));