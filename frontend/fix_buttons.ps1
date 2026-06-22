# Fix primary action buttons — remove boxShadow, standardize hover to background color change only
$files = @(
  'src\pages\StudySessionPage.jsx',
  'src\pages\StudyPlannerPage.jsx',
  'src\pages\SmartRevisionPage.jsx',
  'src\pages\MockTestResultsPage.jsx',
  'src\pages\MockTestPage.jsx'
)

# Pattern replacements: [search, replace]
# StudySessionPage - Start Session button has boxShadow: '0 0 24px rgba(124,58,237,0.35)'
foreach ($file in $files) {
  $path = Join-Path (Get-Location) $file
  $content = [System.IO.File]::ReadAllText($path)
  $orig = $content

  # Remove boxShadow from solid purple (#7C3AED) buttons inline styles
  # Also fix hover to change background instead of shadow

  # 1. StudySessionPage - "Start Session" button: remove boxShadow inline
  $content = $content.Replace(
    "boxShadow: '0 0 24px rgba(124,58,237,0.35)', transition: 'all 0.15s'",
    "transition: 'all 0.15s'"
  )

  # 2. StudyPlannerPage - "Update Plan" button: remove boxShadow
  $content = $content.Replace(
    "cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.2)'",
    "cursor: 'pointer'"
  )

  # 3. SmartRevisionPage - "Start New Revision" button: remove boxShadow + fix hover
  $content = $content.Replace(
    "gap: 8, boxShadow: '0 8px 24px rgba(124,58,237,0.3)'",
    "gap: 8"
  )

  # 4. SmartRevisionPage - "Begin Revision" button: remove boxShadow
  $content = $content.Replace(
    "fontSize: 18, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.3)'",
    "fontSize: 18, border: 'none', cursor: 'pointer'"
  )

  # 5. MockTestResultsPage - "Retake Test" button: remove boxShadow
  $content = $content.Replace(
    "cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.3)'",
    "cursor: 'pointer'"
  )

  # 6. MockTestPage - "Start Test" button: remove boxShadow + fix hover handlers
  $content = $content.Replace(
    "cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 8px 32px rgba(124,58,237,0.3)', transition: 'box-shadow 0.2s'",
    "cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'background 0.2s'"
  )

  if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated: $file"
  } else {
    Write-Host "No change: $file"
  }
}
Write-Host "Done."
