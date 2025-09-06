# Guide de déploiement Firebase

## Configuration actuelle

✅ **Firebase** : Configuré et prêt
✅ **Angular** : Version 19 avec SSR
✅ **Build** : Optimisé pour Firebase Hosting

## Étapes de déploiement

### 1. Préparation

```bash
# Installer les dépendances
npm install

# Tester le build local
npm run build
```

### 2. Déploiement sur Firebase Hosting

#### Via CLI Firebase

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Construire l'application
npm run build

# Déployer
firebase deploy --only hosting
```

### 3. Configuration Firebase

#### Firebase Functions (pour l'API)

```bash
# Initialiser Functions
firebase init functions

# Déployer les fonctions
firebase deploy --only functions
```

#### Firebase Firestore (base de données)

```bash
# Déployer les règles Firestore
firebase deploy --only firestore

# Déployer les règles Storage
firebase deploy --only storage
```

## Structure du projet

```
src/
├── app/
│   ├── core/           # Services et composants partagés
│   ├── features/       # Modules fonctionnels
│   └── environments/   # Configuration par environnement
├── environments/       # Variables d'environnement
└── assets/            # Ressources statiques
```

## URLs de déploiement

- **Firebase Hosting** : `https://thelastcoders-a40c9.web.app`
- **Console Firebase** : `https://console.firebase.google.com/project/thelastcoders-a40c9/overview`

## Monitoring

- **Firebase Analytics** : Activé automatiquement
- **Performance** : Monitoring via Firebase
- **Logs** : Logs d'erreur et de debug dans la console Firebase

## Support

Pour toute question sur le déploiement, consultez :

- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Angular](https://angular.dev)
