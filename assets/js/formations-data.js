// =============================================
// CATALOGUE DE FORMATIONS — source de données unique
// =============================================
// Pour AJOUTER une formation : copie un objet ci-dessous, change l'id (unique,
// sans espace), remplis les champs. Elle apparaît automatiquement dans la
// grille, dans le bon filtre, et sa fiche modale est générée toute seule.
// Pour SUPPRIMER une formation : supprime son objet.
// Pour la MODIFIER : édite ses champs, rien d'autre à toucher.
//
// category : "safe" | "lean" | "strategie" (ou une nouvelle catégorie — ajoute
// alors le chip correspondant dans index.html, section .filter-chips)
const FORMATIONS = [
    {
        id: "safe",
        category: "safe",
        title: "Leading SAFe® 6.0",
        badges: [
            { type: "certifiant", label: "Certifiant" },
            { type: "niveau", label: "Avancé" },
            { type: "tarif", label: "à partir de 670€ HT" },
        ],
        description: "Alignez la stratégie et l'exécution. Préparez-vous à mener une transformation Lean-Agile à l'échelle de l'entreprise.",
        duree: "2 jours (16h)",
        format: "Présentiel ou Distanciel",
        programme: [
            "L'ère du numérique et la Business Agility",
            "Le leadership Lean & Agile",
            "Comment coordonner la construction et la livraison de produits complexes à l'échelle",
            "Lean Portfolio Management",
            "Conduire le changement",
        ],
        ctaLabel: "Demander un devis certifiant",
        ctaMessage: "Bonjour, je souhaiterais recevoir un devis pour la certification Leading SAFe.",
    },
    {
        id: "hardware",
        category: "safe",
        title: "SAFe® Hardware",
        badges: [
            { type: "certifiant", label: "Certifiant" },
            { type: "niveau", label: "Tous niveaux" },
            { type: "tarif", label: "à partir de 670€ HT" },
        ],
        description: "Appliquez les principes agiles au développement de produits physiques. Réduisez votre time-to-market hors du logiciel.",
        duree: "3 jours",
        format: "Présentiel ou Distanciel",
        programme: [
            "Mindset Industriel",
            "Modélisation & Itérations",
            "Kanban HW",
            "Design for Change",
        ],
        ctaLabel: "Intéressé par le sur-mesure",
        ctaMessage: "Bonjour, je suis intéressé par votre atelier Agilité Hardware. Pouvez-vous me recontacter pour discuter d'un format sur-mesure ?",
    },
    {
        id: "popm",
        category: "safe",
        title: "SAFe® PO/PM",
        badges: [
            { type: "certifiant", label: "Certifiant" },
            { type: "niveau", label: "Tous niveaux" },
            { type: "tarif", label: "à partir de 670€ HT" },
        ],
        description: "Apprenez en plus sur le Product Management dans un environnement de travail agile à l'échelle.",
        duree: "2 jours (16h)",
        format: "Présentiel ou Distanciel",
        programme: [
            "Rôles et responsabilités des PO et de la Gestion de Produit",
            "Etat d'esprit Lean-Agile, chaînes de valeur, responsabilités PO/Product Manager.",
            "Préparation au PI Planning (vision, roadmap, priorisation, backlog et ART Kanban)",
            "Le rôle du PO/PM pendant le PI Planning",
            "Exécuter un PI",
        ],
        ctaLabel: "Demander un devis certifiant",
        ctaMessage: "Bonjour, je souhaiterais recevoir un devis pour la certification SAFe PO/PM.",
    },
    {
        id: "lean",
        category: "lean",
        title: "Introduction au Lean",
        badges: [
            { type: "pratique", label: "Initiation" },
            { type: "tarif", label: "à partir de 150€ HT" },
        ],
        description: "Découvrez comment identifier et éliminer les gaspillages dans vos processus pour gagner en efficacité au quotidien.",
        duree: "1 jour",
        format: "Présentiel recommandé",
        programme: [
            "Les 3 M",
            "VSM (Value Stream Mapping)",
            "Gemba Walk",
            "Amélioration Continue",
        ],
        ctaLabel: "Demander le programme complet",
        ctaMessage: "Bonjour, je souhaite obtenir le programme complet de la formation Introduction au Lean.",
    },
    {
        id: "okr",
        category: "strategie",
        title: "Maîtriser les OKRs",
        badges: [
            { type: "niveau", label: "Stratégie" },
            { type: "tarif", label: "à partir de 450€ HT" },
        ],
        description: "Alignez vos équipes sur des objectifs clairs et mesurables. Passez d'une culture de la tâche à une culture du résultat.",
        duree: "2 demi-journées",
        format: "Coaching de groupe",
        programme: [
            "Stratégie vs Exécution",
            "Écriture d'OKRs",
            "Cycles de vie",
            "Alignement",
        ],
        ctaLabel: "Discuter de mon besoin stratégique",
        ctaMessage: "Bonjour, nous souhaiterions mettre en place des OKRs dans notre organisation. Pouvons-nous échanger sur votre coaching ?",
    },
];
