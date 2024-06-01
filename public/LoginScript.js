
// import { validateUser } from './UserInterfaceService.js';

const main = document.getElementById('main');
const projectName = document.getElementById('project_name');


box.addEventListener('mouseenter', () => {
    projectName.style.zIndex = 0;
    projectName.style.top = '10%';
});

// box.addEventListener('mouseleave', () => {
//     projectName.style.top = '30%';
//     projectName.style.zIndex = -1;
// });

var x = document.getElementById("to_signup_button");
var y = document.getElementById("signin");
var a = document.getElementById("box");
var b = document.getElementById("box2");
var loginButton = document.getElementById('login');



document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login');
    loginButton.addEventListener('click', async function() {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        const response = await fetch('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const result = await response.json();
        if (result.success) {
            
            window.location.href = result.redirectUrl;
        } else {
            alert(result.message);
        }
    });
});


 
function ToSignUp(){
    a.style.display= "none";
    b.style.display ="flex";
}

function SignIn(){
    b.style.display ="none";
    a.style.display= "flex";
}

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




