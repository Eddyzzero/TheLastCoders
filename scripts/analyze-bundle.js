const fs = require("fs");
const path = require("path");

function analyzeBundle() {
  const distPath = path.join(__dirname, "../dist/the-last-coders/browser");

  if (!fs.existsSync(distPath)) {
    console.log(
      "❌ Dossier dist introuvable. Exécutez d'abord: npm run vercel-build"
    );
    return;
  }

  console.log("📊 Analyse du bundle Angular...\n");

  // Analyser les fichiers JS
  const jsFiles = fs
    .readdirSync(distPath)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
      };
    })
    .sort((a, b) => b.size - a.size);

  // Analyser les fichiers CSS
  const cssFiles = fs
    .readdirSync(distPath)
    .filter((file) => file.endsWith(".css"))
    .map((file) => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log("📦 Fichiers JavaScript:");
  jsFiles.forEach((file) => {
    console.log(`  ${file.name}: ${file.sizeKB} KB`);
  });

  console.log("\n🎨 Fichiers CSS:");
  cssFiles.forEach((file) => {
    console.log(`  ${file.name}: ${file.sizeKB} KB`);
  });

  const totalJS = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCSS = cssFiles.reduce((sum, file) => sum + file.size, 0);
  const total = totalJS + totalCSS;

  console.log(`\n📈 Totaux:`);
  console.log(`  JavaScript: ${(totalJS / 1024).toFixed(2)} KB`);
  console.log(`  CSS: ${(totalCSS / 1024).toFixed(2)} KB`);
  console.log(`  Total: ${(total / 1024).toFixed(2)} KB`);

  // Recommandations
  console.log("\n💡 Recommandations:");
  if (totalJS > 1024 * 1024) {
    // > 1MB
    console.log("  ⚠️  Bundle JS trop volumineux. Considérez le lazy loading.");
  }
  if (totalCSS > 100 * 1024) {
    // > 100KB
    console.log(
      "  ⚠️  CSS trop volumineux. Vérifiez l'utilisation de Tailwind."
    );
  }
  if (total < 500 * 1024) {
    // < 500KB
    console.log("  ✅ Bundle optimisé !");
  }
}

analyzeBundle();
