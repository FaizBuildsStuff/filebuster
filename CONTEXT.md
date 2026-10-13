# File Buster — Technical Context & Architecture Documentation

## 1. Executive Summary

**File Buster** is a lightweight, Windows-exclusive desktop utility engineered with Electron.js and Node.js. It transforms the routine act of deleting files into an interactive, gamified 2D cartoon sequence. 

The application operates as a 100% silent background daemon with zero idle resource overhead. When triggered—either through the native Windows Explorer context menu or standard keyboard shortcuts—it anchors a transparent click-through overlay at the exact screen coordinates of the target file, animates a point-blank stylized comic revolver shooting the terrified file card, and detonates the file from disk precisely at the instant of the gunshot impact.

---

## 2. System Architecture

File Buster follows Electron's multi-process security and architectural model, divided into three distinct layers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Operating System (Windows 10 / 11)              │
└──────────────┬───────────────────────────────────────────────┬──────────────┘
               │                                               │
    [ Windows Context Menu ]                        [ Windows File System ]
      HKCU\Software\Classes\*\shell                   (Desktop & Downloads)
               │                                               │
               │ --bust <path>                                 │ unlink event
               ▼                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MAIN PROCESS (Node.js)                             │
│                                                                             │
│   ├── index.js              - App orchestrator & single instance manager    │
│   ├── ipc-pipe.js           - TCP loopback server (127.0.0.1:34982)         │
│   ├── mouse-tracker.js      - Win32 cursor hook runner (tracker.ps1)        │
│   ├── watcher.js            - Chokidar file deletion monitor (0ms latency)  │
│   ├── window.js             - Multi-display transparent overlay manager     │
│   ├── context-menu.js       - reg.exe HKCU shell registration               │
│   ├── nuke.js               - Safe recursive deletion engine                │
│   └── tray.js               - System tray manager with theme test suite     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                         Electron IPC / ContextBridge
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        PRELOAD SCRIPT (preload.js)                          │
│                                                                             │
│   - contextBridge.exposeInMainWorld('fileBuster', { ... })                  │
│   - Exposes safe, sanitized channels: onPlayCartoonBust, notifyBustFinished │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        RENDERER PROCESS (Chromium)                          │
│                                                                             │
│   ├── index.html            - DOM structure (Card, Eyes, Gun, Flash, Canvas)│
│   ├── style.css             - Glassmorphism, animations, dynamic CSS vars   │
│   ├── app.js                - Choreographed 2050ms animation timeline       │
│   ├── icons.js              - File type classifier, vector SVGs, gradients  │
│   └── particles.js          - 2D Canvas physics: smoke, sparks, shards      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Windows Native Integration Details

### 3.1 Registry Context Menu Integration (`context-menu.js`)
File Buster integrates natively into the Windows Explorer Right-Click menu without requiring administrative privileges by writing to `HKEY_CURRENT_USER`:

- **Registry Keys Registered:**
  - `HKCU\Software\Classes\*\shell\FileBuster` (All files)
  - `HKCU\Software\Classes\Directory\shell\FileBuster` (All folders)
- **Execution Command:**
  ```cmd
  "<PathToExecutable>" --bust "%1"
  ```
- **Implementation:** Executes Windows native `reg.exe add` and `reg.exe delete` commands silently through child processes, ensuring seamless setup and cleanup.

### 3.2 Inter-Process Communication Pipe (`ipc-pipe.js`)
When a user clicks "Bust with File Buster 💥" in Windows Explorer:
1. Windows spawns a new instance of the executable with the `--bust "<path>"` argument.
2. The new instance attempts a TCP connection to `127.0.0.1:34982`.
3. If the primary File Buster daemon is running, the arguments are written to the socket:
   ```json
   { "args": ["--bust", "C:\\Users\\mfaiz\\Desktop\\report.pdf"] }
   ```
4. The secondary process exits immediately (`process.exit(0)`), transferring execution to the main daemon in **< 15 milliseconds**.

### 3.3 Win32 Mouse Click & Coordinate Tracking (`mouse-tracker.js` & `tracker.ps1`)
Standard Electron APIs do not record global mouse clicks when an overlay is click-through (`setIgnoreMouseEvents(true)`). To anchor the animation at the exact screen coordinates where the file was clicked:
- A lightweight PowerShell background process (`tracker.ps1`) hooks into the Win32 API:
  - `user32.dll!GetCursorPos`
  - `user32.dll!GetAsyncKeyState(0x02)` (Right Mouse Button)
