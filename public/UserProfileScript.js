function togglePassword() {
  var passwordInput = document.getElementById("userPassword");
  var toggleButton = document.querySelector(".toggle-password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleButton.textContent = "Show";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  let registerButton = document.getElementById("registerCompany");
  if(registerButton){
    registerButton.addEventListener("click", async function(){

      window.location.href = "/register-company";

    })
  }

  var joinButton = document.getElementById("joinButton");
  if (joinButton) {
    joinButton.addEventListener("click", async function () {
      var userInput = prompt("Katılma kodunuzu giriniz.", "");

      if (userInput === null) {
        alert("İptal Edildi.");
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
          alert(result.message);
        }

        alert("Şirkete katıldınız. Sayfa 2 saniye içinde yenilecenektir.");

        setTimeout(function () {
          location.reload();
        }, 2000); 

      } catch (error) {
        console.error("Fetch error:", error);
        alert("An error occurred while joining the company.");
      }
    });
  }
});
