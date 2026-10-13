Add-Type -MemberDefinition @"
[DllImport("user32.dll")] public static extern short GetAsyncKeyState(int vKey);
[DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT lpPoint);
public struct POINT { public int X; public int Y; }
"@ -Name "Win32Mouse" -Namespace "FileBusterTracker"

$pt = New-Object FileBusterTracker.Win32Mouse+POINT
$wasL = $false
$wasR = $false
$lastX = -1
$lastY = -1

while ($true) {
  $l = ([FileBusterTracker.Win32Mouse]::GetAsyncKeyState(1) -band 0x8000) -ne 0
  $r = ([FileBusterTracker.Win32Mouse]::GetAsyncKeyState(2) -band 0x8000) -ne 0
  [FileBusterTracker.Win32Mouse]::GetCursorPos([ref]$pt) | Out-Null
  
  if ($r -and -not $wasR) {
    [Console]::Out.WriteLine("RCLICK:" + $pt.X + "," + $pt.Y)
    [Console]::Out.Flush()
  }
  if ($l -and -not $wasL) {
    [Console]::Out.WriteLine("LCLICK:" + $pt.X + "," + $pt.Y)
    [Console]::Out.Flush()
  }
  if ($pt.X -ne $lastX -or $pt.Y -ne $lastY) {
    $lastX = $pt.X
    $lastY = $pt.Y
    [Console]::Out.WriteLine("POS:" + $pt.X + "," + $pt.Y)
    [Console]::Out.Flush()
  }
  $wasL = $l
  $wasR = $r
  Start-Sleep -Milliseconds 25
}
