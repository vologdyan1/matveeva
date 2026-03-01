# Превью для карусели: 480x360 WebP, quality 88.
# Запуск из корня проекта:  python scripts/generate-carousel-thumbs.py
# Нужен Pillow:  pip install Pillow

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "carousel-thumbs"
OUT_DIR.mkdir(parents=True, exist_ok=True)
THUMB_SIZE = (480, 360)
WEBP_QUALITY = 88

SOURCES = [
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
]

try:
    from PIL import Image
except ImportError:
    print("Установите Pillow:  pip install Pillow")
    raise SystemExit(1)

for i, rel in enumerate(SOURCES):
    src = ROOT / rel
    out_name = f"{i:02d}.webp"
    out_path = OUT_DIR / out_name
    if not src.exists():
        print("Пропуск (нет файла):", rel)
        continue
    try:
        img = Image.open(src)
        if img.mode == "P":
            img = img.convert("RGBA")
        img.thumbnail(THUMB_SIZE, Image.Resampling.LANCZOS)
        img.save(out_path, "WEBP", quality=WEBP_QUALITY)
        print(out_name, "<-", rel)
    except Exception as e:
        print("Ошибка", rel, e)
print("Готово:", OUT_DIR)
