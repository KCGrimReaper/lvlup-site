// =============================================
// AFFICHAGE DU CATALOGUE DE FORMATIONS
// Lit les données depuis assets/js/formations-data.js (const FORMATIONS)
// Ne pas éditer ce fichier pour ajouter/modifier une formation :
// -> utilise admin.html (formulaire), ou édite formations-data.js.
// =============================================

function renderFormations() {
    const grid = document.getElementById('formations-grid');
    const modalsContainer = document.getElementById('formations-modals');
    if (!grid || !modalsContainer) return;

    // --- Cartes ---
    grid.innerHTML = FORMATIONS.map(f => `
        <div class="card formation-card cat-${f.category}" data-category="${f.category}">
            <div class="badges">
                ${f.badges.map(b => `<span class="badge ${b.type}">${b.label}</span>`).join('')}
            </div>
            <h3>${f.title}</h3>
            <p>${f.description}</p>
            <div class="card-footer">
                <button class="btn-small btn-outline open-modal" data-modal="modal-${f.id}">Détails & Programme</button>
            </div>
        </div>`).join('');

    // --- Modales ---
    modalsContainer.innerHTML = FORMATIONS.map(f => `
        <div id="modal-${f.id}" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Fiche Formation : ${f.title}</h2>
                <div class="modal-info-bar">
                    <span><strong>Durée :</strong> ${f.duree}</span>
                    <span><strong>Format :</strong> ${f.format}</span>
                </div>
                <div class="modal-body">
                    <h3>Programme</h3>
                    <ol class="quick-program">
                        ${f.programme.map(step => `<li><strong>${step}</strong></li>`).join('')}
                    </ol>
                    <button class="btn contact-from-modal" data-value="Formation" data-message="${f.ctaMessage}">${f.ctaLabel}</button>
                </div>
            </div>
        </div>`).join('');

    // --- Chips de filtre : compteurs + tri ---
    const chips = document.querySelectorAll('.chip');
    const cards = grid.querySelectorAll('.formation-card');
    chips.forEach(chip => {
        const filter = chip.getAttribute('data-filter');
        const label = chip.getAttribute('data-label');
        const count = filter === 'all' ? FORMATIONS.length : FORMATIONS.filter(f => f.category === filter).length;
        chip.textContent = `${label} · ${count}`;
        chip.onclick = () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            cards.forEach(card => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('hidden', !match);
            });
        };
    });
}

document.addEventListener('DOMContentLoaded', renderFormations);
