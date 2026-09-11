# 画面全体のスクリーンショットを PNG で保存する（Windows / PowerShell 5.1 以降）
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\shot.ps1 -Out screenshots\01.png
#
#   -Out     保存先（既定: screenshots\01.png）。親フォルダがなければ作る
#   -Delay   撮影前に待つ秒数（既定: 0）。ターミナルの写り込みを避けたいときに使う
#   -Primary 全モニタではなくプライマリモニタだけを撮る
param(
  [string]$Out = "screenshots\01.png",
  [int]$Delay = 0,
  [switch]$Primary
)

if ($Delay -gt 0) { Start-Sleep -Seconds $Delay }

Add-Type -AssemblyName System.Windows.Forms, System.Drawing

if ($Primary) {
  $r = [Windows.Forms.Screen]::PrimaryScreen.Bounds
} else {
  $r = [Windows.Forms.SystemInformation]::VirtualScreen
}

# 相対パスは PowerShell のカレントディレクトリ基準で絶対パスに直す（.NET 側の CWD と食い違うため）
$full = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Out)
$dir = Split-Path -Parent $full
if ($dir -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

$bmp = New-Object Drawing.Bitmap $r.Width, $r.Height
$g = [Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($r.Location, [Drawing.Point]::Empty, $r.Size)
$bmp.Save($full, [Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()

Write-Output "saved: $full ($($r.Width)x$($r.Height))"
