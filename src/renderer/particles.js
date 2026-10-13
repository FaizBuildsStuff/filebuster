/**
 * High-performance Cartoon Particle Engine for File Buster
 * Spawns paper shards, vibrant sparks, and smoke directly at file deletion coordinates.
 */

class VisualFXEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.animFrameId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth || 1920;
    this.height = window.innerHeight || 1080;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Spawn explosion particles directly at the deleted file location (x, y)
   * @param {number} x File coordinate X
   * @param {number} y File coordinate Y
   */
  triggerImpact(x, y, themeShards = null) {
    this.resize();

    const shardPalette = (Array.isArray(themeShards) && themeShards.length > 0)
      ? themeShards
      : ['#ffffff', '#ff9800', '#ffee55', '#ff2222'];

    // 1. Shattered Paper Document Shards
    const shardCount = 42;
    for (let i = 0; i < shardCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      const color = shardPalette[Math.floor(Math.random() * shardPalette.length)];
      this.particles.push({
        type: 'paper',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8, // initial upward comic lift
        w: 6 + Math.random() * 11,
        h: 7 + Math.random() * 13,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.35,
        color,
        alpha: 1.0,
        decay: 0.016 + Math.random() * 0.018,
        gravity: 0.22,
        drag: 0.95
      });
    }

    // 2. Glowing Comic Sparks
    const sparkCount = 42;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 13;
      const colors = ['#ffffff', '#ffee55', '#ff9800', '#ff2222'];
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.024 + Math.random() * 0.032,
        gravity: 0.16,
        drag: 0.94
      });
    }

    // 3. Cartoon Smoke Clouds
    const smokeCount = 14;
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      this.particles.push({
        type: 'smoke',
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        radius: 12 + Math.random() * 15,
        growth: 0.55,
        alpha: 0.75,
        decay: 0.022,
        drag: 0.94
      });
    }

    if (!this.isRunning) {
      this.startLoop();
    }
  }

  startLoop() {
    this.isRunning = true;
    const loop = () => {
      this.update();
      this.render();

      if (this.particles.length > 0) {
        this.animFrameId = requestAnimationFrame(loop);
      } else {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.isRunning = false;
        this.animFrameId = null;
      }
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'paper') {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
      } else if (p.type === 'spark') {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.alpha -= p.decay;
      } else if (p.type === 'smoke') {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.radius += p.growth;
        p.alpha -= p.decay;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      if (p.type === 'smoke') {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);

        // Stylized 2D Cartoon Smoke with soft gradient core & comic outline
        const grad = this.ctx.createRadialGradient(
          p.x - p.radius * 0.25,
          p.y - p.radius * 0.25,
          p.radius * 0.1,
          p.x,
          p.y,
          p.radius
        );
        grad.addColorStop(0, '#f1f5f9');
        grad.addColorStop(0.55, '#94a3b8');
        grad.addColorStop(1, '#475569');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();

        this.ctx.restore();
      } else if (p.type === 'paper') {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      } else if (p.type === 'spark') {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  clear() {
    this.particles = [];
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.isRunning = false;
  }
}

window.VisualFXEngine = VisualFXEngine;
