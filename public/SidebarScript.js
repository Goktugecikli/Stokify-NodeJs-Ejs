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
