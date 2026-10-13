const { spawn } = require('child_process');
const { screen } = require('electron');

class MouseTracker {
  constructor() {
    this.proc = null;
    this.lastRightClick = { x: null, y: null, time: 0 };
    this.lastLeftClick = { x: null, y: null, time: 0 };
    this.lastMove = { x: null, y: null, time: 0 };
  }

  start() {
    this.stop();

    const path = require('path');
    const scriptPath = path.join(__dirname, 'tracker.ps1');

    try {
      this.proc = spawn('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy', 'Bypass',
        '-WindowStyle', 'Hidden',
        '-File', scriptPath
      ], {
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true
      });

      this.proc.stdout.on('data', (chunk) => {
        const lines = chunk.toString().split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          const [action, coords] = trimmed.split(':');
          if (!coords) continue;
          const [rawX, rawY] = coords.split(',').map(Number);
          if (isNaN(rawX) || isNaN(rawY)) continue;

          // Convert physical pixels from Win32 to DIP (device-independent pixels) for Electron
          const primaryDisplay = screen.getPrimaryDisplay();
          const scale = primaryDisplay ? (primaryDisplay.scaleFactor || 1) : 1;
          const dipX = Math.round(rawX / scale);
          const dipY = Math.round(rawY / scale);

          if (action === 'RCLICK') {
            this.lastRightClick = { x: dipX, y: dipY, time: Date.now() };
            console.log(`[MouseTracker] Captured Right-Click at (${dipX}, ${dipY})`);
          } else if (action === 'LCLICK') {
            this.lastLeftClick = { x: dipX, y: dipY, time: Date.now() };
          } else if (action === 'POS') {
            this.lastMove = { x: dipX, y: dipY, time: Date.now() };
          }
        }
      });

      this.proc.on('error', (err) => {
        console.warn('[MouseTracker] Process error:', err.message);
      });
    } catch (err) {
      console.warn('[MouseTracker] Failed to start:', err.message);
    }
  }

  /**
   * Resolve the exact screen coordinates where the deleted file was located
   */
  getTargetFilePoint() {
    const now = Date.now();

    // 1. If the user right-clicked within the last 10 seconds (Right-Click -> Delete in context menu),
    // the file was at the Right-Click coordinate!
    if (typeof this.lastRightClick.x === 'number' && (now - this.lastRightClick.time) < 10000) {
      return {
        x: this.lastRightClick.x,
        y: this.lastRightClick.y,
        source: 'right-click'
      };
    }

    // 2. If the user left-clicked to select the file and pressed Delete on keyboard within 15 seconds
    if (typeof this.lastLeftClick.x === 'number' && (now - this.lastLeftClick.time) < 15000) {
      return {
        x: this.lastLeftClick.x,
        y: this.lastLeftClick.y,
        source: 'left-click'
      };
    }

    // 3. Last recorded physical mouse position from Win32 GetCursorPos
    if (typeof this.lastMove.x === 'number') {
      return {
        x: this.lastMove.x,
        y: this.lastMove.y,
        source: 'win32-cursor'
      };
    }

    // 4. Fallback to electron cursor point if valid
    try {
      const pt = screen.getCursorScreenPoint();
      if (pt && pt.x >= 0 && pt.x < 10000 && pt.y >= 0 && pt.y < 10000) {
        return {
          x: pt.x,
          y: pt.y,
          source: 'electron-cursor'
        };
      }
    } catch {}

    // 5. Ultimate fallback: Center of primary display
    const display = screen.getPrimaryDisplay();
    const wa = display ? display.workArea : { x: 0, y: 0, width: 1920, height: 1080 };
    return {
      x: wa.x + Math.round(wa.width / 2),
      y: wa.y + Math.round(wa.height / 2),
      source: 'screen-center'
    };
  }

  stop() {
    if (this.proc) {
      try {
        this.proc.kill();
      } catch {}
      this.proc = null;
    }
  }
}

module.exports = { MouseTracker };
