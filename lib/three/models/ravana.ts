import * as THREE from 'three';
import { createGoldEngravingTexture, createFlameParticleTexture } from '../procedural-textures';

export interface RavanaCharacter {
  group: THREE.Group;
  catchFire: (duration?: number, onComplete?: () => void) => void;
  defeat: () => void;
  reset: () => void;
  update: (delta: number, time: number) => void;
  isDefeated: boolean;
  isInFire: boolean;
  fireTimer: number;
}

/**
 * Creates the majestic 3D Ravana character
 * Ten crowned heads in an arc, imposing obsidian and crimson royal armor,
 * spiked golden pauldrons, demon blade, dark menacing aura,
 * and a 5-second realistic fire engulfment animation when struck by the Agni Astra.
 */
export function createRavana(): RavanaCharacter {
  const group = new THREE.Group();
  group.name = 'Ravana_Antagonist';

  const goldTexture = createGoldEngravingTexture();
  const flameTexture = createFlameParticleTexture();

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x634235,
    roughness: 0.55,
    metalness: 0.1,
  });

  const armorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a24,
    roughness: 0.25,
    metalness: 0.85,
    bumpMap: goldTexture,
    bumpScale: 0.02,
  });

  const darkGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.9,
    map: goldTexture,
  });

  const crimsonClothMaterial = new THREE.MeshStandardMaterial({
    color: 0x800c0c,
    roughness: 0.7,
    metalness: 0.15,
  });

  const darkAuraMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b0000,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const flameMaterial = new THREE.MeshBasicMaterial({
    map: flameTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const root = new THREE.Group();
  group.add(root);

  // Legs & Boots
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 1.15, 16), armorMaterial);
  leftLeg.position.set(-0.3, 0.575, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 1.15, 16), armorMaterial);
  rightLeg.position.set(0.3, 0.575, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  [-0.3, 0.3].forEach((x) => {
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.36), armorMaterial);
    boot.position.set(x, 0.11, 0.05);
    root.add(boot);
  });

  // Skirt & Belt
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.35, 0.95, 24), crimsonClothMaterial);
  skirt.position.set(0, 0.9, 0);
  skirt.castShadow = true;
  root.add(skirt);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 12, 24), darkGoldMaterial);
  belt.rotation.x = Math.PI / 2;
  belt.position.set(0, 1.35, 0);
  root.add(belt);

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.4, 0);
  root.add(torsoGroup);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.85, 20), armorMaterial);
  chest.position.set(0, 0.42, 0);
  chest.castShadow = true;
  torsoGroup.add(chest);

  const demonMedallion = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), darkGoldMaterial);
  demonMedallion.rotation.x = Math.PI / 2;
  demonMedallion.position.set(0, 0.5, 0.38);
  torsoGroup.add(demonMedallion);

  // Spiked Pauldrons
  [-0.55, 0.55].forEach((px, i) => {
    const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), darkGoldMaterial);
    pauldron.scale.set(1.2, 0.8, 1.0);
    pauldron.position.set(px, 0.72, 0);
    for (let s = 0; s < 3; s++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.25, 8), armorMaterial);
      spike.position.set(0, 0.18 + s * 0.05, (s - 1) * 0.12);
      spike.rotation.z = (i === 0 ? -1 : 1) * 0.6;
      pauldron.add(spike);
    }
    torsoGroup.add(pauldron);
  });

  // Arms
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.7, 16), armorMaterial);
  leftArm.position.set(-0.62, 0.35, 0.15);
  leftArm.rotation.x = 0.4;
  torsoGroup.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.7, 16), armorMaterial);
  rightArm.position.set(0.62, 0.35, 0.15);
  rightArm.rotation.x = 0.4;
  torsoGroup.add(rightArm);

  // Sword
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0.72, 0.1, 0.3);
  swordGroup.rotation.x = 0.8;

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.02), armorMaterial);
  blade.position.y = 0.7;
  swordGroup.add(blade);

  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.06), darkGoldMaterial);
  swordGroup.add(guard);

  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), darkGoldMaterial);
  pommel.position.y = -0.15;
  swordGroup.add(pommel);
  torsoGroup.add(swordGroup);

  // The Ten Heads
  const headsArcGroup = new THREE.Group();
  headsArcGroup.position.set(0, 0.95, 0);
  torsoGroup.add(headsArcGroup);

  const totalHeads = 10;
  const headsList: THREE.Group[] = [];

  for (let i = 0; i < totalHeads; i++) {
    const headGroup = new THREE.Group();
    const offset = i - 4.5;
    const isCenter = Math.abs(offset) <= 0.8;

    const angle = (offset / 5) * 0.75;
    const hx = Math.sin(angle) * 1.05;
    const hz = -Math.cos(angle) * 0.35 + 0.35;
    const hy = isCenter ? 0.15 : -Math.abs(offset) * 0.035;

    headGroup.position.set(hx, hy, hz);
    headGroup.rotation.y = -angle * 0.8;

    const headScale = isCenter ? 1.15 : 0.82;
    headGroup.scale.set(headScale, headScale, headScale);

    const hMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMaterial);
    hMesh.scale.set(0.9, 1.1, 1.0);
    hMesh.castShadow = true;
    headGroup.add(hMesh);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.12, isCenter ? 0.36 : 0.22, 12), darkGoldMaterial);
    crown.position.y = 0.22;
    headGroup.add(crown);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1e00 });
    [-0.045, 0.045].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eyeMat);
      eye.position.set(ex, 0.02, 0.13);
      headGroup.add(eye);
    });

    headsArcGroup.add(headGroup);
    headsList.push(headGroup);
  }

  // Dark Aura
  const auraGeom = new THREE.SphereGeometry(1.6, 16, 16);
  const darkAuraMesh = new THREE.Mesh(auraGeom, darkAuraMaterial);
  darkAuraMesh.position.set(0, 1.6, 0);
  root.add(darkAuraMesh);

  // --- Raging Body Fire Engulfment System ---
  const bodyFireGroup = new THREE.Group();
  bodyFireGroup.position.set(0, 1.5, 0);
  root.add(bodyFireGroup);

  // Multiple Layered Flame Billboards on Ravana's Body
  const flameMeshes: THREE.Mesh[] = [];
  const flamePlacements = [
    { x: 0, y: 0.2, z: 0.35, sx: 1.8, sy: 2.4 }, // Chest fire
    { x: 0, y: 0.9, z: 0.2, sx: 2.4, sy: 2.2 }, // Heads fire
    { x: -0.6, y: 0.3, z: 0.2, sx: 1.2, sy: 1.8 }, // Left arm fire
    { x: 0.6, y: 0.3, z: 0.2, sx: 1.2, sy: 1.8 }, // Right arm fire
    { x: 0, y: -0.4, z: 0.1, sx: 1.6, sy: 1.8 }, // Waist fire
  ];

  flamePlacements.forEach((p) => {
    const fMesh = new THREE.Mesh(new THREE.PlaneGeometry(p.sx, p.sy), flameMaterial);
    fMesh.position.set(p.x, p.y, p.z);
    bodyFireGroup.add(fMesh);
    flameMeshes.push(fMesh);
  });

  // Intense Agni Burning Light on Ravana
  const fireLight = new THREE.PointLight(0xff3300, 0, 18);
  fireLight.position.set(0, 1.8, 0.5);
  root.add(fireLight);

  // Swirling Fire Particles (100 embers)
  const emberCount = 100;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(emberCount * 3);
  const emberVel = new Float32Array(emberCount * 3);

  for (let i = 0; i < emberCount; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 2.2;
    emberPos[i * 3 + 1] = Math.random() * 3.5;
    emberPos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;

    emberVel[i * 3] = (Math.random() - 0.5) * 1.5;
    emberVel[i * 3 + 1] = 1.5 + Math.random() * 2.5;
    emberVel[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));

  const emberMat = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.35,
    color: 0xff6600,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const fireEmbers = new THREE.Points(emberGeo, emberMat);
  root.add(fireEmbers);

  // Shockwave ring on arrow strike
  const ringGeo = new THREE.RingGeometry(0.2, 0.6, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffdd44,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const shockwave = new THREE.Mesh(ringGeo, ringMat);
  shockwave.rotation.x = Math.PI / 2;
  shockwave.position.y = 1.6;
  root.add(shockwave);

  // State Management
  let isDefeated = false;
  let isInFire = false;
  let fireTimer = 0;
  let fireDuration = 5.0; // 5 full seconds in fire as requested!
  let onCompleteCallback: (() => void) | undefined;

  const catchFire = (duration: number = 5.0, onComplete?: () => void) => {
    isInFire = true;
    fireTimer = 0;
    fireDuration = duration;
    onCompleteCallback = onComplete;
    flameMaterial.opacity = 0.95;
    fireLight.intensity = 5.5;
    shockwave.scale.set(1, 1, 1);
    ringMat.opacity = 1.0;
  };

  const defeat = () => {
    catchFire(5.0);
  };

  const reset = () => {
    isDefeated = false;
    isInFire = false;
    fireTimer = 0;
    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.rotation.set(0, 0, 0);
    darkAuraMaterial.opacity = 0.35;
    flameMaterial.opacity = 0;
    fireLight.intensity = 0;
    ringMat.opacity = 0;
  };

  const update = (delta: number, time: number) => {
    if (!isInFire && !isDefeated) {
      // Normal idle
      torsoGroup.position.y = 1.4 + Math.sin(time * 1.5) * 0.03;
      swordGroup.rotation.z = Math.sin(time * 2.0) * 0.05;

      headsList.forEach((h, idx) => {
        h.rotation.x = Math.sin(time * 2 + idx * 0.4) * 0.06;
      });

      // Subtle resting embers
      const arr = emberPos;
      for (let i = 0; i < emberCount; i++) {
        arr[i * 3 + 1] += delta * 0.8;
        if (arr[i * 3 + 1] > 3.0) arr[i * 3 + 1] = 0.2;
      }
      emberGeo.attributes.position.needsUpdate = true;
    } else if (isInFire) {
      // RAVANA IS IN FIRE FOR 5 SECONDS!
      fireTimer += delta;

      // Expand initial shockwave
      shockwave.scale.addScalar(delta * 9);
      ringMat.opacity = Math.max(0, 1 - fireTimer * 1.2);

      // Flickering roaring flame light
      const flicker = 4.5 + Math.sin(time * 25) * 1.5 + Math.cos(time * 18) * 1.2;
      fireLight.intensity = flicker;

      // Writhing agony animation in sacred fire
      root.rotation.z = Math.sin(time * 16) * 0.12;
      root.rotation.x = Math.sin(time * 12) * 0.14 - (fireTimer / fireDuration) * 0.6;
      torsoGroup.position.y = 1.4 + Math.sin(time * 20) * 0.08;
      swordGroup.rotation.x = 0.8 + Math.sin(time * 15) * 0.3;

      // Heads undulating violently in flames
      headsList.forEach((h, idx) => {
        h.rotation.x = Math.sin(time * 20 + idx) * 0.25;
        h.rotation.y = Math.cos(time * 18 + idx) * 0.2;
      });

      // Billboard flames facing camera and fluttering
      flameMeshes.forEach((fm, idx) => {
        fm.rotation.z = Math.sin(time * 12 + idx) * 0.18;
        fm.scale.y = 1.0 + Math.sin(time * 22 + idx) * 0.25;
      });

      // Violent upward billowing fire embers
      const arr = emberPos;
      const vel = emberVel;
      for (let i = 0; i < emberCount; i++) {
        arr[i * 3] += vel[i * 3] * delta;
        arr[i * 3 + 1] += vel[i * 3 + 1] * delta;
        arr[i * 3 + 2] += vel[i * 3 + 2] * delta;

        if (arr[i * 3 + 1] > 5.0) {
          arr[i * 3] = (Math.random() - 0.5) * 1.8;
          arr[i * 3 + 1] = 0.4 + Math.random() * 0.8;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      // When the 5 seconds are up:
      if (fireTimer >= fireDuration) {
        isInFire = false;
        isDefeated = true;
        flameMaterial.opacity = 0;
        fireLight.intensity = 0;
        darkAuraMaterial.opacity = 0;

        // Disintegrate collapse
        root.scale.set(0.01, 0.01, 0.01);
        root.position.y = -100;

        if (onCompleteCallback) {
          onCompleteCallback();
        }
      }
    }
  };

  return {
    group,
    catchFire,
    defeat,
    reset,
    update,
    get isDefeated() {
      return isDefeated;
    },
    get isInFire() {
      return isInFire;
    },
    get fireTimer() {
      return fireTimer;
    },
  };
}
