import * as THREE from 'three';
import { createFlameParticleTexture } from '../procedural-textures';
import { sound } from '../../audio/sound-synth';

export interface FireworksSystem {
  group: THREE.Group;
  launchFirework: (origin?: THREE.Vector3, burstColor?: THREE.Color) => void;
  launchGroundToSkyCrackerShow: (center?: THREE.Vector3) => void;
  update: (delta: number) => void;
}

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  alpha: number;
  decay: number;
}

/**
 * Creates the Realistic Fireworks System with multi-color bursts,
 * bottom-to-top ground fountain sparklers, ascending rockets,
 * physical gravity, trailing sparks, and ambient flash illumination.
 */
export function createFireworksSystem(): FireworksSystem {
  const group = new THREE.Group();
  group.name = 'Fireworks_System';

  const flameTexture = createFlameParticleTexture();

  const maxParticles = 1400;
  const positions = new Float32Array(maxParticles * 3);
  const colors = new Float32Array(maxParticles * 3);
  const sizes = new Float32Array(maxParticles);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pointsMesh = new THREE.Points(geometry, material);
  group.add(pointsMesh);

  // Flash light illuminating the battlefield and palace
  const burstLight = new THREE.PointLight(0xffeedd, 0, 50);
  group.add(burstLight);

  const particles: Particle[] = [];
  const palette = [
    new THREE.Color('#ffd700'), // Royal Gold
    new THREE.Color('#ff4757'), // Crimson Ruby
    new THREE.Color('#2ed573'), // Emerald Green
    new THREE.Color('#1e90ff'), // Peacock Blue
    new THREE.Color('#ffa502'), // Saffron Orange
    new THREE.Color('#e056fd'), // Royal Magenta
  ];

  const launchFirework = (origin?: THREE.Vector3, burstColor?: THREE.Color) => {
    const burstX = origin ? origin.x : (Math.random() - 0.5) * 24;
    const burstY = origin ? origin.y : 16 + Math.random() * 10;
    const burstZ = origin ? origin.z : -2 + (Math.random() - 0.5) * 12;

    const chosenColor = burstColor || palette[Math.floor(Math.random() * palette.length)];
    const count = 80;

    burstLight.position.set(burstX, burstY, burstZ);
    burstLight.color.copy(chosenColor);
    burstLight.intensity = 4.5;

    sound.playFirework();

    for (let i = 0; i < count; i++) {
      if (particles.length >= maxParticles) {
        particles.shift();
      }

      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const speed = 4 + Math.random() * 9;

      const vel = new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi) * speed,
        Math.sin(theta) * Math.sin(phi) * speed,
        Math.cos(theta) * speed
      );

      particles.push({
        pos: new THREE.Vector3(burstX, burstY, burstZ),
        vel,
        color: chosenColor.clone().offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1),
        size: 0.25 + Math.random() * 0.35,
        alpha: 1.0,
        decay: 0.6 + Math.random() * 0.7,
      });
    }
  };

  /**
   * Ascending "Bottom-to-Top" Cracker Celebration Show:
   * 1. Ground level Anar fountains shoot thousands of sparks from y=0
   * 2. Rockets shoot upwards from ground level leaving fiery trails
   * 3. Multiple tiers of bursting fireworks cascade across sky heights
   */
  const launchGroundToSkyCrackerShow = (center?: THREE.Vector3) => {
    const cx = center ? center.x : 0;
    const cz = center ? center.z : -26; // Battlefield center

    // Phase 1: Ground fountains (y = 0 to 5)
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        sound.playFirework();
        const fx = cx + (Math.random() - 0.5) * 6;
        const fz = cz + (Math.random() - 0.5) * 6;
        for (let p = 0; p < 60; p++) {
          if (particles.length >= maxParticles) particles.shift();
          const speedY = 7 + Math.random() * 10; // High vertical velocity
          const spread = (Math.random() - 0.5) * 3.5;
          particles.push({
            pos: new THREE.Vector3(fx, 0.1, fz),
            vel: new THREE.Vector3(spread, speedY, spread),
            color: new THREE.Color(Math.random() > 0.4 ? '#ffd700' : '#ff4757'),
            size: 0.22 + Math.random() * 0.25,
            alpha: 1.0,
            decay: 0.9 + Math.random() * 0.6,
          });
        }
      }, f * 180);
    }

    // Phase 2: Ascending Rockets shooting upward from ground (350ms to 900ms)
    setTimeout(() => {
      launchFirework(new THREE.Vector3(cx - 3, 12, cz), new THREE.Color('#ffa502'));
    }, 450);

    setTimeout(() => {
      launchFirework(new THREE.Vector3(cx + 3, 16, cz), new THREE.Color('#2ed573'));
    }, 850);

    // Phase 3: High sky fireworks (1200ms to 2400ms)
    setTimeout(() => {
      launchFirework(new THREE.Vector3(cx, 22, cz), new THREE.Color('#ffd700'));
      launchFirework(new THREE.Vector3(cx - 5, 26, cz), new THREE.Color('#ff4757'));
    }, 1300);

    setTimeout(() => {
      launchFirework(new THREE.Vector3(cx + 4, 28, cz), new THREE.Color('#1e90ff'));
      launchFirework(new THREE.Vector3(cx, 32, cz), new THREE.Color('#e056fd'));
    }, 1800);
  };

  const update = (delta: number) => {
    burstLight.intensity = Math.max(0, burstLight.intensity - delta * 6);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.pos.addScaledVector(p.vel, delta);
      p.vel.y -= delta * 3.8; // Gravity
      p.vel.multiplyScalar(0.96); // Drag
      p.alpha -= delta * p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // Update GPU buffers
    for (let i = 0; i < maxParticles; i++) {
      if (i < particles.length) {
        const p = particles[i];
        positions[i * 3] = p.pos.x;
        positions[i * 3 + 1] = p.pos.y;
        positions[i * 3 + 2] = p.pos.z;

        colors[i * 3] = p.color.r * p.alpha;
        colors[i * 3 + 1] = p.color.g * p.alpha;
        colors[i * 3 + 2] = p.color.b * p.alpha;

        sizes[i] = p.size * p.alpha;
      } else {
        positions[i * 3 + 1] = -9999;
        sizes[i] = 0;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  };

  return {
    group,
    launchFirework,
    launchGroundToSkyCrackerShow,
    update,
  };
}
