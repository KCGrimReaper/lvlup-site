// =============================================
// PLANNING DES SESSIONS — source de données unique
// =============================================
// Pour ajouter / modifier une session : édite ce tableau, rien d'autre.
// status: "ouvert" -> bouton "S'inscrire" | "complet" -> mention "Session complète"
const SESSIONS = [
    { date: "20 - 21 Avril", formation: "Leading SAFe® 6.0", format: "Distanciel", status: "complet" },
    { date: "18 - 19 Mai",   formation: "Leading SAFe® 6.0", format: "Paris / Présentiel", status: "ouvert" },
    { date: "1 - 2 Juin",    formation: "SAFe® PO/PM",       format: "Distanciel", status: "complet" },
    { date: "22 - 23 Juin",  formation: "Leading SAFe® 6.0", format: "Distanciel", status: "ouvert" },
];

function renderPlanning() {
    const tbody = document.getElementById('planning-body');
    if (!tbody) return;

    tbody.innerHTML = SESSIONS.map(s => {
        const actionCell = s.status === "complet"
            ? `<td class="txt-complet">Session complète</td>`
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
