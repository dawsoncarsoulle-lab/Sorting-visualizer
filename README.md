# SortFlow

Visualiseur desktop de Bubble Sort construit avec Rust, Tauri v2, React, TypeScript et Canvas 2D.

## MVP v0.1.0

- génération et mélange de 10 à 200 valeurs ;
- calcul des étapes de Bubble Sort côté Rust ;
- lecture, pause, pas à pas et réinitialisation ;
- contrôle de la vitesse ;
- couleurs distinctes pour les valeurs comparées, échangées et triées ;
- statistiques et progression en temps réel ;
- rendu Canvas adaptatif aux dimensions de la fenêtre.

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
Rust Bubble Sort -> Vec<SortStep> -> reducer d'animation React -> Canvas 2D
```

Le backend ne gère aucune temporisation ni animation. Le frontend ne réimplémente pas l’algorithme de tri.
