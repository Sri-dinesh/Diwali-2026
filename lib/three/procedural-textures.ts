import * as THREE from 'three';

/**
 * Procedural texture generators for Diwali 2026 experience.
 * All textures are 100% generated in memory via HTML5 Canvas or math data,
 * guaranteeing zero 404s and maximum visual fidelity.
 */

// 1. Carved Sandstone Texture for Ayodhya Palace & Temples
export function createSandstoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm sandstone base
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#e8be89');
  grad.addColorStop(0.5, '#d4a366');
  grad.addColorStop(1, '#b58348');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine stone grain / noise
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(70,40,15,${alpha})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Intricate Indian temple carving reliefs (lotus filigree & borders)
  ctx.strokeStyle = 'rgba(90, 50, 20, 0.35)';
  ctx.lineWidth = 2.5;

  // Grid / Ashlar masonry seams
  ctx.beginPath();
  for (let y = 64; y < 512; y += 64) {
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
  }
  for (let y = 0; y < 512; y += 64) {
    const offset = (y / 64) % 2 === 0 ? 0 : 64;
    for (let x = offset; x < 512; x += 128) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
    }
  }
  ctx.stroke();

  // Decorative ornamental medallions in blocks
  ctx.fillStyle = 'rgba(255, 230, 180, 0.2)';
  for (let y = 32; y < 512; y += 128) {
    for (let x = 32; x < 512; x += 128) {
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 8-petal mini lotus
      for (let p = 0; p < 8; p++) {
        const angle = (p * Math.PI) / 4;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10, 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Royal Gold Engraving Texture (for Mukut, Bow Kodanda, Pushpak Vimana)
export function createGoldEngravingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Royal gold metallic gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.3, '#f5af19');
  grad.addColorStop(0.7, '#e68a00');
  grad.addColorStop(1, '#ffdf79');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine metallic brushed lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 8);
    ctx.stroke();
  }

  // Sacred filigree engravings
  ctx.strokeStyle = 'rgba(120, 60, 0, 0.45)';
  ctx.lineWidth = 3;
  for (let y = 40; y < 512; y += 80) {
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 20) {
      const wave = Math.sin((x / 512) * Math.PI * 8) * 14;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Ruby jewel insets
  for (let y = 80; y < 512; y += 120) {
    for (let x = 60; x < 512; x += 120) {
      const rubyGrad = ctx.createRadialGradient(x, y, 2, x, y, 10);
      rubyGrad.addColorStop(0, '#ff4757');
      rubyGrad.addColorStop(0.6, '#b33939');
      rubyGrad.addColorStop(1, '#2c0000');
      ctx.fillStyle = rubyGrad;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff2a8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Peacock Feather Texture for Lord Rama's Mukut
export function createPeacockFeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 512);

  const cx = 128;
  const eyeY = 160;

  // Outer green/gold fan
  const outerGrad = ctx.createRadialGradient(cx, eyeY, 20, cx, eyeY, 120);
  outerGrad.addColorStop(0, '#00b894');
  outerGrad.addColorStop(0.5, '#00cec9');
  outerGrad.addColorStop(0.8, '#fdcb6e');
  outerGrad.addColorStop(1, 'rgba(0,184,148,0)');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.ellipse(cx, eyeY, 100, 130, 0, 0, Math.PI * 2);
  ctx.fill();

  // Radiating feather strands
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 90; i++) {
    const angle = (i / 90) * Math.PI * 2;
    const len = 70 + Math.sin(angle * 3) * 20 + Math.random() * 15;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(253, 203, 110, 0.7)' : 'rgba(0, 206, 201, 0.7)';
    ctx.beginPath();
    ctx.moveTo(cx, eyeY);
    ctx.lineTo(cx + Math.cos(angle) * len, eyeY + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Turquoise ring
  const turqGrad = ctx.createRadialGradient(cx, eyeY, 15, cx, eyeY, 55);
  turqGrad.addColorStop(0, '#0984e3');
  turqGrad.addColorStop(0.8, '#00cec9');
  turqGrad.addColorStop(1, '#6c5ce7');
  ctx.fillStyle = turqGrad;
  ctx.beginPath();
  ctx.ellipse(cx, eyeY, 50, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark violet-blue heart/eye
  const eyeGrad = ctx.createRadialGradient(cx, eyeY + 5, 2, cx, eyeY + 5, 30);
  eyeGrad.addColorStop(0, '#2d3436');
  eyeGrad.addColorStop(0.5, '#1e272e');
  eyeGrad.addColorStop(0.8, '#2e1b4b');
  eyeGrad.addColorStop(1, '#0c2461');
  ctx.fillStyle = eyeGrad;
  ctx.beginPath();
  ctx.arc(cx, eyeY + 5, 25, 0, Math.PI * 2);
  ctx.fill();

  // Central quill spine
  ctx.strokeStyle = '#fff3bf';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, eyeY - 80);
  ctx.quadraticCurveTo(cx - 5, eyeY + 120, cx, 512);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Terracotta Clay Diya Texture
export function createTerracottaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Earthy terracotta gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#d35400');
  grad.addColorStop(0.4, '#e67e22');
  grad.addColorStop(0.8, '#c0392b');
  grad.addColorStop(1, '#a04000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Clay speckles
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 200, 150, 0.15)' : 'rgba(50, 20, 10, 0.15)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Golden painted rim motif
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 105, 0, Math.PI * 2);
  ctx.stroke();

  // Mini gold dots along rim
  ctx.fillStyle = '#fff9d2';
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(128 + Math.cos(a) * 105, 128 + Math.sin(a) * 105, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Grand Rangoli Floor Mandala Texture
export function createRangoliTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 1024, 1024);

  const cx = 512;
  const cy = 512;

  // Outer dark grounding ring
  ctx.fillStyle = 'rgba(20, 10, 5, 0.6)';
  ctx.beginPath();
  ctx.arc(cx, cy, 490, 0, Math.PI * 2);
  ctx.fill();

  // Multi-color concentric lotus petals
  const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#ffd700'];

  for (let ring = 5; ring >= 1; ring--) {
    const radius = ring * 85;
    const petals = ring * 8;
    ctx.fillStyle = colors[ring % colors.length];
    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.ellipse(px, py, 28, 45, angle, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Central golden lotus
  const centerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 70);
  centerGrad.addColorStop(0, '#ffffff');
  centerGrad.addColorStop(0.4, '#ffd700');
  centerGrad.addColorStop(1, '#ff6b6b');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  // Sacred Om symbol in the exact center
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ॐ', cx, cy - 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 6. Realistic Flame Glow Texture for Diya & Fire Arrow
export function createFlameParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 128, 128);

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 220, 100, 0.95)');
  grad.addColorStop(0.5, 'rgba(255, 110, 0, 0.7)');
  grad.addColorStop(0.8, 'rgba(200, 30, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 7. Sanskrit Glowing Mantra Sprite Texture ("जय श्री राम")
export function createSanskritMantraTexture(text: string = 'जय श्री राम'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 128);

  ctx.shadowColor = '#ffb300';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#fff4cc';
  ctx.font = 'bold 52px "Cinzel", "Rozha One", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
