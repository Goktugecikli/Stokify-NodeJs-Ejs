
const showMenu = (toggleId, navbarId,bodyId) =>{
    const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId)

    if(toggle && navbar){
        toggle.addEventListener('click', ()=>{
            // APARECER MENU
            navbar.classList.toggle('show')
            // ROTATE TOGGLE
            toggle.classList.toggle('rotate')
            // PADDING BODY
            bodypadding.classList.toggle('expander')
        })
    }
}
showMenu('nav-toggle','navbar','body')

// LINK ACTIVE COLOR
const linkColor = document.querySelectorAll('.nav__link');   
function colorLink(){
    linkColor.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
}

linkColor.forEach(l => l.addEventListener('click', colorLink));

function handleIslemTuruChange() {
    var selectBox = document.getElementById("islemTuru");
    var urunAdiInput = document.getElementById("urunAdi");
    var markaInput = document.getElementById("marka");
    var barkodNoInput = document.getElementById("barkodNo");
    var adetSayisiGroup = document.getElementById("adetSayisiGroup");
    var adetSayisiInput = document.getElementById("adetSayisi");
    
    if (selectBox.value !== "") {
        urunAdiInput.disabled = false;
        markaInput.disabled = false;
        barkodNoInput.disabled = false;
        adetSayisiGroup.style.display = "block";
        adetSayisiInput.disabled = false;
    } else {
        urunAdiInput.disabled = true;
        markaInput.disabled = true;
        barkodNoInput.disabled = true;
        adetSayisiGroup.style.display = "none";
        adetSayisiInput.disabled = true;
    }
}


