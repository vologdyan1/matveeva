/**
 * Генерирует WebP-версии изображений лендинга (рядом с исходниками).
 * Запуск: node scripts/generate-landing-webp.js
 */

const fs = require("fs");
const path = require("path");

const LANDING_IMAGES = [
  "assets/service-01.png",
  "assets/service-02.png",
  "assets/service-03.png",
  "assets/service-04.png",
  "assets/project-01.png",
  "assets/project-02.png",
  "assets/project-03.png",
  "assets/designer.png",
  "assets/designer-02.png",
  "assets/projects/project-01/08.png", // hero фон
];

const WEBP_QUALITY = 88;
const rootDir = path.resolve(__dirname, "..");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Установите sharp: npm install sharp");
    process.exit(1);
  }

  for (const rel of LANDING_IMAGES) {
    const srcPath = path.join(rootDir, rel);
    if (!fs.existsSync(srcPath)) {
      console.warn("Пропуск (не найден):", rel);
      continue;
    }
    const outPath = srcPath.replace(/\.(png|jpe?g)$/i, ".webp");
    if (outPath === srcPath) continue;
    try {
      await sharp(srcPath, { limitInputPixels: 0 })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
      console.log(path.relative(rootDir, outPath));
    } catch (err) {
      console.error("Ошибка", rel, err.message);
    }
  }
  console.log("Готово.");
}

main();
