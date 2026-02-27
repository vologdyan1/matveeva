# Добавляет origin и пушит в GitHub. Запуск: .\push-to-github.ps1
# С параметрами: .\push-to-github.ps1 -User LOGIN -Repo REPO_NAME
param(
  [string]$User = $env:GITHUB_USER,
  [string]$Repo = $env:GITHUB_REPO
)

if (-not $User) { $User = Read-Host "GitHub username (логин)" }
if (-not $Repo) { $Repo = Read-Host "Repository name (имя репо, например matveeva-design)" }

$url = "https://github.com/$User/$Repo.git"
Write-Host "Remote: $url" -ForegroundColor Cyan

git remote remove origin 2>$null
git remote add origin $url
git push -u origin main

if ($LASTEXITCODE -eq 0) { Write-Host "Done. Repo: https://github.com/$User/$Repo" -ForegroundColor Green }
