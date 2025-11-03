
function checkPassword (checkPassword) {
    let lowerCaseLetter = /[a-z]/g;
    let upperCaseLetter = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if (checkPassword.lenght < 8 ) {
        return"Password must be at least 8 characters";
    } else if (!checkPassword.match(lowerCaseLetter)){
        return "Password must contain a lowrcase letter";
    } else if (!checkPassword.match(upperCaseLetter)){
        return "Password must contain a uppercase letter";
    } else if (!checkPassword.match(numbers)){
        return "Password must contain a number or special character";
    }

    return null;
}

function checkEmail(Email){
     let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     console.log(Email)
     if (!Email.match(emailRegex)){
        return "Your email format is incorrect";
     }

     return null;
}



function register(){
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email2").value.trim();
    let password = document.getElementById("password2").value.trim();
    let confirmpassword = document.getElementById("confirmpassword").value.trim();

    let emailError= checkEmail(email);
    let passwordError= checkPassword(password);

    if (emailError){
        alert ('emailError')
        return
    } 
    if (passwordError){
         alert ("Password invalid")
        return
    }
    if (confirmpassword !== password){
        alert ("Password not the same")
        return
    }

    if(localStorage.getItem("users")){
        let users = JSON.parse(localStorage.getItem("users"));

        console.log(users)

        if( users.find((e) => e.email === email)){
            alert ("Email is existed");
            return;
        }

        users.push (
            {
                id :  Number(users[users.length - 1].id) + 1,
                email,
                password,
                username,
                joinDate: new Date().toISOString().split('T')[0],
            }
        ) ;
        localStorage.setItem("users", JSON.stringify(users))

    }else{
        let users =[];

        users.push({
            id:1,
            email,
            password,
            username,
            joinDate: new Date().toISOString().split('T')[0],

        });
        localStorage.setItem("users", JSON.stringify(users))
    }
    alert('Create account successful')
}

let registerForm = document.getElementById("register")
registerForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    register()
})