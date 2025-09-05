#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔨 Building Angular application for Vercel...");

// Afficher le répertoire de travail actuel
console.log("📁 Current working directory:", process.cwd());

// Lister les fichiers dans le répertoire actuel
console.log("📋 Files in current directory:");
try {
  const files = fs.readdirSync(process.cwd());
  console.log(files.slice(0, 10).join(", "), files.length > 10 ? "..." : "");
} catch (error) {
  console.error("❌ Error listing directory:", error.message);
}

// Vérifier que nous sommes dans le bon répertoire
if (!fs.existsSync("angular.json")) {
  console.error(
    "❌ Erreur: angular.json introuvable. Exécutez ce script depuis la racine du projet."
  );
  process.exit(1);
}

try {
  // Installer les dépendances
  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });

  // Vérifier Angular CLI
  console.log("🔍 Checking Angular CLI...");
  execSync("npx ng version", { stdio: "inherit" });

  // Build de production
  console.log("🏗️ Building application...");
  execSync("npx ng build --configuration production", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
