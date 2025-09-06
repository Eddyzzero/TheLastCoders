# Guide de développement - TheLastCoders

## 🏗️ Architecture du projet

### Structure des modules

Le projet suit une architecture modulaire basée sur les fonctionnalités :

```
src/app/
├── core/                    # Services et composants partagés
│   ├── components/          # Composants réutilisables
│   ├── guards/              # Guards de routage
│   └── services/            # Services métier
├── features/                # Modules fonctionnels
│   ├── auth/                # Authentification
│   ├── home/                # Page d'accueil
│   ├── admin/               # Administration
│   └── users/               # Gestion des utilisateurs
└── environments/            # Configurations d'environnement
```

### Conventions de nommage

- **Composants** : `kebab-case` (ex: `nav-bar.component.ts`)
- **Services** : `camelCase` avec suffixe `.service.ts`
- **Interfaces** : `PascalCase` avec suffixe `.interface.ts`
- **Guards** : `camelCase` avec suffixe `.guard.ts`

## 🔧 Services principaux

### AuthService

Gère l'authentification Firebase :

```typescript
// Injection
private authService = inject(AuthService);

// Utilisation
this.authService.login(email, password)
this.authService.register(email, userName, password)
this.authService.logOut()
```

### FirestoreService

Service générique pour les opérations CRUD :

```typescript
// Injection
private firestoreService = inject(FirestoreService<DataType>);

// Utilisation
await this.firestoreService.createDocument('collection/docId', data)
await this.firestoreService.getDocument('collection/docId')
await this.firestoreService.updateDocument('collection/docId', data)
await this.firestoreService.deleteDocument('collection/docId')
```

### LinksService

Gestion spécifique des liens :

```typescript
// Injection
private linksService = inject(LinksService);

// Utilisation
this.linksService.addLink(linkData)
this.linksService.getFilteredLinks(filters)
this.linksService.rateLink(linkId, rating)
```

## 🛡️ Guards de routage

### authGuard

Protège les routes nécessitant une authentification :

```typescript
{
  path: 'protected-route',
  component: ProtectedComponent,
  canActivate: [authGuard]
}
```

### authRedirectGuard

Redirige les utilisateurs connectés :

```typescript
{
  path: 'login',
  component: LoginComponent,
  canActivate: [authRedirectGuard]
}
```

## 📱 Composants réutilisables

### NavBarComponent

Barre de navigation principale avec :

- Menu responsive
- Gestion de l'état d'authentification
- Navigation conditionnelle

### NotificationComponent

Système de notifications avec :

- Types : success, error, info, warning
- Auto-dismiss configurable
- Positionnement flexible

## 🎨 Styling et UI

### Tailwind CSS

Le projet utilise Tailwind CSS pour le styling :

```html
<div class="bg-blue-500 text-white p-4 rounded-lg">Contenu stylé</div>
```

### Angular Material

Composants UI Material Design :

```typescript
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
```

## 🔄 Gestion d'état

### Signals (Angular 19)

Utilisation des signals pour l'état réactif :

```typescript
// Déclaration
private dataSignal = signal<DataType[]>([]);

// Lecture
const data = this.dataSignal();

// Mise à jour
this.dataSignal.set(newData);
```

### Observables RxJS

Pour les opérations asynchrones :

```typescript
// Déclaration
private data$ = this.service.getData();

// Utilisation dans le template
<div *ngFor="let item of data$ | async">
  {{ item.name }}
</div>
```

## 🧪 Tests

### Tests unitaires

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

### Tests e2e

```bash
# Lancer les tests e2e
npm run e2e

# Tests e2e en mode headless
npm run e2e:headless
```

## 🚀 Déploiement

### Build de production

```bash
# Build standard
npm run build

# Build avec analyse
npm run build:analyze

# Build pour staging
npm run build:staging
```

### Déploiement Firebase

```bash
# Déploiement complet
firebase deploy

# Déploiement hosting uniquement
firebase deploy --only hosting

# Déploiement functions uniquement
firebase deploy --only functions
```

## 🔍 Debugging

### Outils de développement

- **Angular DevTools** : Extension Chrome
- **Firebase Emulator** : Tests locaux
- **Lighthouse** : Audit de performance

### Logs et monitoring

```typescript
// Service de logging
private logger = inject(LoggerService);

// Utilisation
this.logger.log('Message de debug', data);
this.logger.error('Erreur', error);
```

## 📝 Bonnes pratiques

### Code

- Utiliser TypeScript strict
- Documenter les fonctions complexes
- Suivre les conventions Angular
- Tester les nouvelles fonctionnalités

### Performance

- Lazy loading des modules
- OnPush change detection
- Optimisation des images
- Bundle splitting

### Sécurité

- Validation des données
- Sanitisation des inputs
- Règles Firestore strictes
- HTTPS obligatoire

## 🐛 Résolution de problèmes

### Erreurs courantes

1. **Module not found**

   ```bash
   # Vérifier les imports
   npm install
   ng build
   ```

2. **Firebase configuration**

   ```typescript
   // Vérifier environment.ts
   export const environment = {
     firebase: {
       /* config */
     },
   };
   ```

3. **Build errors**
   ```bash
   # Nettoyer et rebuilder
   rm -rf dist/
   npm run build
   ```

### Support

- Consulter la documentation Angular
- Vérifier les issues GitHub
- Contacter l'équipe de développement
