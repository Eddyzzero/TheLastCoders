#!/bin/bash

echo "🚀 Déploiement de TheLastCoders sur Vercel"
echo "=========================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json introuvable. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de production
echo "🔨 Build de production..."
npm run vercel-build

# Vérifier que le build a réussi
if [ ! -d "dist/the-last-coders/browser" ]; then
    echo "❌ Erreur: Le build a échoué. Vérifiez les erreurs ci-dessus."
    exit 1
fi

# Analyser le bundle
echo "📊 Analyse du bundle..."
npm run analyze-bundle

echo ""
echo "✅ Build terminé avec succès !"
echo ""
echo "🌐 Pour déployer sur Vercel :"
echo "1. Installez Vercel CLI : npm i -g vercel"
echo "2. Connectez-vous : vercel login"
echo "3. Déployez : vercel"
echo "4. Pour la production : vercel --prod"
echo ""
echo "🔥 Pour déployer sur Firebase :"
echo "1. Installez Firebase CLI : npm i -g firebase-tools"
echo "2. Connectez-vous : firebase login"
echo "3. Initialisez : firebase init"
echo "4. Déployez : firebase deploy"
echo ""
echo "📚 Consultez DEPLOYMENT.md pour plus de détails"
