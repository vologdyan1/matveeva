/**
 * Генерирует WebP-версии всех PNG в assets/projects/ (галереи project-01, project-02, project-03).
 * Запуск: node scripts/generate-projects-webp.js
 */

const fs = require("fs");
const path = require("path");

const WEBP_QUALITY = 88;
const rootDir = path.resolve(__dirname, "..");
const projectsDir = path.join(rootDir, "assets", "projects");

function* walkPngFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walkPngFiles(full);
    } else if (e.isFile() && /\.png$/i.test(e.name)) {
      yield full;
    }
  }
}

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Установите sharp: npm install sharp");
    process.exit(1);
  }

  let count = 0;
  for (const srcPath of walkPngFiles(projectsDir)) {
    const outPath = srcPath.replace(/\.png$/i, ".webp");
    if (outPath === srcPath) continue;
    try {
      await sharp(srcPath, { limitInputPixels: 0 })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
      console.log(path.relative(rootDir, outPath));
      count++;
    } catch (err) {
      console.error("Ошибка", path.relative(rootDir, srcPath), err.message);
    }
  }
  console.log("Готово. Создано WebP:", count);
}

main();
