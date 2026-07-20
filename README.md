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

## Ajouter / modifier / supprimer une formation

Tout se passe dans `assets/js/formations.js`, tableau `FORMATIONS` en haut du
fichier. Chaque formation est un seul objet — la carte dans la grille **et**
sa fiche modale (durée, format, programme, bouton de contact) sont générées
automatiquement à partir de ce même objet, rien à dupliquer.

- **Ajouter** : copie un objet existant, donne-lui un `id` unique, remplis les champs.
- **Modifier** : édite les champs de l'objet concerné.
- **Supprimer** : supprime l'objet.

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
