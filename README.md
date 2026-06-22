# SortFlow

Visualiseur desktop d’algorithmes de tri construit avec Rust, Tauri v2, React, TypeScript et Canvas 2D.

## MVP v0.1.0

- génération et mélange de 10 à 200 valeurs ;
- dix algorithmes calculés côté Rust : Bubble, Selection, Insertion, Cocktail, Comb, Shell, Quick, Merge, Heap et Gnome Sort ;
- sélection de l’algorithme sans modifier la liste initiale ;
- sélecteur sombre personnalisé avec navigation clavier ;
- affichage du fichier Rust réellement exécuté et surlignage synchronisé de la ligne active ;
- description pédagogique repliable pour chaque algorithme ;
- fiches de complexité, stabilité, mémoire et fonctionnement in-place ;
- huit distributions de données : aléatoire, inversée, triée, presque triée, valeurs répétées, dents de scie, montagne et vallée ;
- modes pédagogique (une étape visible) et rapide (traitement par lots) ;
- opération active et couleurs distinctes pour comparaison, échange et écriture ;
- lecture, pause, pas à pas et réinitialisation ;
- contrôle de la vitesse ;
- couleurs distinctes pour les valeurs comparées, échangées et triées ;
- statistiques et progression en temps réel ;
- rendu Canvas adaptatif avec un `ResizeObserver` persistant et dessin via `requestAnimationFrame` ;
- validation backend limitée à 2 000 valeurs.

## Développement

Prérequis : Rust stable, Node.js 20+ et les dépendances système de Tauri pour la plateforme.

```bash
npm --prefix frontend install
npm --prefix frontend run tauri -- dev
```

Le frontend seul peut être lancé avec `npm --prefix frontend run dev`, mais la commande de tri nécessite alors l’environnement Tauri.

## Vérifications

```bash
cargo test
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run tauri -- build
```

## Architecture

```text
Registre et sources Rust -> Vec<SortStep + sourceLine> -> reducer React -> Canvas + panneau de code
```

Le backend ne gère aucune temporisation ni animation. Le frontend ne réimplémente pas l’algorithme de tri.
