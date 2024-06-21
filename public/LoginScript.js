
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

var a = document.getElementById("box");
var b = document.getElementById("box2");
var signupButton = document.getElementById('tosignup');


function SignIn(){
    b.style.display ="none";
    a.style.display= "flex";
}


document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('login');
    loginButton.addEventListener('click', async function() {
        
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        const response = await fetch('/api/user/auth', {
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


document.addEventListener('DOMContentLoaded', function() {
    var signupButton = document.getElementById('tosignup');
    signupButton.addEventListener('click',  function ToSignUp() {
     
        a.style.display= "none";
        b.style.display ="flex";
      
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var signin = document.getElementById('signin');
    signin.addEventListener('click',  function SignIn() {
     
        b.style.display ="none";
        a.style.display= "flex";
      
    });
});

document.addEventListener('DOMContentLoaded', function() {

    var registerBtn = document.getElementById("register");

    registerBtn.addEventListener('click', async function(){
        const firstName = document.querySelector('.Firstname').value;
        const lastName = document.querySelector('.LastName').value;
        const email = document.querySelector('.Email').value;
        const username = document.querySelector('.Signup_username').value;
        const password = document.querySelector('.Signup_password').value;
        const passwordCheck = document.querySelector('.password_check').value;

        if(password !== passwordCheck){
            alert("Uyuşmuyor");
            return;
        }

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName,lastName,email,username,password})
        });
        
        const result = await response.json();
        console.log(JSON.stringify(result));
        if (result.success) {
            
            window.location.href = result.redirectUrl;
        } else {
            alert(result.message);
        }
    })
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




