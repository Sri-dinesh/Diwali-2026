import * as THREE from 'three';
import { createTerracottaTexture, createFlameParticleTexture } from '../procedural-textures';

export interface DiyasSystem {
  group: THREE.Group;
  heroDiyaGroup: THREE.Group;
  lightKingdom: () => void;
  resetKingdom: () => void;
  isLit: boolean;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the Diyas System:
 * - InstancedMesh of hundreds of terracotta oil lamps distributed across the kingdom
 * - Interactive Hero Diya in the foreground
 * - Chain-reaction progressive flame ignition spreading across the entire kingdom!
 */
export function createDiyasSystem(): DiyasSystem {
  const group = new THREE.Group();
  group.name = 'Diyas_System_Group';

  const terracottaTexture = createTerracottaTexture();
  const flameTexture = createFlameParticleTexture();

  // Materials
  const clayMaterial = new THREE.MeshStandardMaterial({
    map: terracottaTexture,
    bumpMap: terracottaTexture,
    bumpScale: 0.05,
    roughness: 0.75,
    metalness: 0.1,
  });

  const flameMaterial = new THREE.MeshBasicMaterial({
    map: flameTexture,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // --- 1. Instanced Mesh for Kingdom Diyas ---
  const diyaCount = 350;
  // Diya cup geometry
  const cupGeo = new THREE.CylinderGeometry(0.12, 0.06, 0.08, 12);
  const instancedCups = new THREE.InstancedMesh(cupGeo, clayMaterial, diyaCount);
  instancedCups.castShadow = false;
  instancedCups.receiveShadow = true;

  // Instanced Flames (represented as vertical flame planes)
  const flameGeo = new THREE.PlaneGeometry(0.14, 0.28);
  flameGeo.translate(0, 0.14, 0); // Bottom-center pivot
  const instancedFlames = new THREE.InstancedMesh(flameGeo, flameMaterial, diyaCount);

  // Store diya coordinates and distances from center for progressive chain-reaction lighting
  interface DiyaInfo {
    matrix: THREE.Matrix4;
    pos: THREE.Vector3;
    dist: number;
    currentScale: number;
    targetScale: number;
  }
  const diyaInfos: DiyaInfo[] = [];

  const dummy = new THREE.Object3D();
  let index = 0;

  // Layout positions:
  // a) Along palace cascading steps
  for (let s = 0; s < 6; s++) {
    const stepZ = 14 + (6 - s) * 1.1;
    const stepY = s * 0.2 + 0.24;
    for (let x = -7.5; x <= 7.5; x += 0.9) {
      if (index >= diyaCount) break;
      const pos = new THREE.Vector3(x, stepY, stepZ);
      dummy.position.copy(pos);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, (Math.random() - 0.5) * 0.4, 0);
      dummy.updateMatrix();

      instancedCups.setMatrixAt(index, dummy.matrix);
      diyaInfos.push({
        matrix: dummy.matrix.clone(),
        pos: pos.clone(),
        dist: Math.hypot(pos.x, pos.z),
        currentScale: 0.0, // starts unlit in early chapters
        targetScale: 0.0,
      });
      index++;
    }
  }

  // b) Along palace balustrades and plaza borders
  for (let a = 0; a < Math.PI * 2; a += 0.08) {
    if (index >= diyaCount) break;
    const r = 9.5 + (Math.sin(a * 4) > 0 ? 3.0 : 0);
    const px = Math.cos(a) * r;
    const pz = Math.sin(a) * r + 2;
    const py = 1.25;
    const pos = new THREE.Vector3(px, py, pz);
    dummy.position.copy(pos);
    dummy.updateMatrix();

    instancedCups.setMatrixAt(index, dummy.matrix);
    diyaInfos.push({
      matrix: dummy.matrix.clone(),
      pos: pos.clone(),
      dist: Math.hypot(pos.x, pos.z),
      currentScale: 0.0,
      targetScale: 0.0,
    });
    index++;
  }

  instancedCups.instanceMatrix.needsUpdate = true;
  group.add(instancedCups);
  group.add(instancedFlames);

  // --- 2. Interactive Hero Diya (Foreground) ---
  const heroDiyaGroup = new THREE.Group();
  heroDiyaGroup.name = 'Interactive_Hero_Diya';
  heroDiyaGroup.position.set(0, 0.4, 21.0); // Right in front of camera

  // Larger handcrafted ornate bronze/terracotta diya
  const heroCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.32, 0.28, 24),
    clayMaterial
  );
  heroCup.castShadow = true;
  heroDiyaGroup.add(heroCup);

