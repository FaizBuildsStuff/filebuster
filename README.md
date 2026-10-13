# File Buster 🎯💥

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6?logo=windows)](https://www.microsoft.com/windows)
[![Framework](https://img.shields.io/badge/Framework-Electron.js-47848F?logo=electron)](https://www.electronjs.org/)
[![Runtime](https://img.shields.io/badge/Runtime-Node.js%20v18+-339933?logo=node.js)](https://nodejs.org/)
[![UI Style](https://img.shields.io/badge/Design-Modern%20Minimalist%20Glassmorphism-purple)](#)
[![Art Style](https://img.shields.io/badge/Art-Realistic%202D%20Cartoon%20VFX-ff5722)](#)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

> **File Buster** is a Windows-exclusive desktop utility that gamifies file deletion into an explosive, realistic 2D cartoon spectacle. Running silently in the background, it pops up right at the exact pixel of the deleted file, aims a stylized cell-shaded revolver point-blank, and obliterates the file with a comic explosion, muzzle blast, and themed paper shards!

---

## 📸 Visual Showcase & Architecture

```
  [ Windows Explorer / Desktop ]
                │
                ├─► Right-Click: "Bust with File Buster 💥"
                │       │
                │       ▼ (IPC Socket: 127.0.0.1:34982)
                │   [ Transparent Click-Through Overlay ]
                │       ├─► Modern Glassmorphic Card (Terrified Comic Eyes)
                │       ├─► Realistic 2D Revolver (Aims Point-Blank)
                │       ├─► 650ms: BANG! Muzzle Flash + Authoritative Deletion
                │       └─► POW! BANG! Blast + Themed Confetti Particles
                │
                └─► Standard Del Key / Recycle Bin
                        │
                        ▼ (0ms Chokidar Watcher)
                    [ Pinpoint Coordinate Popup & Destroy ]
```

---

## ✨ Key Features

### 🎨 Modern Minimalist Glassmorphic UI/UX
- **Frosted Squircle Cards:** Replaced outdated flat sheets with dark glassmorphic cards (`backdrop-filter: blur(20px)`), subtle borders, and folded corner accents.
- **Dynamic File Aura:** Dynamic ambient aura (`--theme-glow`) tailored to the file type.
- **Comic Expression:** Terrified cartoon eyes with animated pupils that nervously track the gun barrel, accompanied by a trembling sweat drop.
- **Clean File Pill:** High-contrast file extension tag with a frosted filename pill badge.

### 📁 Dynamic File Type Theme Engine (`icons.js`)
File Buster automatically classifies extensions into **10+ distinct themes** with custom vector icons, dual-color gradients, and matching particle explosion shards:

| File Type | Extensions | Theme Gradient & Glow | Vector Icon & Theme Shards |
| :--- | :--- | :--- | :--- |
| **PDF** | `.pdf` | Crimson Red (`#ff3b5c` → `#c0082b`) | Folded PDF Sheet + Crimson Shards |
| **Sheets / Excel** | `.xlsx`, `.xls`, `.csv` | Emerald Green (`#10b981` → `#047857`) | Grid Spreadsheet + Emerald Shards |
| **Documents** | `.docx`, `.doc`, `.txt`, `.md` | Sapphire Blue (`#3b82f6` → `#1d4ed8`) | Text Document + Sapphire Shards |
| **Source Code** | `.js`, `.ts`, `.py`, `.html`, `.cpp` | Electric Cyan (`#06b6d4` → `#0284c7`) | `< / >` Brackets + Cyan Sparks |
| **Images** | `.png`, `.jpg`, `.jpeg`, `.webp` | Vivid Violet (`#8b5cf6` → `#6d28d9`) | Photo Frame + Violet Shards |
| **Videos** | `.mp4`, `.mkv`, `.avi`, `.mov` | Rose Pink (`#f43f5e` → `#be123c`) | Movie Slate + Rose Shards |
| **Audio** | `.mp3`, `.wav`, `.flac`, `.aac` | Magenta Pink (`#ec4899` → `#a855f7`) | Double Music Note + Magenta Shards |
| **Archives** | `.zip`, `.rar`, `.7z`, `.tar` | Amber Gold (`#f59e0b` → `#d97706`) | Zipper Box + Amber Shards |
| **Executables** | `.exe`, `.msi`, `.bat` | Orange Flame (`#f97316` → `#ea580c`) | Lightning Spark + Electric Shards |
| **Folders** | Windows Directories | Warm Ochre (`#f59e0b` → `#b45309`) | Tabbed Folder + Wooden Shards |

### 🔫 Realistic 2D Stylized Game Assets
- **Revolver (`cartoon_gun.png`):** Heavy metallic barrel with realistic reflections, polished walnut wood grain grip, brass rivets, and crisp comic ink outlines.
- **Shoot & Muzzle Blast (`muzzle_smoke.png`):** Fiery starburst core erupting into jet flames and curling cartoon smoke rings right at the barrel tip.
- **Explosion & Blast (`comic_explosion.png`):** Centered comic fireball with billowing cell-shaded smoke clouds, shockwave spikes, and fiery flying embers.
- **Physics Canvas (`particles.js`):** 2D cartoon smoke puffs rendered with realistic radial gradient cores and comic outlines.

### 🌟 Dual Operating Modes

#### Mode 1: Windows Explorer Context Menu (Recommended)
1. **Right-Click** any file or folder anywhere in Windows Explorer or Desktop.
2. Select **"Bust with File Buster 💥"**.
3. **The file stays visible on your screen** while the glassmorphic card pops in and shivers with fear.
4. The revolver pops out point-blank, cocks back, and at the exact **650ms BANG!**, the file is authoritatively deleted from disk while exploding into fragments!

#### Mode 2: Standard Windows Delete / Del Key
- Pressing `Delete` or `Shift+Delete` on files in watched folders (Desktop, Downloads) triggers an **immediate 0ms reaction** right at the file's screen coordinates.

### 🧠 Smart Multi-Display & Screen Clamping
- **Edge-Smart Mirroring:** If a file is located along the left edge of your screen (standard Windows desktop icons), the gun automatically mirrors (`.from-right`) and appears from the right side so it never clips off-screen.
- **Multi-Monitor DPI Clamping:** Automatically detects which display the cursor is on and clamps overlay bounds to the active display's work area.

### 👻 100% Silent & Zero CPU Idle
- **System Tray Resident:** Hidden from the taskbar (`skipTaskbar: true`), runs silently in the system tray.
- **Transparent Click-Through:** Uses `setIgnoreMouseEvents(true, { forward: true })` so idle clicks pass straight through to Windows.
- **Zero Idle Usage:** The animation loop halts completely when inactive, consuming 0.0% CPU and GPU.

---

## 🚀 Getting Started

### Prerequisites
- **OS:** Windows 10 or Windows 11 (64-bit)
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/filebuster.git
cd filebuster

# 2. Install dependencies
npm install

# 3. Register the Windows Context Menu entry
npm run register-menu

# 4. Start File Buster
npm start
```

---

## 🎮 Live Testing & Preview Suite

You don't need to delete your own files to experience File Buster:

1. Look for the **File Buster icon** in your Windows System Tray (near the clock).
2. Right-click the tray icon to open the menu:
   - **💥 Quick Test Bust:** Runs an instant test bust at your cursor.
   - **🎨 Test File Type Themes:** Select any preset (PDF, Excel, Word, Code, Image, Video, Audio, Archive, Exe, Folder) to preview its custom glassmorphic card, vector icon, gradient aura, and themed particle explosion!

---

## 📁 Project Structure

```
filebuster/
├── assets/
│   └── images/
│       ├── cartoon_gun.png         # Stylized 2D cell-shaded revolver
│       ├── muzzle_smoke.png        # Shot muzzle flash and smoke plume sprite
│       ├── comic_explosion.png     # Comic fireball and blast sprite
│       └── cartoon_doc.png         # Legacy fallback document asset
├── src/
│   ├── main/
│   │   ├── index.js                # App lifecycle, single-instance lock, bust orchestrator
│   │   ├── window.js               # Transparent click-through overlay window manager
│   │   ├── watcher.js              # Chokidar zero-latency file deletion monitor
│   │   ├── mouse-tracker.js        # Win32 cursor and right-click coordinate tracker
│   │   ├── tracker.ps1             # Standalone Win32 GetCursorPos hook
│   │   ├── ipc-pipe.js             # Local TCP socket server (127.0.0.1:34982)
│   │   ├── context-menu.js         # Windows HKCU registry integration via reg.exe
│   │   ├── nuke.js                 # Safe authoritative file/directory removal
│   │   ├── tray.js                 # System tray icon with theme preview submenu
│   │   ├── config.js               # User settings and watched directory config
│   │   └── icon-helper.js          # Native Windows shell icon extractor
│   ├── preload/
│   │   └── preload.js              # Secure contextBridge API exposing safe IPC
│   └── renderer/
│       ├── index.html              # Overlay DOM: card, eyes, gun, flash, explosion, canvas
│       ├── style.css               # Glassmorphic card styling, keyframes, transitions
│       ├── app.js                  # Choreographed animation timeline orchestrator
│       ├── icons.js                # Modern minimalist file theme & vector SVG engine
│       └── particles.js            # High-performance 2D canvas particle physics
├── CONTEXT.md                      # Comprehensive technical architecture & design reference
├── package.json
└── README.md
```

---

## 🛠️ Configuration

Custom settings are stored locally in `%APPDATA%/filebuster/config.json`:

```json
{
  "watchedPaths": [
    "C:\\Users\\<Username>\\Desktop",
    "C:\\Users\\<Username>\\Downloads"
  ],
  "animationDuration": 2050,
  "deleteDelayMs": 650
}
```

---

## 📜 License

MIT License. Designed with ❤️ for desktop enthusiasts who want to make file deletion exciting!
