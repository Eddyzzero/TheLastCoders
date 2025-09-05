#!/bin/bash

# Script de build pour Vercel
echo "🔨 Building Angular application..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "angular.json" ]; then
    echo "❌ Erreur: angular.json introuvable. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installing dependencies..."
npm install

# Vérifier l'installation d'Angular CLI
echo "🔍 Checking Angular CLI..."
npx ng version

# Build de production
echo "🏗️ Building application..."
npx ng build --configuration production

echo "✅ Build completed!"