  // Golden lotus rim
  const heroRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.06, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.9 })
  );
  heroRim.rotation.x = Math.PI / 2;
  heroRim.position.y = 0.12;
  heroDiyaGroup.add(heroRim);

  // Hero Diya Wick
  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.9 })
  );
  wick.position.set(0, 0.18, 0.12);
  heroDiyaGroup.add(wick);

  // Hero Diya Flame (Dynamic Scale)
  const heroFlame = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.9),
    flameMaterial
  );
  heroFlame.position.set(0, 0.55, 0.12);
  heroDiyaGroup.add(heroFlame);

  // Hero Diya Warm Point Light
  const heroLight = new THREE.PointLight(0xff7700, 0.0, 15);
  heroLight.position.set(0, 0.7, 0.2);
  heroDiyaGroup.add(heroLight);

  group.add(heroDiyaGroup);

  // Overall Kingdom Ambient Golden Radiance Light
  const kingdomRadiance = new THREE.PointLight(0xff9900, 0.0, 45);
  kingdomRadiance.position.set(0, 5, 12);
  group.add(kingdomRadiance);

  let isLit = false;
  let lightingProgress = 0;

  const lightKingdom = () => {
    isLit = true;
    lightingProgress = 0;
  };

  const resetKingdom = () => {
    isLit = false;
    lightingProgress = 0;
    heroFlame.scale.set(0, 0, 0);
    heroLight.intensity = 0;
    kingdomRadiance.intensity = 0;
    diyaInfos.forEach((info) => {
      info.currentScale = 0;
      info.targetScale = 0;
    });
  };

  const update = (delta: number, time: number) => {
    if (isLit) {
      lightingProgress += delta * 12; // Progress radius expanding outward

      // Light hero diya first
      const heroTargetScale = 1.0 + Math.sin(time * 12) * 0.08;
      heroFlame.scale.lerp(new THREE.Vector3(heroTargetScale, heroTargetScale, heroTargetScale), delta * 4);
      heroFlame.rotation.y = time * 0.5;
      heroLight.intensity = THREE.MathUtils.lerp(heroLight.intensity, 2.5, delta * 3);
      kingdomRadiance.intensity = THREE.MathUtils.lerp(kingdomRadiance.intensity, 4.5, delta * 1.5);

      // Chain reaction lighting for instanced kingdom diyas
      let updateNeeded = false;
      for (let i = 0; i < diyaInfos.length; i++) {
        const info = diyaInfos[i];
        if (lightingProgress >= info.dist) {
          info.targetScale = 1.0;
        }
        if (info.currentScale !== info.targetScale) {
          info.currentScale = THREE.MathUtils.lerp(info.currentScale, info.targetScale, delta * 5);
          updateNeeded = true;
        }

        // Apply flicker
        const flicker = 1.0 + Math.sin(time * 10 + i) * 0.12;
        const s = info.currentScale * flicker;

        dummy.position.copy(info.pos);
        dummy.position.y += 0.08; // Flame sits on top of cup
        dummy.scale.set(s, s, s);
        dummy.rotation.set(0, time * 0.3 + i * 0.1, 0);
        dummy.updateMatrix();
        instancedFlames.setMatrixAt(i, dummy.matrix);
      }
      instancedFlames.instanceMatrix.needsUpdate = true;
    }
  };

  return {
    group,
    heroDiyaGroup,
    lightKingdom,
    resetKingdom,
    get isLit() {
      return isLit;
    },
    update,
  };
}
