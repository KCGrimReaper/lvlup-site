// =============================================
// SITE LVL UP — Navigation, modales, formulaire
// =============================================

// --- Modales formations ---
const modals = document.querySelectorAll('.modal');
const openBtns = document.querySelectorAll('.open-modal');
const closeBtns = document.querySelectorAll('.close-modal');
const contactFromModalBtns = document.querySelectorAll('.contact-from-modal');
const messageTextarea = document.getElementById('message');
const subjectSelect = document.getElementById('sujet');

openBtns.forEach(btn => {
    btn.onclick = function() {
        document.getElementById(this.getAttribute('data-modal')).style.display = "block";
        document.body.style.overflow = "hidden";
    }
});

closeBtns.forEach(btn => {
    btn.onclick = function() {
        this.closest('.modal').style.display = "none";
        document.body.style.overflow = "auto";
    }
});

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

contactFromModalBtns.forEach(btn => {
    btn.onclick = function() {
        subjectSelect.value = this.getAttribute('data-value');
        messageTextarea.value = this.getAttribute('data-message');
        modals.forEach(m => m.style.display = "none");
        document.body.style.overflow = "auto";
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// --- Navigation smooth scroll ---
document.querySelectorAll('.sidebar nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Menu hamburger (mobile) ---
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    sidebar.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!sidebar.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) toggleMenu(false);
    });
});
