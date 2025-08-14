# Système de Filtrage - TheLastCoders

## Vue d'ensemble

Le système de filtrage permet aux utilisateurs de filtrer les liens (cards) selon différents critères :

- **Niveau** : Junior, Médior, Senior
- **Langage** : HTML, CSS, JavaScript, Python, Git, Algorithme, C, Java, PHP, React, Angular, Vue.js, Node.js, TypeScript, SQL, MongoDB, Docker, Kubernetes, AWS, Azure
- **Prix** : Gratuit, Payant
- **Type** : Cours, Projet, Forum, Exercice, Tutoriel, Documentation, Vidéo, Podcast

## Fonctionnalités

### 1. Filtrage Multiple

- Les utilisateurs peuvent sélectionner plusieurs critères dans chaque catégorie
- Le système affiche uniquement les liens qui correspondent à TOUS les critères sélectionnés
- Si aucun critère n'est sélectionné dans une catégorie, tous les liens de cette catégorie sont inclus

### 2. Interface Utilisateur

- Panneau de filtres accessible via le bouton de recherche dans la barre de navigation
- Boutons toggle pour chaque option de filtre
- Boutons "Réinitialiser" et "Appliquer" pour gérer les filtres
- Message informatif quand aucun lien ne correspond aux critères

### 3. Logique de Filtrage

#### Niveau

- Filtre basé sur la propriété `niveau` du lien
- Correspondance exacte requise

#### Langage

- Filtre basé sur la propriété `tags` du lien
- Recherche insensible à la casse
- Correspondance partielle acceptée (ex: "JavaScript" correspond à "JS")

#### Prix

- Filtre basé sur la propriété `isPaid` du lien
- "Gratuit" = `isPaid: false`
- "Payant" = `isPaid: true`

#### Type

- Filtre basé sur la propriété `type` du lien
- Correspondance exacte requise

## Utilisation

### Pour l'utilisateur final

1. Cliquer sur le bouton de recherche (loupe) dans la barre de navigation
2. Sélectionner les critères souhaités dans chaque catégorie
3. Cliquer sur "Appliquer" pour voir les résultats filtrés
4. Utiliser "Réinitialiser" pour effacer tous les filtres

### Pour le développeur

1. Le composant `FilterPanelComponent` gère l'interface des filtres
2. Le composant `HomeComponent` reçoit les filtres via `(filterChange)="applyFilters($event)"`
3. La méthode `applyFilters()` filtre les liens et met à jour `filteredLinks`
4. Le template utilise `filteredLinks` pour afficher les résultats

## Structure des Données

### Interface Link

```typescript
interface Link {
  // ... autres propriétés
  niveau?: "Junior" | "Médior" | "Senior";
  tags?: string[];
  isPaid?: boolean;
  type?: "Cours" | "Projet" | "Forum" | "Exercice";
  // ... autres propriétés
}
```

### Interface Filters

```typescript
interface Filters {
  niveau: string[];
  langage: string[];
  prix: string[];
  type: string[];
}
```

## Messages d'Interface

### Aucun résultat trouvé

Quand aucun lien ne correspond aux critères sélectionnés :

- Message : "Aucun lien trouvé"
- Description : "Aucune carte ne correspond aux critères de filtrage sélectionnés."
- Bouton : "Réinitialiser les filtres"

## Tests

### Bouton de test (développement uniquement)

- Bouton bleu avec icône de bug dans le header
- Crée 3 liens de test avec des données variées
- Permet de tester le filtrage sans avoir de vrais liens dans la base de données

### Liens de test créés

1. **Apprendre JavaScript pour débutants**

   - Niveau: Junior, Langage: JavaScript, Prix: Gratuit, Type: Cours

2. **Projet React avancé**

   - Niveau: Senior, Langage: React, Prix: Payant, Type: Projet

3. **Forum Python communautaire**
   - Niveau: Médior, Langage: Python, Prix: Gratuit, Type: Forum

## Notes Techniques

- Le système utilise `ChangeDetectorRef.detectChanges()` pour forcer la détection des changements
- Les filtres sont appliqués en temps réel
- L'état des filtres est conservé dans `activeFilters`
- Le fond dynamique s'adapte aux liens filtrés
- Compatible avec le mode carrousel et grille

## Améliorations Futures

- Sauvegarder les préférences de filtrage dans le localStorage
- Ajouter des filtres par date de création
- Implémenter un système de recherche textuelle
- Ajouter des filtres par catégorie
- Permettre de sauvegarder des combinaisons de filtres personnalisées
