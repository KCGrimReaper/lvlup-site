// =============================================
// SITE LVL UP — Navigation, modales, formulaire
// =============================================

// --- Modales (délégation : fonctionne même pour les modales générées
//     dynamiquement par formations.js, peu importe l'ordre de chargement) ---
const messageTextarea = document.getElementById('message');
const subjectSelect = document.getElementById('sujet');

document.addEventListener('click', function(e) {
    const openBtn = e.target.closest('.open-modal');
    if (openBtn) {
        const modal = document.getElementById(openBtn.getAttribute('data-modal'));
        if (modal) { modal.style.display = "block"; document.body.style.overflow = "hidden"; }
        return;
    }
    const closeBtn = e.target.closest('.close-modal');
    if (closeBtn) {
        closeBtn.closest('.modal').style.display = "none";
        document.body.style.overflow = "auto";
        return;
    }
    if (e.target.classList.contains('modal')) {
        e.target.style.display = "none";
        document.body.style.overflow = "auto";
        return;
    }
    const contactBtn = e.target.closest('.contact-from-modal');
    if (contactBtn) {
        subjectSelect.value = contactBtn.getAttribute('data-value');
        messageTextarea.value = contactBtn.getAttribute('data-message');
        document.querySelectorAll('.modal').forEach(m => m.style.display = "none");
        document.body.style.overflow = "auto";
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// --- Navigation smooth scroll ---
document.querySelectorAll('.navbar-nav a, .navbar-mobile a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Menu hamburger (mobile) ---
const hamburger = document.getElementById('hamburger');
const navbarMobile = document.getElementById('navbar-mobile');

function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    navbarMobile.classList.toggle('open', open);
}

hamburger.addEventListener('click', () => toggleMenu(!navbarMobile.classList.contains('open')));

navbarMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});
