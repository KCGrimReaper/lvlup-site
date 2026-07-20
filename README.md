# Site LVL UP

Site vitrine statique (HTML/CSS/JS, sans build). Structure :

```
index.html
admin.html                 -> outil de gestion du catalogue (formulaire, sans code)
assets/
  css/style.css            -> tous les styles
  js/site.js               -> nav, modales, formulaire, menu mobile
  js/planning.js           -> table du planning des sessions (voir plus bas)
  js/formations-data.js    -> catalogue de formations (données à éditer)
  js/formations-render.js  -> affichage du catalogue (ne pas éditer)
  img/                     -> logo, photo
```

## Mettre à jour le planning des sessions

Plus besoin de toucher au HTML. Ouvre `assets/js/planning.js` et édite le
tableau `SESSIONS` en haut du fichier :

```js
const SESSIONS = [
  { date: "18 - 19 Mai", formation: "Leading SAFe® 6.0", format: "Paris / Présentiel", status: "ouvert" },
  // status: "ouvert" -> bouton "S'inscrire" | "complet" -> "Session complète"
];
```

La table se reconstruit toute seule au chargement de la page.

## Ajouter / modifier / supprimer une formation

**Sans toucher au code** : ouvre `admin.html` avec Live Server (clic droit →
Open with Live Server, comme pour `index.html`). C'est un formulaire — titre,
prix, description, étapes du programme, etc. Il affiche le catalogue actuel,
tu modifies/ajoutes/supprimes, puis il génère le code à copier-coller dans
`assets/js/formations-data.js` (instructions affichées sur la page). C'est un
outil de travail local, il ne fait pas partie du site public.

**Pour un développeur** : les données vivent dans `assets/js/formations-data.js`,
tableau `FORMATIONS`. Chaque formation est un seul objet — la carte dans la
grille **et** sa fiche modale sont générées automatiquement à partir de ce
même objet par `assets/js/formations-render.js`, rien à dupliquer.

`category` doit être `safe`, `lean` ou `strategie` pour matcher un chip de
filtre existant. Pour une nouvelle catégorie, ajoute le chip correspondant
dans `index.html` (section `.filter-chips`) — les compteurs ("SAFe · 3") se
recalculent tout seuls, aucune autre modif nécessaire.

## Déploiement (à faire une seule fois)

1. Crée un repo vide sur GitHub (ex: `lvlup-site`), sans README/licence.
2. Depuis ce dossier :
   ```
   git remote add origin git@github.com:<ton-compte>/lvlup-site.git
   git branch -M main
   git push -u origin main
   ```
3. Sur Netlify : **Add new site → Import an existing project → GitHub** →
   choisis le repo. Build command : *(vide)*, Publish directory : `.`
4. Netlify déploiera automatiquement à chaque `git push` sur `main`.
   Plus besoin de publier à la main.

## Workflow au quotidien

- Les modifs sont faites ici (avec Claude), commit + push sur une branche ou direct sur `main` selon ce qu'on décide.
- Toi : `git pull` dans VS Code pour récupérer, Netlify redéploie tout seul dès que `main` bouge.
