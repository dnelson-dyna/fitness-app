# Fix Git and Push to GitHub

# Abort any pending rebase
if (Test-Path .git\rebase-merge) {
    Remove-Item -Path .git\rebase-merge -Recurse -Force
}
if (Test-Path .git\rebase-apply) {
    Remove-Item -Path .git\rebase-apply -Recurse -Force
}

# Check status
Write-Host "Git Status:" -ForegroundColor Green
git status

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Green
git push -u origin main --force

Write-Host "`nDone!" -ForegroundColor Green
