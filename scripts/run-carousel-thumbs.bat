@echo off
cd /d "%~dp0.."
echo Installing Pillow if needed...
pip install Pillow -q 2>nul
python scripts\generate-carousel-thumbs.py 2>nul || py scripts\generate-carousel-thumbs.py 2>nul || py -3 scripts\generate-carousel-thumbs.py
if errorlevel 1 (
  echo.
  echo Run manually from project root:
  echo   pip install Pillow
  echo   python scripts\generate-carousel-thumbs.py
  pause
)
