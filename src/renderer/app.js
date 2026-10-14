document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  const sceneAnchor = document.getElementById('scene-anchor');
  const targetContainer = document.getElementById('target-container');
  const targetCard = document.getElementById('target-card');
  const fileNameEl = document.getElementById('file-name');
  const fileExtTag = document.getElementById('file-ext-tag');
  const fileIconSlot = document.getElementById('file-icon-slot');
  const gunContainer = document.getElementById('gun-container');
  const muzzleFlash = document.getElementById('muzzle-flash');
  const explosionContainer = document.getElementById('explosion-container');
  const canvas = document.getElementById('fx-canvas');

  const fx = new window.VisualFXEngine(canvas);

  let isPlaying = false;

  function resetState() {
    stage.style.opacity = '1';
    sceneAnchor.className = '';
    sceneAnchor.classList.remove('shake-scene');

    targetContainer.className = '';
    if (targetCard) targetCard.className = '';
    gunContainer.className = '';
    muzzleFlash.className = '';
    explosionContainer.className = '';

    fx.clear();
  }

  function playCartoonBust(data = {}) {
    if (isPlaying) return;
    isPlaying = true;

    resetState();

    const targetX = typeof data.x === 'number' ? data.x : window.innerWidth / 2;
    const targetY = typeof data.y === 'number' ? data.y : window.innerHeight / 2;

    // Anchor the entire animation directly at the exact pixel where the file was deleted
    sceneAnchor.style.left = `${targetX}px`;
    sceneAnchor.style.top = `${targetY}px`;

    // If near the left edge of the screen, mirror gun to come from the right
    if (data.fromRight) {
      sceneAnchor.classList.add('from-right');
    }

    const fileName = data.fileName || 'Deleted_File.txt';
    fileNameEl.textContent = fileName;

    // Resolve Modern Minimalist Theme based on file type
    const isFolder = Boolean(data.isDirectory || (!fileName.includes('.') && !data.filePath?.includes('.')));
    const theme = window.getFileTheme(fileName, isFolder);

    // Apply Ditto Card Class (type-doc, type-folder, type-image, type-video, etc.)
    if (targetCard) {
      targetCard.className = theme.cardClass || 'type-doc';
    }

    // Apply Dynamic Theme Colors
    targetContainer.style.setProperty('--theme-color', theme.badgeColor || theme.gradient[0]);
    targetContainer.style.setProperty('--theme-glow', theme.glow);
    targetContainer.style.setProperty(
      '--theme-gradient',
      `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`
    );

    // If authentic Windows shell icon was extracted, render it; otherwise render clean ditto vector SVG
    if (data.iconUrl) {
      fileIconSlot.innerHTML = `<img class="native-shell-icon" src="${data.iconUrl}" alt="" />`;
    } else {
      fileIconSlot.innerHTML = theme.svg;
    }

    fileExtTag.textContent = theme.label;
    fileExtTag.style.background = theme.badgeColor || theme.gradient[0];

    // Pupil gaze adjustment: look towards the gun
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach((pupil) => {
      pupil.style.transform = data.fromRight ? 'translate(2px, 0)' : 'translate(-2px, 0)';
    });

    // Timeline Sequence:

    // 0ms: Target card pops in right on the file's spot, shivering with fear
    targetContainer.classList.add('pop-in', 'shivering');

    // 180ms: Point-blank comic pistol pops out right next to the card
    setTimeout(() => {
      gunContainer.classList.add('aiming');
    }, 180);

    // 480ms: Gun cocks back with anticipation
    setTimeout(() => {
      gunContainer.classList.remove('aiming');
      gunContainer.classList.add('cocking');
    }, 480);

    // 650ms: BANG! Gun fires with violent recoil right into the card!
    setTimeout(() => {
      gunContainer.classList.remove('cocking');
      gunContainer.classList.add('recoil');

      // Muzzle flash at barrel tip
      muzzleFlash.classList.add('flash');

      // Scene shakes with impact
      sceneAnchor.classList.add('shake-scene');

      // If triggered via Context Menu, delete the file right at the BANG!
      if (data.deleteAtBang && data.filePath && window.fileBuster && window.fileBuster.nukeFile) {
        window.fileBuster.nukeFile(data.filePath);
      }

      // The card shatters into oblivion
      targetContainer.classList.remove('pop-in', 'shivering');
      targetContainer.classList.add('shattered');

      // Comic POW! BANG! explosion slams right over the file
      explosionContainer.classList.add('bang');

      // Paper shards, fiery sparks and smoke burst in the file's theme colors
      fx.triggerImpact(targetX, targetY, theme.shards);
    }, 650);

    // 1350ms: Pistol retracts / twirls back out of view
    setTimeout(() => {
      gunContainer.classList.remove('recoil');
      gunContainer.classList.add('retract');
    }, 1350);

    // 1750ms: Smoothly fade out the stage
    setTimeout(() => {
      stage.style.opacity = '0';
    }, 1750);

    // 2050ms: Sequence finished -> Hide overlay window
    setTimeout(() => {
      resetState();
      isPlaying = false;
      if (window.fileBuster && window.fileBuster.notifyBustFinished) {
        window.fileBuster.notifyBustFinished();
      }
    }, 2050);
  }

  // Listen for trigger from Main process (file deletion or tray test)
  if (window.fileBuster && window.fileBuster.onPlayCartoonBust) {
    window.fileBuster.onPlayCartoonBust((data) => {
      playCartoonBust(data);
    });
  }
});
