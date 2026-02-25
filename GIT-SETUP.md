# Подключение к GitHub

В проекте уже есть `.gitignore` (node_modules и прочее не попадут в репо).

## 1. Установи Git

Скачай и установи с https://git-scm.com/download/win (оставь галочку "Add to PATH").

Перезапусти терминал/Cursor после установки.

## 2. Создай репозиторий на GitHub

- Зайди на https://github.com/new
- Название, например: `matveeva-design`
- **Не** добавляй README, .gitignore, License — создай пустой репозиторий
- Нажми Create repository

## 3. Выполни в терминале (в папке проекта)

Подставь вместо `USERNAME` и `REPO` свой логин GitHub и имя репозитория:

```powershell
cd "c:\Users\volog\Documents\firsttry"
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

При первом `git push` браузер откроется для входа в GitHub (или запросит логин/токен).
