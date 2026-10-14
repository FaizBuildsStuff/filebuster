/**
 * Modern Minimalist File Icon System for File Buster
 * Provides ditto minimalist visual identities for each file type:
 * White crisp paper for documents, golden tabs for folders, polaroid for photos, clapper for video, etc.
 */

const FILE_THEMES = {
  doc: {
    cardClass: 'type-doc',
    label: 'DOC',
    badgeColor: '#2563eb',
    gradient: ['#3b82f6', '#1d4ed8'],
    glow: 'rgba(37, 99, 235, 0.35)',
    shards: ['#ffffff', '#f8fafc', '#93c5fd', '#2563eb'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4v10h12" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4l12 10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="14" y1="20" x2="34" y2="20" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="14" y1="26" x2="34" y2="26" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="32" x2="30" y2="32" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="38" x2="24" y2="38" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },

  pdf: {
    cardClass: 'type-pdf',
    label: 'PDF',
    badgeColor: '#ef4444',
    gradient: ['#ef4444', '#b91c1c'],
    glow: 'rgba(239, 68, 68, 0.35)',
    shards: ['#ffffff', '#f8fafc', '#fca5a5', '#dc2626'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4v10h12" fill="#fee2e2" stroke="#fca5a5" stroke-width="2"/>
      <path d="M28 4l12 10" stroke="#ef4444" stroke-width="2"/>
      <rect x="12" y="18" width="24" height="10" rx="2" fill="#ef4444"/>
      <text x="24" y="25.5" fill="#ffffff" font-size="7" font-weight="bold" font-family="sans-serif" text-anchor="middle">PDF</text>
      <line x1="14" y1="33" x2="34" y2="33" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="38" x2="26" y2="38" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },

  sheet: {
    cardClass: 'type-sheet',
    label: 'XLS',
    badgeColor: '#10b981',
    gradient: ['#10b981', '#047857'],
    glow: 'rgba(16, 185, 129, 0.35)',
    shards: ['#ffffff', '#f8fafc', '#6ee7b7', '#059669'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4v10h12" fill="#d1fae5" stroke="#a7f3d0" stroke-width="2"/>
      <path d="M28 4l12 10" stroke="#10b981" stroke-width="2"/>
      <rect x="12" y="19" width="24" height="20" rx="2" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5"/>
      <line x1="12" y1="25" x2="36" y2="25" stroke="#10b981" stroke-width="1.5"/>
      <line x1="12" y1="32" x2="36" y2="32" stroke="#10b981" stroke-width="1.5"/>
      <line x1="20" y1="19" x2="20" y2="39" stroke="#10b981" stroke-width="1.5"/>
      <line x1="28" y1="19" x2="28" y2="39" stroke="#10b981" stroke-width="1.5"/>
    </svg>`
  },

  folder: {
    cardClass: 'type-folder',
    label: 'DIR',
    badgeColor: '#d97706',
    gradient: ['#fbbf24', '#f59e0b'],
    glow: 'rgba(245, 158, 11, 0.35)',
    shards: ['#fef3c7', '#fde68a', '#f59e0b', '#b45309'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <!-- Back Tab -->
      <path d="M6 14a3 3 0 0 1 3-3h10l3 3h17a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14z" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <!-- Peeking Paper Document -->
      <rect x="11" y="9" width="26" height="18" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <line x1="15" y1="14" x2="33" y2="14" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="15" y1="18" x2="27" y2="18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Front Flap -->
      <path d="M6 19a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V19z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
    </svg>`
  },

  image: {
    cardClass: 'type-image',
    label: 'IMG',
    badgeColor: '#8b5cf6',
    gradient: ['#8b5cf6', '#6d28d9'],
    glow: 'rgba(139, 92, 246, 0.35)',
    shards: ['#ffffff', '#f5f3ff', '#c084fc', '#7c3aed'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <!-- Polaroid Photo Frame -->
      <rect x="8" y="5" width="32" height="38" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Image Viewport -->
      <rect x="11" y="8" width="26" height="24" rx="2" fill="#e0e7ff"/>
      <circle cx="18" cy="15" r="3" fill="#f59e0b"/>
      <path d="M11 29l7-8 6 6 5-5 8 7H11z" fill="#8b5cf6"/>
      <path d="M22 29l4-4 4 4h-8z" fill="#6d28d9"/>
    </svg>`
  },

  video: {
    cardClass: 'type-video',
    label: 'MP4',
    badgeColor: '#f43f5e',
    gradient: ['#f43f5e', '#be123c'],
    glow: 'rgba(244, 63, 94, 0.35)',
    shards: ['#ffffff', '#f43f5e', '#fb7185', '#27272a'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="6" y="8" width="36" height="32" rx="4" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Clapper Top Stripes -->
      <rect x="6" y="8" width="36" height="9" rx="3" fill="#27272a"/>
      <path d="M12 8l4 9M22 8l4 9M32 8l4 9" stroke="#ffffff" stroke-width="2"/>
      <!-- Play Button -->
      <circle cx="24" cy="27" r="7" fill="#f43f5e"/>
      <polygon points="22,23.5 28,27 22,30.5" fill="#ffffff"/>
    </svg>`
  },

  audio: {
    cardClass: 'type-audio',
    label: 'MP3',
    badgeColor: '#ec4899',
    gradient: ['#ec4899', '#a855f7'],
    glow: 'rgba(236, 72, 153, 0.35)',
    shards: ['#ffffff', '#f472b6', '#c084fc', '#4338ca'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="6" y="6" width="36" height="36" rx="4" fill="#1e1b4b" stroke="#3730a3" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="14" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <circle cx="24" cy="24" r="10" stroke="#1e293b" stroke-width="0.75"/>
      <circle cx="24" cy="24" r="6" fill="#ec4899"/>
      <circle cx="24" cy="24" r="2" fill="#ffffff"/>
      <path d="M22 20v-5l7-2v5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },

  code: {
    cardClass: 'type-code',
    label: 'CODE',
    badgeColor: '#06b6d4',
    gradient: ['#06b6d4', '#0284c7'],
    glow: 'rgba(6, 182, 212, 0.35)',
    shards: ['#ffffff', '#38bdf8', '#22d3ee', '#0284c7'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="6" y="6" width="36" height="36" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Window Controls -->
      <circle cx="12" cy="12" r="2" fill="#ef4444"/>
      <circle cx="18" cy="12" r="2" fill="#eab308"/>
      <circle cx="24" cy="12" r="2" fill="#22c55e"/>
      <line x1="6" y1="16" x2="42" y2="16" stroke="#1e293b" stroke-width="1"/>
      <!-- Code Brackets -->
      <path d="M17 22l-5 5 5 5" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31 22l5 5-5 5" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="26" y1="20" x2="22" y2="34" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },

  archive: {
    cardClass: 'type-archive',
    label: 'ZIP',
    badgeColor: '#d97706',
    gradient: ['#f59e0b', '#d97706'],
    glow: 'rgba(245, 158, 11, 0.35)',
    shards: ['#ffffff', '#fde68a', '#f59e0b', '#78350f'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="8" y="6" width="32" height="36" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <line x1="24" y1="6" x2="24" y2="42" stroke="#b45309" stroke-width="4" stroke-dasharray="2 2"/>
      <rect x="21" y="22" width="6" height="10" rx="1.5" fill="#d97706" stroke="#78350f" stroke-width="1"/>
      <circle cx="24" cy="27" r="1.5" fill="#ffffff"/>
    </svg>`
  },

  exe: {
    cardClass: 'type-exe',
    label: 'EXE',
    badgeColor: '#ea580c',
    gradient: ['#f97316', '#ea580c'],
    glow: 'rgba(249, 115, 22, 0.35)',
    shards: ['#ffffff', '#fdba74', '#f97316', '#334155'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="6" y="6" width="36" height="36" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <polygon points="26,10 14,26 24,26 22,38 34,22 24,22" fill="#f97316"/>
    </svg>`
  },

  generic: {
    cardClass: 'type-generic',
    label: 'FILE',
    badgeColor: '#64748b',
    gradient: ['#64748b', '#475569'],
    glow: 'rgba(100, 116, 139, 0.25)',
    shards: ['#ffffff', '#f1f5f9', '#94a3b8', '#475569'],
    svg: `<svg viewBox="0 0 48 48" fill="none" class="ditto-svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4v10h12" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M28 4l12 10" stroke="#94a3b8" stroke-width="2"/>
      <line x1="14" y1="22" x2="34" y2="22" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="28" x2="34" y2="28" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      <line x1="14" y1="34" x2="26" y2="34" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
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

  // Code
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

  const customLabel = ext.replace('.', '').toUpperCase();
  if (customLabel.length <= 4) {
    return Object.assign({}, theme, { label: customLabel });
  }

  return theme;
}

window.getFileTheme = getFileTheme;
