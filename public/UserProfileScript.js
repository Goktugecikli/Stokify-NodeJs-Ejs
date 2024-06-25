function togglePassword() {
  var passwordInput = document.getElementById("userPassword");
  var toggleButton = document.getElementById("showPassword");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.textContent = "Gizle";
  } else {
    passwordInput.type = "password";
    toggleButton.textContent = "Şifreyi Göster";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let registerButton = document.getElementById("registerCompany");
  if (registerButton) {
    registerButton.addEventListener("click", async function () {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Şirket Kayıt Ekranına Yönlendiriliyorsunuz..."
      });

      setTimeout(function () {
        window.location.href = "/register-company";
      }, 1005);
    });
  }
  let getInviteCodeButton = document.getElementById("getInviteCode");
  if (getInviteCodeButton) {
    getInviteCodeButton.addEventListener("click", async (event) => {
      event.preventDefault();
  
      try {
        const response = await fetch("/api/company/get-invite-code");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        let responseJson = await response.json();
        console.log("Gelen Result: ", responseJson);
        if (responseJson.success === false) {
          Swal.fire({
            icon: "error",
            title: "Hata!",
            text: responseJson.message,
            confirmButtonText: "Tamam",
            allowOutsideClick: false, // Dışarı tıklamayı kapat
            allowEscapeKey: false, // ESC tuşunu kapat
            allowEnterKey: true, // Enter tuşunu aç
          }).then((result) => {
            if (result.isConfirmed) {}
          });
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Katılım Kodu",
          text: `Şirket Katılım Kodunuz: ${responseJson.inviteCode}`,
          confirmButtonText: "Tamam",
          allowOutsideClick: false, // Dışarı tıklamayı kapat
          allowEscapeKey: false, // ESC tuşunu kapat
          allowEnterKey: true, // Enter tuşunu aç
        }).then((result) => {
          if (result.isConfirmed) {}
        });
  
      } catch (err) {
        console.log("İstek atılırken hata meydana geldi.", err);
      }
    });
  }
  var joinButton = document.getElementById("joinButton");
  if (joinButton) {
    joinButton.addEventListener("click", async function () {
       const { value: userInput } = await Swal.fire({
        title: "Lütfen Şirket Davet Kodunuzu Giriniz.",
        input: "text",
        inputLabel: "Davet Kodun:",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Ops Bir şeyler hatalı ...";
          }
        }
      });
    
      if (userInput === undefined) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "info",
          title: "İşlemi İptal Ettiniz"
        });
        return;
      }

      try {
        const response = await fetch("/api/user/join-company-by-company-id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inviteCode: userInput }),
        });

        const result = await response.json();
        console.log(result);

        if (result.success === false) {
          Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: result.message,
            confirmButtonText: 'Anladım.',
            allowOutsideClick: false, // Dışarı tıklamayı kapat
            allowEscapeKey: false, // ESC tuşunu kapat
            allowEnterKey: true // Enter tuşunu aç
          }).then((result) => {
            if (result.isConfirmed) {
             
            }
          });
        }

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Şirkete hoşgeldiniz"
        });

        setTimeout(function () {
          location.reload();
        }, 3005);
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: "Şirkete katılırken bir hata meydana geldi",
          confirmButtonText: 'Anladım.',
          allowOutsideClick: false, // Dışarı tıklamayı kapat
          allowEscapeKey: false, // ESC tuşunu kapat
          allowEnterKey: true // Enter tuşunu aç
        }).then((result) => {
          if (result.isConfirmed) {
           
          }
        });
      }
    });
  }
});
