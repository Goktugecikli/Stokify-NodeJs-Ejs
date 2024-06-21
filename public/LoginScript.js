const main = document.getElementById("main");
const projectName = document.getElementById("project_name");

box.addEventListener("mouseenter", () => {
  projectName.style.zIndex = 0;
  projectName.style.top = "10%";
});

// box.addEventListener('mouseleave', () => {
//     projectName.style.top = '30%';
//     projectName.style.zIndex = -1;
// });
function showSuccessMessage() {
  Swal.fire({
    icon: 'success',
    title: 'Başarılı!',
    text: 'Form başarıyla gönderildi.',
    confirmButtonText: 'Tamam',
    allowOutsideClick: false, // Dışarı tıklamayı kapat
    allowEscapeKey: false, // ESC tuşunu kapat
    allowEnterKey: true // Enter tuşunu aç
  }).then((result) => {
    // Kullanıcı Tamam'a tıkladığında yapılacak işlemler buraya yazılır
    if (result.isConfirmed) {
      console.log('Kullanıcı Tamam\'a tıkladı');
      // İşlem yapılabilir (örneğin başka bir sayfaya yönlendirme)
    }
  });
}

var x = document.getElementById("to_signup_button");

var a = document.getElementById("box");
var b = document.getElementById("box2");
var signupButton = document.getElementById("tosignup");

function SignIn() {
  b.style.display = "none";
  a.style.display = "flex";
}
// function GetAlertToastify(text,duration,close, backgroundColorStr,className){
//     Toastify({
//         text: text,
//         duration: duration,
//         close: close,
//         gravity: "top", // "top" or "bottom"
//         position: "center", // `left`, `center` or `right`
//         backgroundColor: backgroundColorStr,
//         className: className,
//       }).showToast();
// }
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
          confirmButtonText: 'Sayfaya Gir',
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
        confirmButtonText: 'Özür Dilerim',
        allowOutsideClick: false, // Dışarı tıklamayı kapat
        allowEscapeKey: false, // ESC tuşunu kapat
        allowEnterKey: true // Enter tuşunu aç
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
        // GetAlertToastify(result.message, 2000,true, "linear-gradient(to right, #800101,#a10303)","toastify-center");
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

document.addEventListener("DOMContentLoaded", function () {
  var registerBtn = document.getElementById("register");

  registerBtn.addEventListener("click", async function () {
    const firstName = document.querySelector(".Firstname").value;
    const lastName = document.querySelector(".LastName").value;
    const email = document.querySelector(".Email").value;
    const username = document.querySelector(".Signup_username").value;
    const password = document.querySelector(".Signup_password").value;
    const passwordCheck = document.querySelector(".password_check").value;

    if (password !== passwordCheck) {
      alert("Uyuşmuyor");
      return;
    }

    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, username, password }),
    });

    const result = await response.json();
    console.log(JSON.stringify(result));
    if (result.success) {
      window.location.href = result.redirectUrl;
    } else {
      alert(result.message);
    }
  });
});

// function getAlert(msg, color) {
//     Toastify({
//         text: msg,
//         duration: 3000,
//         close: true,
//         gravity: "top",
//         position: 'center',
//         backgroundColor: color,
//         stopOnFocus: true,
//     }).showToast();
// };