- Coordinates are captured in real time and normalized into DIP (Device Independent Pixels) to account for Windows DPI display scaling factors (100%, 125%, 150%, 200%).
- `window.js` sanitizes coordinates and clamps them to the active display bounds using Electron's `screen.getDisplayNearestPoint(pt)`.

### 3.4 File System Deletion Watcher (`watcher.js`)
- Monitors high-frequency file deletion paths (`Desktop`, `Downloads`) using `chokidar`.
- **Zero Artificial Latency:** Triggers immediately on `unlink` and `unlinkDir` events.
- **NTFS Junction Protection:** Configured with `depth: 1` and ignore filters for junction points (`My Music`, `My Videos`) to prevent Windows `EPERM` errors.

### 3.5 Authoritative File Deletion (`nuke.js`)
- Deletes files and directories authoritatively using Node's `fs.promises.rm(targetPath, { recursive: true, force: true })`.
- Handles both standard files and deeply nested directories.
- Gracefully handles missing files with non-blocking error logging.

---

## 4. Visual & UI/UX Design System

### 4.1 Modern Minimalist Glassmorphic Card
Replaced outdated paper textures with a modern glassmorphic card:
- **Card Geometry:** 88px × 108px squircle with an 18px border-radius.
- **Glassmorphic Material:** Dark translucent backdrop (`rgba(18, 20, 29, 0.94)`), 20px Gaussian blur (`backdrop-filter: blur(20px)`), and a subtle border (`rgba(255, 255, 255, 0.14)`).
- **Corner Fold Accent:** Geometric top-right folded paper triangle.
- **Dynamic Ambient Aura:** `--theme-glow` CSS variable radiates soft color-matched neon illumination around the card.
- **Gaze Tracking Comic Eyes:** Two circular cartoon eyes with pupils that dynamically shift left or right toward the incoming gun barrel (`transform: translate(±2px, 0)`), accompanied by a trembling sweat drop.

### 4.2 Dynamic File Type Classification Matrix (`icons.js`)
Every file extension is mapped to a tailored theme profile:

| Category | Extensions | Gradient (Start / End) | Glow RGBA | Shard Palette |
| :--- | :--- | :--- | :--- | :--- |
| **PDF** | `.pdf` | `#ff3b5c` / `#c0082b` | `rgba(255, 59, 92, 0.45)` | White, Light Pink, Rose, Crimson |
| **Sheet** | `.xlsx`, `.xls`, `.csv`, `.tsv` | `#10b981` / `#047857` | `rgba(16, 185, 129, 0.45)` | White, Mint, Emerald, Forest |
| **Doc** | `.docx`, `.doc`, `.txt`, `.rtf`, `.md` | `#3b82f6` / `#1d4ed8` | `rgba(59, 130, 246, 0.45)` | White, Sky, Sapphire, Deep Blue |
| **Code** | `.js`, `.ts`, `.py`, `.html`, `.css`, `.json`, `.cpp`, `.cs` | `#06b6d4` / `#0284c7` | `rgba(6, 182, 212, 0.45)` | White, Neon Cyan, Cyan, Ocean |
| **Image** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.bmp` | `#8b5cf6` / `#6d28d9` | `rgba(139, 92, 246, 0.45)` | White, Lavender, Purple, Deep Violet |
| **Video** | `.mp4`, `.mkv`, `.avi`, `.mov`, `.wmv`, `.webm` | `#f43f5e` / `#be123c` | `rgba(244, 63, 94, 0.45)` | White, Coral, Rose, Ruby |
| **Audio** | `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.m4a` | `#ec4899` / `#a855f7` | `rgba(236, 72, 153, 0.45)` | White, Pink, Magenta, Purple |
| **Archive**| `.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.bz2` | `#f59e0b` / `#d97706` | `rgba(245, 158, 11, 0.45)` | White, Amber, Gold, Dark Amber |
| **Exe** | `.exe`, `.msi`, `.bat`, `.cmd`, `.ps1` | `#f97316` / `#ea580c` | `rgba(249, 115, 22, 0.45)` | White, Orange, Flame, Dark Orange |
| **Folder** | Directory objects | `#f59e0b` / `#b45309` | `rgba(245, 158, 11, 0.45)` | White, Sand, Ochre, Brown |
| **Generic**| Any other unclassified extension | `#64748b` / `#334155` | `rgba(100, 116, 139, 0.45)` | White, Slate, Gray, Charcoal |

