import * as THREE from 'three';
import { createFlameParticleTexture } from '../procedural-textures';

export interface SarayuRiver {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the peaceful, sacred Sarayu River Scene
 * Flowing undulating water mesh, floating diyas on leaves, blooming sacred lotus,
 * and stone ghat steps.
 */
export function createSarayuRiver(): SarayuRiver {
  const group = new THREE.Group();
  group.name = 'Sarayu_River_Scene';

  const flameTexture = createFlameParticleTexture();

  // Water Material with deep teal/indigo sheen and realistic surface reflections
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a3d62,
    roughness: 0.12,
    metalness: 0.88,
    transparent: true,
    opacity: 0.92,
  });

  // Animated water plane with subdivisions for gentle undulating waves
  const waterGeo = new THREE.PlaneGeometry(36, 18, 48, 24);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.position.set(0, -0.1, 32); // Positioned in the foreground river basin
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // Stone Ghat Steps at water edge
  const ghatMaterial = new THREE.MeshStandardMaterial({
    color: 0x7f8c8d,
    roughness: 0.8,
  });
  for (let g = 0; g < 4; g++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(34, 0.25, 1.2), ghatMaterial);
    step.position.set(0, -g * 0.2, 23.5 + g * 1.1);
    step.receiveShadow = true;
    group.add(step);
  }

  // Floating Diyas on sacred leaves (Patra) drifting along the current
  interface FloatingDiya {
    mesh: THREE.Group;
    baseX: number;
    baseZ: number;
    speed: number;
    offset: number;
  }
  const floatingDiyas: FloatingDiya[] = [];
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.7 });
  const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.8 });
  const flameMat = new THREE.MeshBasicMaterial({
    map: flameTexture,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 28; i++) {
    const dGroup = new THREE.Group();
    // Broad green leaf base
    const leaf = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 12), leafMat);
    dGroup.add(leaf);

    // Clay diya
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.08, 10), diyaClayMat);
    cup.position.y = 0.05;
    dGroup.add(cup);

    // Glowing flame
    const flame = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.3), flameMat);
    flame.position.y = 0.22;
    dGroup.add(flame);

    const baseX = (Math.random() - 0.5) * 28;
    const baseZ = 26 + Math.random() * 12;
    dGroup.position.set(baseX, 0, baseZ);
    group.add(dGroup);

    floatingDiyas.push({
      mesh: dGroup,
      baseX,
      baseZ,
      speed: 0.15 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2,
    });
  }

  // Sacred Blooming Lotus Flowers (Kamal)
  const lotusMat = new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.4 });
  const lotusCenterMat = new THREE.MeshStandardMaterial({ color: 0xffd32a, roughness: 0.3 });

  for (let l = 0; l < 14; l++) {
    const lotusGroup = new THREE.Group();
    // 8 petals
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 6), lotusMat);
      petal.position.set(Math.cos(angle) * 0.15, 0.08, Math.sin(angle) * 0.15);
      petal.rotation.x = Math.sin(angle) * 0.5;
      petal.rotation.z = -Math.cos(angle) * 0.5;
      lotusGroup.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), lotusCenterMat);
    center.position.y = 0.08;
    lotusGroup.add(center);

    lotusGroup.position.set((Math.random() - 0.5) * 26, 0.02, 27 + Math.random() * 10);
    group.add(lotusGroup);
  }

  const posAttr = waterGeo.attributes.position;
  const initialY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    initialY[i] = posAttr.getY(i);
  }

  const update = (delta: number, time: number) => {
    // 1. Water surface wave simulation
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const wave = Math.sin(x * 0.5 + time * 1.5) * 0.06 + Math.cos(z * 0.6 + time * 1.8) * 0.04;
      posAttr.setY(i, initialY[i] + wave);
    }
    posAttr.needsUpdate = true;
    waterGeo.computeVertexNormals();

    // 2. Floating diyas gentle drift & bobbing
    floatingDiyas.forEach((fd) => {
      // Gentle current moving to the right
      fd.baseX += delta * fd.speed;
      if (fd.baseX > 16) fd.baseX = -16;

      const bobbing = Math.sin(time * 2.0 + fd.offset) * 0.04;
      fd.mesh.position.x = fd.baseX;
      fd.mesh.position.y = bobbing;
      fd.mesh.rotation.z = Math.sin(time * 1.5 + fd.offset) * 0.05;
      fd.mesh.rotation.x = Math.cos(time * 1.5 + fd.offset) * 0.05;
    });
  };

  return {
    group,
    update,
  };
}
