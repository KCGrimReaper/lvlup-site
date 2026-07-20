// =============================================
// ⚠️ NE COLLE JAMAIS LE CODE GÉNÉRÉ PAR admin.html ICI ⚠️
// (ça va dans planning-data.js, pas dans ce fichier)
// =============================================
// AFFICHAGE DU PLANNING DES SESSIONS
// Lit les données depuis assets/js/planning-data.js (const SESSIONS)
// =============================================

function renderPlanning() {
    const tbody = document.getElementById('planning-body');
    if (!tbody) return;

    tbody.innerHTML = SESSIONS.map(s => {
        const actionCell = s.status === "complet"
            ? `<td><span class="status-badge status-full">Complet</span></td>`
            : `<td><button class="btn-small enroll-btn" data-course="${s.formation} (${s.date})">S'inscrire</button></td>`;

        return `<tr>
            <td>${s.date}</td>
            <td><strong>${s.formation}</strong></td>
            <td>${s.format}</td>
            ${actionCell}
        </tr>`;
    }).join('');

    // Les boutons "S'inscrire" sont créés dynamiquement : on rattache leur événement ici
    tbody.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.onclick = function() {
            const course = this.getAttribute('data-course');
            document.getElementById('sujet').value = "Formation";
            document.getElementById('message').value = "Bonjour, je souhaite m'inscrire à la session de formation : " + course + ".";
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

document.addEventListener('DOMContentLoaded', renderPlanning);
