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

// --- Filtres formations ---
const chips = document.querySelectorAll('.chip');
const formationCards = document.querySelectorAll('.formation-card');

// Compteurs calculés à partir des cartes réellement présentes (pas de nombre en dur à maintenir)
chips.forEach(chip => {
    const filter = chip.getAttribute('data-filter');
    const label = chip.getAttribute('data-label');
    const count = filter === 'all'
        ? formationCards.length
        : document.querySelectorAll(`.formation-card[data-category="${filter}"]`).length;
    chip.textContent = `${label} · ${count}`;
});

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        formationCards.forEach(card => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.classList.toggle('hidden', !match);
        });
    });
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
