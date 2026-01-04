Write-Host "[ci] Windows system detected. Proceeding with CI steps."

if (-not (Get-Command d2 -ErrorAction SilentlyContinue)) {
    Write-Host "[ci] D2 was not detected on the system."

    if (-not (Get-Command d2 -ErrorAction SilentlyContinue)) {
    Write-Error "[ci] D2 was not detected on the system. Aborting CI."
        exit 1
    }

    Write-Host "[ci] Installing D2 via Chocolatey..."
    choco install d2 -y
}

Write-Host "[ci] D2 installed."
d2 --version