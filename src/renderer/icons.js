/**
 * Modern Minimalist File Icon System for File Buster
 * Maps extensions to clean vector icon glyphs, vibrant color gradients, and theme palettes.
 */

const FILE_THEMES = {
  pdf: {
    label: 'PDF',
    gradient: ['#ff3b5c', '#c0082b'],
    glow: 'rgba(255, 59, 92, 0.45)',
    shards: ['#ffffff', '#ff4d6d', '#ff758f', '#c0082b'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M9 13h1.5a1.5 1.5 0 0 0 0-3H9v6"/>
      <path d="M17 13a2 2 0 0 1-2 2h-1v-4h1a2 2 0 0 1 2 2z"/>
    </svg>`
  },
  sheet: {
    label: 'SHEET',
    gradient: ['#10b981', '#047857'],
    glow: 'rgba(16, 185, 129, 0.45)',
    shards: ['#ffffff', '#34d399', '#6ee7b7', '#059669'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
      <line x1="12" y1="11" x2="12" y2="19"/>
    </svg>`
  },
  doc: {
    label: 'DOC',
    gradient: ['#3b82f6', '#1d4ed8'],
    glow: 'rgba(59, 130, 246, 0.45)',
    shards: ['#ffffff', '#60a5fa', '#93c5fd', '#1d4ed8'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>`
  },
  image: {
    label: 'IMG',
    gradient: ['#8b5cf6', '#6d28d9'],
    glow: 'rgba(139, 92, 246, 0.45)',
    shards: ['#ffffff', '#a78bfa', '#c084fc', '#6d28d9'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>`
  },
  video: {
    label: 'VIDEO',
    gradient: ['#f43f5e', '#be123c'],
    glow: 'rgba(244, 63, 94, 0.45)',
    shards: ['#ffffff', '#fb7185', '#fda4af', '#be123c'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2.5"/>
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
    </svg>`
  },
  audio: {
    label: 'AUDIO',
    gradient: ['#ec4899', '#a855f7'],
    glow: 'rgba(236, 72, 153, 0.45)',
    shards: ['#ffffff', '#f472b6', '#c084fc', '#9333ea'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>`
  },
  code: {
    label: 'CODE',
    gradient: ['#06b6d4', '#0284c7'],
    glow: 'rgba(6, 182, 212, 0.45)',
    shards: ['#ffffff', '#22d3ee', '#67e8f9', '#0369a1'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="14" y1="4" x2="10" y2="20"/>
    </svg>`
  },
  archive: {
    label: 'ZIP',
    gradient: ['#f59e0b', '#d97706'],
    glow: 'rgba(245, 158, 11, 0.45)',
    shards: ['#ffffff', '#fbbf24', '#fcd34d', '#b45309'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>`
  },
  exe: {
    label: 'APP',
    gradient: ['#6366f1', '#4338ca'],
    glow: 'rgba(99, 102, 241, 0.45)',
    shards: ['#ffffff', '#818cf8', '#a5b4fc', '#3730a3'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`
  },
  folder: {
    label: 'DIR',
    gradient: ['#fbbf24', '#f59e0b'],
    glow: 'rgba(251, 191, 36, 0.45)',
    shards: ['#ffffff', '#fde68a', '#f59e0b', '#d97706'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>`
  },
  generic: {
    label: 'FILE',
    gradient: ['#64748b', '#475569'],
    glow: 'rgba(100, 116, 139, 0.45)',
    shards: ['#ffffff', '#94a3b8', '#cbd5e1', '#334155'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>`
  }
};

const EXTENSION_MAP = {
  // PDF
  '.pdf': 'pdf',

  // Spreadsheets
  '.xlsx': 'sheet',
  '.xls': 'sheet',
  '.csv': 'sheet',
  '.tsv': 'sheet',

  // Documents
  '.docx': 'doc',
  '.doc': 'doc',
  '.txt': 'doc',
  '.rtf': 'doc',
  '.odt': 'doc',
  '.md': 'doc',
  '.log': 'doc',

  // Images
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.webp': 'image',
  '.bmp': 'image',
  '.ico': 'image',
  '.psd': 'image',
  '.ai': 'image',

  // Video
  '.mp4': 'video',
  '.mkv': 'video',
  '.mov': 'video',
  '.avi': 'video',
  '.wmv': 'video',
  '.webm': 'video',
  '.flv': 'video',

  // Audio
  '.mp3': 'audio',
  '.wav': 'audio',
  '.flac': 'audio',
  '.ogg': 'audio',
  '.m4a': 'audio',
  '.aac': 'audio',

  // Code / Web
  '.js': 'code',
  '.jsx': 'code',
  '.ts': 'code',
  '.tsx': 'code',
  '.json': 'code',
  '.html': 'code',
  '.css': 'code',
  '.scss': 'code',
  '.py': 'code',
  '.cpp': 'code',
  '.c': 'code',
  '.cs': 'code',
  '.java': 'code',
  '.rs': 'code',
  '.go': 'code',
  '.php': 'code',
  '.rb': 'code',
  '.sql': 'code',
  '.yaml': 'code',
  '.yml': 'code',
  '.xml': 'code',

  // Archives
  '.zip': 'archive',
  '.rar': 'archive',
  '.7z': 'archive',
  '.tar': 'archive',
  '.gz': 'archive',
  '.iso': 'archive',

  // Executables
  '.exe': 'exe',
  '.msi': 'exe',
  '.bat': 'exe',
  '.cmd': 'exe',
  '.ps1': 'exe',
  '.vbs': 'exe',
  '.jar': 'exe'
};

function getFileTheme(fileName = '', isDirectory = false) {
  if (isDirectory) {
    return FILE_THEMES.folder;
  }

  const dotIdx = fileName.lastIndexOf('.');
  if (dotIdx === -1) {
    return FILE_THEMES.generic;
  }

  const ext = fileName.substring(dotIdx).toLowerCase();
  const category = EXTENSION_MAP[ext] || 'generic';
  const theme = FILE_THEMES[category] || FILE_THEMES.generic;

  // Use exact uppercase extension as label if short (e.g. "PNG", "DOCX")
  const customLabel = ext.replace('.', '').toUpperCase();
  if (customLabel.length <= 4) {
    return Object.assign({}, theme, { label: customLabel });
  }

  return theme;
}

window.getFileTheme = getFileTheme;
