# Site LVL UP

Site vitrine statique (HTML/CSS/JS, sans build). Structure :

```
index.html
assets/
  css/style.css     -> tous les styles
  js/site.js        -> nav, modales, formulaire, menu mobile
  js/planning.js     -> table du planning des sessions (voir plus bas)
  js/arcade.js       -> moteur du jeu "LVL UP Adventure"
  img/               -> logo, photo
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

## Ajouter une formation

Dans `index.html`, section `#formations`, copie une `.formation-card` existante,
mets `data-category` sur `safe`, `lean` ou `strategie` (ou une nouvelle catégorie —
ajoute alors le chip correspondant dans `.filter-chips`). Les compteurs sur les
chips ("SAFe · 3") se recalculent automatiquement, rien à toucher côté JS.

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
