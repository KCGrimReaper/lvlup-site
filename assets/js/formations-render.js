// =============================================
// ⚠️ NE COLLE JAMAIS LE CODE GÉNÉRÉ PAR admin.html ICI ⚠️
// (ça va dans formations-data.js, pas dans ce fichier)
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

    // --- Chips de filtre : générés depuis les catégories présentes dans les données ---
    const chipsContainer = document.getElementById('filter-chips');
    if (chipsContainer) {
        const seen = new Map(); // category -> categoryLabel, dans l'ordre d'apparition
        FORMATIONS.forEach(f => { if (!seen.has(f.category)) seen.set(f.category, f.categoryLabel || f.category); });

        const chipDefs = [{ filter: 'all', label: 'Toutes' }, ...[...seen.entries()].map(([cat, label]) => ({ filter: cat, label }))];

        chipsContainer.innerHTML = chipDefs.map((c, i) =>
            `<button class="chip${i === 0 ? ' active' : ''}" data-filter="${c.filter}">${c.label}</button>`
        ).join('');

        const chips = chipsContainer.querySelectorAll('.chip');
        const cards = grid.querySelectorAll('.formation-card');
        chipDefs.forEach((c, i) => {
            const chip = chips[i];
            const count = c.filter === 'all' ? FORMATIONS.length : FORMATIONS.filter(f => f.category === c.filter).length;
            chip.textContent = `${c.label} · ${count}`;
            chip.onclick = () => {
                chips.forEach(ch => ch.classList.remove('active'));
                chip.classList.add('active');
                cards.forEach(card => {
                    const match = c.filter === 'all' || card.getAttribute('data-category') === c.filter;
                    card.classList.toggle('hidden', !match);
                });
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', renderFormations);
