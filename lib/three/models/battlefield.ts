import * as THREE from 'three';
import { createFlameParticleTexture } from '../procedural-textures';

export interface LankaBattlefield {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the dramatic Lanka Battlefield scene
 * Volcanic jagged crags, glowing lava fissures, scattered battle shields and spears,
 * and rising ash and fire embers.
 */
export function createLankaBattlefield(): LankaBattlefield {
  const group = new THREE.Group();
  group.name = 'Lanka_Battlefield_Scene';

  const flameTexture = createFlameParticleTexture();

  // Dark obsidian/volcanic rock material
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e1515,
    roughness: 0.9,
    metalness: 0.2,
  });

  const bronzeShieldMat = new THREE.MeshStandardMaterial({
    color: 0x9c6644,
    roughness: 0.4,
    metalness: 0.8,
  });

  // Base Rocky Terrain (set in the Lanka battle arena at Z = -24)
  const groundGeo = new THREE.CylinderGeometry(18, 22, 1.5, 24);
  const groundMesh = new THREE.Mesh(groundGeo, rockMaterial);
  groundMesh.position.set(0, -0.75, -26);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // Jagged Rock Crags around the perimeter
  for (let r = 0; r < 14; r++) {
    const angle = (r / 14) * Math.PI * 2;
    const dist = 14 + Math.random() * 4;
    const cragHeight = 3.5 + Math.random() * 5.0;

    const crag = new THREE.Mesh(
      new THREE.ConeGeometry(1.2 + Math.random() * 1.5, cragHeight, 5),
      rockMaterial
    );
    crag.position.set(Math.cos(angle) * dist, cragHeight / 2 - 0.75, -26 + Math.sin(angle) * dist);
    crag.rotation.y = Math.random() * Math.PI;
    crag.rotation.z = (Math.random() - 0.5) * 0.3;
    crag.castShadow = true;
    group.add(crag);
  }

  // Glowing Fiery Fissure Cracks
  const lavaMat = new THREE.MeshBasicMaterial({
    color: 0xff3800,
    transparent: true,
    opacity: 0.85,
  });
  for (let f = 0; f < 6; f++) {
    const fissure = new THREE.Mesh(
      new THREE.BoxGeometry(0.3 + Math.random() * 0.2, 0.05, 4 + Math.random() * 4),
      lavaMat
    );
    fissure.position.set((Math.random() - 0.5) * 16, 0.02, -26 + (Math.random() - 0.5) * 12);
    fissure.rotation.y = Math.random() * Math.PI;
    group.add(fissure);
  }

  // Scattered Ancient Battle Shields & Spears
  for (let s = 0; s < 8; s++) {
    // Shield
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 16), bronzeShieldMat);
    shield.position.set((Math.random() - 0.5) * 14, 0.04, -26 + (Math.random() - 0.5) * 10);
    shield.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
    shield.rotation.z = Math.random() * Math.PI;
    group.add(shield);

    // Spear
    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8), bronzeShieldMat);
    spear.position.set((Math.random() - 0.5) * 14, 0.6, -26 + (Math.random() - 0.5) * 10);
    spear.rotation.z = 0.8 + (Math.random() - 0.5) * 0.4;
    group.add(spear);
  }

  // Rising Battle Embers
  const emberCount = 50;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(emberCount * 3);
  for (let i = 0; i < emberCount; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 20;
    emberPos[i * 3 + 1] = Math.random() * 8;
    emberPos[i * 3 + 2] = -26 + (Math.random() - 0.5) * 20;
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  const emberMat = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.22,
    color: 0xff4500,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const embers = new THREE.Points(emberGeo, emberMat);
  group.add(embers);

  const update = (delta: number) => {
    const arr = emberPos;
    for (let i = 0; i < emberCount; i++) {
      arr[i * 3 + 1] += delta * 1.2;
      if (arr[i * 3 + 1] > 8.0) {
        arr[i * 3 + 1] = 0.1;
      }
    }
    emberGeo.attributes.position.needsUpdate = true;
  };

  return {
    group,
    update,
  };
}
