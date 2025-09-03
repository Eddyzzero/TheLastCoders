# TheLastCoders

TheLastCoders est une application web moderne développée avec Angular 19, permettant aux utilisateurs de partager et gérer des ressources d'apprentissage en programmation. L'application utilise Firebase pour l'authentification et le stockage des données, et intègre Tailwind CSS pour le style.

## 🚀 Fonctionnalités

- **Authentification Multi-méthodes**

  - Connexion par email/mot de passe
  - Connexion via Google
  - Système de gestion des rôles (reader, author, admin)

- **Gestion des Ressources**

  - Partage de liens et ressources
  - Système de notation (étoiles)
  - Commentaires sur les ressources
  - Filtrage et recherche avancée

- **Administration**

  - Gestion des utilisateurs
  - Contrôle des rôles
  - Modération du contenu

- **Interface Utilisateur**
  - Design responsive avec Tailwind CSS
  - Notifications en temps réel
  - Navigation intuitive

## 🛠️ Technologies Utilisées

- **Frontend**: Angular 19
- **Backend**: Firebase
- **Base de données**: Firestore
- **Authentification**: Firebase Auth
- **Styles**: Tailwind CSS
- **SSR**: Angular Universal

## 📋 Prérequis

- Node.js (version recommandée : 20.x ou supérieure)
- npm (version 10.x ou supérieure)
- Angular CLI (version 19.x)

## 🔧 Installation

1. Cloner le repository :

```bash
git clone https://github.com/Eddyzzero/TheLastCoders.git
cd TheLastCoders
```

2. Installer les dépendances :

```bash
npm install
```

3. Lancer l'application en mode développement :

```bash
npm start
```

4. Pour le style Tailwind (dans un terminal séparé) :

```bash
npm run tailwind
```

L'application sera accessible à l'adresse `http://localhost:4200/`

## 📦 Build Production

Pour créer une version de production :

```bash
npm run build
```

Pour démarrer le serveur SSR :

```bash
npm run serve:ssr:TheLastCoders
```

## 🏗️ Structure du Projet

```
src/
├── app/
│   ├── core/             # Services, guards et composants partagés
│   ├── features/         # Modules fonctionnels
│   │   ├── admin/       # Administration
│   │   ├── auth/        # Authentification
│   │   ├── home/        # Page d'accueil et gestion des liens
│   │   ├── users/       # Gestion des utilisateurs
│   │   └── policy/      # Politiques et conditions
│   └── shared/          # Composants et utilities partagés
├── assets/              # Images et ressources statiques
└── styles/             # Fichiers de style globaux
```

## 👥 Rôles Utilisateurs

- **Reader**: Peut consulter et commenter les ressources
- **Author**: Peut créer et gérer ses propres ressources
- **Admin**: A accès à toutes les fonctionnalités d'administration

## 🔐 Sécurité

- Authentification sécurisée via Firebase
- Protection des routes par rôles
- Validation des données côté client et serveur
- Gestion sécurisée des tokens

## ⚡ Performance

- Server-Side Rendering avec Angular Universal
- Lazy loading des modules
- Optimisation des images
- Mise en cache des ressources statiques

## 📱 Compatibilité

- Fonctionne sur tous les navigateurs modernes
- Design responsive pour mobile et desktop
- PWA ready

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Push sur la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT

## 🌟 Remerciements

- Équipe de développement
- Contributeurs
- Communauté Angular
- Firebase team