### 4.3 Realistic 2D Stylized Game Assets
- **`cartoon_gun.png` (1076 × 594):** Cell-shaded revolver with heavy steel barrel reflections, walnut grain handle, and brass rivets. Clean alpha silhouette with rightmost barrel tip positioned at `(99.9%, 13.6%)` and grip pivot at `(12.6%, 79.5%)`.
- **`muzzle_smoke.png` (1118 × 579):** High-definition muzzle blast sprite featuring an explosive fiery starburst and billowing comic smoke rings firing horizontally to the right.
- **`comic_explosion.png` (905 × 900):** Centered comic fireball burst with cell-shaded smoke lobes, starburst shockwave spikes, and fiery flying embers.

### 4.4 Particle Physics Engine (`particles.js`)
A hardware-accelerated HTML5 Canvas 2D particle simulation running at the display refresh rate:
- **Paper Shards (42 count):** Theme-colored rectangular fragments with angular rotation, gravity (`0.22`), drag (`0.95`), and dark comic outlines.
- **Glowing Sparks (42 count):** High-velocity embers with canvas shadow blur (`12px`) and alpha decay.
- **Cartoon Smoke (14 count):** Billowing circular puffs rendered with multi-tone radial gradients (light core to dark slate perimeter) and subtle strokes.
- **Lifecycle Optimization:** When particle count reaches 0, `cancelAnimationFrame` halts execution, returning canvas CPU consumption to **0.0%**.

---

## 5. Animation Timeline & Event Synchronization

The entire sequence executes over **2,050 milliseconds** with millisecond-accurate state transitions:

```
Timeline (ms)
  0ms ───────────────── Card pops in at cursor (pop-in, shivering)
  │                     Pupils shift toward gun position
  │
 180ms ──────────────── Revolver enters point-blank (-200px, -13px)
  │                     Aims directly at card face
  │
 480ms ──────────────── Gun hammer cocks back (-10px, -13deg)
  │
 650ms ──────────────── BANG! Gun violent recoil (-22px, -32deg)
  │                     Muzzle flash & smoke burst expand from barrel tip
  │                     Authoritative disk deletion executes (nukePath)
  │                     Card disintegrates into fragments
  │                     Comic POW! BANG! explosion slams over card
  │                     Canvas bursts themed paper shards, sparks, and smoke
  │                     Scene shakes violently (violent-cartoon-shake)
  │
1350ms ──────────────── Revolver twirls and retracts out of view
  │
1750ms ──────────────── Stage opacity smoothly fades out
  │
2050ms ──────────────── Window hides (hideOverlay), memory freed, loop idle
```

---

## 6. Race Conditions & Stability Safeguards

1. **Double Deletion Prevention (`recentlyBusted` Cache):**
   - When a file is destroyed via the Context Menu `--bust` pipeline, its canonical path is added to a `Set` for 5 seconds.
   - When Chokidar subsequently emits an `unlink` event for the file, the watcher detects the path in `recentlyBusted` and skips triggering a secondary redundant animation.
2. **Screen Clamping & Multi-Monitor Geometry:**
   - Overlay coordinates are mapped to the correct monitor using `screen.getDisplayNearestPoint(pt)`.
   - Bounding boxes are clamped within display work areas to prevent off-screen window clipping.
3. **Edge-Smart Mirroring (`.from-right`):**
   - If the file is within 250px of the screen's left edge (common for desktop shortcut grids), `#scene-anchor` adds the `.from-right` class.
   - `#gun-flipper` mirrors via `scaleX(-1)`, aiming from the right to ensure the pistol remains fully visible.
4. **Click-Through Transparency:**
   - Overlay window uses `win.setIgnoreMouseEvents(true, { forward: true })`.
   - Never intercepts user mouse events or interrupts active desktop workflows.
5. **Memory Leak Prevention:**
   - Overlay window is instantiated once and toggled via `showInactive()` and `hide()`.
   - Particle canvas state is fully cleared and detached from RAF loops when inactive.
