/**
 * Генерирует для карусели:
 * 1) Превью 480×360 WebP — полоса карусели.
 * 2) Средний размер max 1200px WebP (quality 90) — для лайтбокса, быстрее полного PNG.
 *
 * Запуск: npm install && node scripts/generate-carousel-thumbs.js
 */

const fs = require("fs");
const path = require("path");

const CAROUSEL_SOURCES = [
  "assets/1 обмерный план.png",
  "assets/2 Схема демонтажа перегородок.png",
  "assets/2.1 Схема монтажа перегородок.png",
  "assets/3 План расстановки мебели.png",
  "assets/4 Схема сантехники.png",
  "assets/4.1 Схема сантехники.png",
  "assets/4.2 Сантех привязка кондиционеров.png",
  "assets/5 Схема потолков.png",
  "assets/6 Схема напольных покрытий.png",
  "assets/7 Схема светильников.png",
  "assets/8 Схема розеток.png",
  "assets/9 Ведомость светильников.png",
  "assets/10 Спецификация розеточных блоков.png",
  "assets/11 Схема отделки стен.png",
  "assets/12 Развертки по стенам коридора.png",
  "assets/12.1 Развертки стен коридора 2.png",
  "assets/13 Развертки по стенам кухни гостиной.png",
  "assets/13.1 Размервертки по стенам кухни гостиной 2.png",
  "assets/14 Развертки по стенам спальни.png",
  "assets/15 Развертки по стенам детской 1.png",
  "assets/15.1 Развертки по стенам детской 2.png",
  "assets/16 развертки по стенам душевой.png",
  "assets/16.1 Развертки по стенам ванной.png",
  "assets/17 Ведомость заполнения дверных проемов.png",
  "assets/18 Сводная ведомость отделки потолка и стен 1.png",
  "assets/18.1 Сводная ведомость отделки потолка и стен 2.png",
];

const THUMBS_DIR = "assets/carousel-thumbs";
const LIGHTBOX_DIR = "assets/carousel-lightbox";
const THUMB_WIDTH = 480;
const THUMB_HEIGHT = 360;
const LIGHTBOX_MAX = 1200;
const WEBP_QUALITY_THUMB = 88;
const WEBP_QUALITY_LIGHTBOX = 90;

const rootDir = path.resolve(__dirname, "..");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Установите sharp: npm install sharp");
    process.exit(1);
  }

  for (const dir of [THUMBS_DIR, LIGHTBOX_DIR]) {
    const full = path.join(rootDir, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  }

  for (let i = 0; i < CAROUSEL_SOURCES.length; i++) {
    const srcPath = path.join(rootDir, CAROUSEL_SOURCES[i]);
    const outName = String(i).padStart(2, "0") + ".webp";

    if (!fs.existsSync(srcPath)) {
      console.warn("Пропуск (файл не найден):", CAROUSEL_SOURCES[i]);
      continue;
    }

    try {
      await sharp(srcPath, { limitInputPixels: 0 })
        .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY_THUMB })
        .toFile(path.join(rootDir, THUMBS_DIR, outName));
      await sharp(srcPath, { limitInputPixels: 0 })
        .resize(LIGHTBOX_MAX, null, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY_LIGHTBOX })
        .toFile(path.join(rootDir, LIGHTBOX_DIR, outName));
      console.log(outName);
    } catch (err) {
      console.error("Ошибка", CAROUSEL_SOURCES[i], err.message);
    }
  }

  console.log("Готово:", THUMBS_DIR, "+", LIGHTBOX_DIR);
}

main();
