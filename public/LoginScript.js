const main = document.getElementById("main");
const projectName = document.getElementById("project_name");

box.addEventListener("mouseenter", () => {
  projectName.style.zIndex = 0;
  projectName.style.top = "10%";
});

var x = document.getElementById("to_signup_button");

var a = document.getElementById("box");
var b = document.getElementById("box2");
var signupButton = document.getElementById("tosignup");

function SignIn() {
  b.style.display = "none";
  a.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function () {
  var loginButton = document.getElementById("login");
  loginButton.addEventListener("click", async function () {
   
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı!',
        text: 'Bütün alanları doldurunuz',
        confirmButtonText: 'Anladım.',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
         
        }
      });
          return;
    }
    const response = await fetch("/api/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const serviceResult = await response.json();
    if (serviceResult.success) {
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Giriş işlemi başarılı',
          confirmButtonText: 'Siteye Gir',
          allowOutsideClick: false, // Dışarı tıklamayı kapat
          allowEscapeKey: false, // ESC tuşunu kapat
          allowEnterKey: true // Enter tuşunu aç
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = serviceResult.redirectUrl;
          }
        });
    //   window.location.href = result.redirectUrl;
    } else {
      Swal.fire({
        icon: 'danger',
        title: 'Hata!',
        text: 'Kullanıcı adı veya şifre yanlıştır.',
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {}
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var signupButton = document.getElementById("tosignup");
  signupButton.addEventListener("click", function ToSignUp() {
    a.style.display = "none";
    b.style.display = "flex";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var signin = document.getElementById("signin");
  signin.addEventListener("click", function SignIn() {
    b.style.display = "none";
    a.style.display = "flex";
  });
});

function validateEmailFunction(email) { 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basit bir email regex'i

  if (!emailRegex.test(email)) {
      return false;
  }

  const allowedDomains = ["gmail.com", "hotmail.com"]; // Kabul edilebilir uzantılar

  const domain = email.split('@')[1]; // Email adresinden domain kısmını al

  if (!allowedDomains.includes(domain)) {
      return false;
  }

  return true;
}

function validatePasswordFunction (password) {

  if (password.length < 8) {
      return false;
  }

  if (!/[a-z]/.test(password)) {
      return false;
  }

  if (!/[A-Z]/.test(password)) {
      return false;
  }

  if (!/\d/.test(password)) {
      return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  var registerBtn = document.getElementById("register");

  registerBtn.addEventListener("click", async function () {
    const firstName = document.querySelector(".Firstname").value;
    const lastName = document.querySelector(".LastName").value;
    const email = document.querySelector(".Email").value;
    const userName = document.querySelector(".Signup_username").value;
    const password = document.querySelector(".Signup_password").value;
    const passwordCheck = document.querySelector(".password_check").value;

    if (!firstName || !lastName ||!email  || !userName || !password || !passwordCheck){
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı!',
        text: 'Bütün alanları doldurunuz',
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {}
      });
      return;
    }

    if (password !== passwordCheck) {
      Swal.fire({
        icon: 'error',
        title: 'Uyarı!',
        text: 'Şifreler Uyuşmuyor',
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {}
      });
      return;
    }

    let validateEmail = validateEmailFunction(email);
    if(!validateEmail){
      Swal.fire({
        icon: 'error',
        title: 'Uyarı!',
        text: 'Lütfen mail adresinizin doğruluğunu kontrol edin',
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      })
      return;
    }
    let validatePassword = validatePasswordFunction(password);
    if(!validatePassword) {
      Swal.fire({
        icon: 'error',
        title: 'Uyarı!',
        text: 'Şifre en az 8 karakter uzunluğunda olmalı, en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      })
      return;
    }
    console.log(JSON.stringify({ firstName, lastName, email, username: userName, password }));
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, username: userName, password }),
    });

    const responseResult = await response.json();
    console.log(JSON.stringify(responseResult));
    if (responseResult.success) {
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Kayıt İşlemi Başarılı',
        confirmButtonText: 'Girişe Yönlendir',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = responseResult.redirectUrl;
        }
      });
      
    } else {
      Swal.fire({
        icon: 'danger',
        title: 'Hata!',
        text: responseResult.message,
        confirmButtonText: 'Anladım',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {}
      });
    }
  });
});

