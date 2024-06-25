// LINK ACTIVE COLOR
const linkColor = document.querySelectorAll('.nav__link');   

function colorLink(event) {
    linkColor.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    sessionStorage.setItem('activeLink', this.href); // Aktif linki saklar
}

// Tüm linkler için click event listener eklenmesi
linkColor.forEach(l => l.addEventListener('click', colorLink));

// Sayfa yüklendiğinde aktif linki geri yükle
document.addEventListener('DOMContentLoaded', (event) => {
    const activeLink = sessionStorage.getItem('activeLink');
    if (activeLink) {
        linkColor.forEach(l => {
            if (l.href === activeLink) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });
    }
});


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