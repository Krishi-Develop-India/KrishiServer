const menubtn = document.querySelector('.menu-btn');
const menuItem = document.querySelector('.navigation');

let menuOpen = false;

menubtn.addEventListener('click', () => {
    if(!menuOpen) {
        menubtn.classList.add('open');
        menuItem.classList.add('show-list-items')
        menuOpen = true;
    } else {
        menubtn.classList.remove('open');
        menuItem.classList.remove('show-list-items')
        menuOpen = false;
    }
});