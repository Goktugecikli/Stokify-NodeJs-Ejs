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

let i = 0;

function PrintTitles() {

    var titles = ["Web Designer", "Software Developer", "Game Developer", "Graphic Designer"];


    document.getElementById("titles").innerHTML = titles[i];
    i++;
    if (i >= titles.length) {
        i = 0;
    }
}

var btnPrint = document.getElementById("title_change");
btnPrint.onclick = PrintTitles;