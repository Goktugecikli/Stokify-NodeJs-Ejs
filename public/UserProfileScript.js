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
async function joinCompany() {
  var userInput = prompt("Please Enter Company Id", "");

  if (userInput === null) {
    alert("You have canceled the join request");
    return;
    // Kullanıcı verisi boş değilse ve iptal edilmediyse işlPlem yapabiliriz
  }
  // alert("Girilen veri: " + companyId);

  const response = await fetch("/api/user/join-company-by-company-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ invateCode: userInput }),
  });

  const result = await response.json();
  console.log(JSON.stringify(result));
  if (!result.success) {
    alert(result.message);
    return;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var joinButton = document.getElementById("joinButton");
  if (joinButton) {
    joinButton.addEventListener("click", async function () {
      var userInput = prompt("Please Enter Company Id", "");

      if (userInput === null) {
        alert("You have canceled the join request");
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

        alert("You joined the company. Page will be reload in 2 seconds");

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
