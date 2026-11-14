param(
  [string]$ProjectName = "hello-world",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$coordinateFile = Join-Path $root "data\parking-coordinates.json"
$publicDataDir = Join-Path $root "public\data"
$publicCoordinateFile = Join-Path $publicDataDir "parking-coordinates.json"

if (Test-Path -LiteralPath $coordinateFile) {
  $payload = Get-Content -Raw -Encoding UTF8 $coordinateFile | ConvertFrom-Json
  if ($payload.count -ne 55 -or $payload.coordinates.Count -ne 55) {
    throw "Expected 55 reviewed parking coordinates; found $($payload.coordinates.Count). Refusing to deploy partial or unreviewed data."
  }

  New-Item -ItemType Directory -Path $publicDataDir -Force | Out-Null
  Copy-Item -LiteralPath $coordinateFile -Destination $publicCoordinateFile -Force
  Write-Output "Included reviewed coordinate asset: $publicCoordinateFile (55 records)."
} else {
  Write-Warning "No data/parking-coordinates.json found. The site will clearly mark unverified destinations; no coordinates will be invented."
  Remove-Item -LiteralPath $publicCoordinateFile -Force -ErrorAction SilentlyContinue
}

try {
  & wrangler pages deploy $root --project-name $ProjectName --branch $Branch
  if ($LASTEXITCODE -ne 0) { throw "Wrangler deploy failed with exit code $LASTEXITCODE" }
} finally {
  Remove-Item -LiteralPath $publicCoordinateFile -Force -ErrorAction SilentlyContinue
}