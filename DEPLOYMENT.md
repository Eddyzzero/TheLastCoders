# Guide de déploiement Vercel

## Configuration actuelle

✅ **Firebase** : Configuré et prêt
✅ **Angular** : Version 19 avec SSR
✅ **Build** : Optimisé pour Vercel

## Étapes de déploiement

### 1. Préparation

```bash
# Installer les dépendances
npm install

# Tester le build local
npm run vercel-build
```

### 2. Déploiement sur Vercel

#### Option A : Via l'interface Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Connecter votre compte GitHub
3. Importer le repository `TheLastCoders`
4. Vercel détectera automatiquement Angular
5. Les paramètres sont déjà configurés dans `vercel.json`

#### Option B : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Pour la production
vercel --prod
```

### 3. Variables d'environnement (si nécessaire)

Dans le dashboard Vercel, ajouter :

- `NODE_ENV=production`
- Variables Firebase (si vous voulez les externaliser)

### 4. Configuration Firebase

#### Firebase Hosting (optionnel)

Si vous voulez aussi utiliser Firebase Hosting :

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Initialiser
firebase init hosting

# Déployer
firebase deploy
```

#### Firebase Functions (pour l'API)

```bash
# Initialiser Functions
firebase init functions

# Déployer les fonctions
firebase deploy --only functions
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

- **Vercel** : `https://the-last-coders.vercel.app`
- **Firebase** : `https://thelastcoders-a40c9.web.app`

## Monitoring

- **Vercel Analytics** : Activé automatiquement
- **Firebase Analytics** : Configuré dans l'app
- **Performance** : Monitoring via Vercel et Firebase

## Support

Pour toute question sur le déploiement, consultez :

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Angular](https://angular.dev)
