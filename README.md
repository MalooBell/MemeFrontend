# 🎨 Meme Generator - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

Une interface utilisateur moderne, interactive et responsive pour créer, éditer et partager des mèmes. Ce projet exploite la puissance des Canvas HTML5 via React pour offrir une expérience d'édition fluide.

---

> **⚠️ NOTE IMPORTANTE SUR L'HÉBERGEMENT (DEMO)**
>
> Ce projet est actuellement hébergé sur l'offre gratuite de **Render**.
> Le serveur Backend se met en veille après une période d'inactivité.
> **Le premier chargement peut prendre jusqu'à 60 secondes.** Merci de votre patience ! ⏳

---

## ✨ Fonctionnalités Clés

### 🖌️ Éditeur Graphique Avancé
L'éditeur est le cœur de l'application, propulsé par `react-konva`.
- **Manipulation d'images :** Upload par Drag & Drop ou sélection de fichiers.
- **Gestion du texte :**
  - Ajout de multiples calques de texte.
  - **Nouveau :** Alignement du texte (Gauche, Centre, Droite).
  - Personnalisation complète : Police, Taille, Gras, Italique, Couleur.
- **Transformation :** Redimensionnement, Rotation et Déplacement intuitif des éléments.
- **Export :** Génération instantanée de l'image finale en PNG.

### 🖼️ Galerie Interactive
- **Navigation fluide :** Pagination intégrée pour gérer de grands volumes de données.
- **Recherche & Filtres :** Recherche en temps réel par titre et tri par date (Récent/Ancien).
- **Actions Rapides :** Téléchargement direct, Partage (Lien/Natif mobile), Réutilisation d'un mème existant comme template.
- **Sécurité :** Modale de confirmation pour la suppression.

### UX / UI Design
- **Responsive :** Interface adaptée aux mobiles et aux desktops.
- **Feedback utilisateur :** Système de notifications (Toasts) pour les succès et erreurs.
- **Design System :** Utilisation de TailwindCSS pour une cohérence visuelle.

## 🛠 Stack Technique

Ce projet utilise une architecture moderne basée sur **Vite**.

| Catégorie | Technologie | Usage |
|-----------|------------|-------|
| **Core** | React 18 | Bibliothèque UI principale |
| **Build Tool** | Vite | Compilation ultra-rapide et HMR |
| **Langage** | JavaScript (ES6+) | Logique applicative |
| **Styles** | Tailwind CSS | Framework CSS utilitaire |
| **Graphisme** | Konva / React-Konva | Gestion du Canvas HTML5 (2D) |
| **Routage** | React Router DOM | Navigation SPA (Single Page Application) |
| **HTTP** | Axios | Communication avec l'API Backend |
| **Icônes** | Lucide React | Bibliothèque d'icônes légère |

## uq Architecture du Projet

La structure suit les bonnes pratiques React pour la scalabilité.

```text
src/
├── components/       # Composants réutilisables (UI bricks)
│   ├── MemeCard.jsx      # Carte d'affichage d'un mème
│   ├── Modal.jsx         # Wrapper générique pour les modales
│   ├── Pagination.jsx    # Contrôles de navigation
│   ├── Toast.jsx         # Notifications éphémères
│   └── ...
├── pages/            # Composants de haut niveau (Vues/Routes)
│   ├── Create.jsx        # Logique de l'éditeur (Canvas + Toolbar)
│   └── Gallery.jsx       # Grille d'affichage et filtrage
├── services/         # Logique métier et appels API
│   └── api.js            # Configuration Axios et endpoints
├── App.jsx           # Layout principal et Routing
└── main.tsx          # Point d'entrée