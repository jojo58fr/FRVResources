# FRVResources

<img src="./doc/images/overview/repository-banner.png"/>

[:computer: Releases](https://github.com/jojo58fr/FRVResources/releases) | [:bug: Report an issue](https://github.com/jojo58fr/FRVResources/issues)

FRVResources est une site ressource qui liste de ressources gratuites et payantes pour VTubers qui souhaiterais se lancer et mise en avant des artistes français qui proposent des assets.

## Fonctionnalites principales


## Stack technique
- React 18 + Vite pour le bundling.
- FontAwesome pour les composants UI.

## Prerequis
- Node.js 18+ (recommande) et npm 9+.

## Installation
```bash
git clone https://github.com/jojo58fr/FRVArt.git
cd FRVArt/client
npm install
```

## Lancement en developpement
```bash
npm run dev
```
Le serveur Vite affiche l'URL locale dans la console (par defaut http://localhost:5173). Les sessions Bluesky sont persistees en local par defaut; cochez "Ne pas se souvenir de moi" dans le dialogue de connexion pour desactiver cette persistance.

## Build de production
```bash
npm run build
npm run preview
```

## Scripts npm utiles
- `npm run dev` : lance Vite en mode developpement.
- `npm run build` : compile TypeScript et genere les assets de production.
- `npm run preview` : previsualise le build de production.
- `npm run lint` : execute ESLint sur l'ensemble du projet.

## Organisation du projet
```
client/
  src/
    components/      Composants React reutilisables (dialogues, cartes, navbars)
    pages/            Pages du site
  metadata-version.json
  package.json
README.md            (ce fichier)
CONTRIBUTING.md      Guide de contribution
```

## Changelog
Les nouveautes sont maintenues dans [`client/CHANGELOG.md`](client/CHANGELOG.md). Chaque contribution significative doit ajouter une entree dans ce fichier.

## Contribution
Les contributions sont les bienvenues. Merci de consulter le guide [CONTRIBUTING.md](CONTRIBUTING.md) pour le detail du flux de travail, des normes de code et des attentes en matiere de tests.

## Support et communautes
- Discord FRVtubers : https://discord.gg/meyHQYWvjU

## Contributing & Support
- Suggestions / issues: https://github.com/jojo58fr/FRVResources/issues
- Contact Discord: TakuDev
- Contact: Joachim Miens – contact@joachim-miens.com

## Licence
La licence est sous GPLV3. Vous pouvez consulter la licence complète ici: [LICENCE.md](LICENCE.md). Un résumé de la licence se trouve ici: [GPLV3.md](GPLV3.md)