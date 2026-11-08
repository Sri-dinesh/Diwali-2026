import * as THREE from 'three';
import { createRangoliTexture, createFlameParticleTexture } from '../procedural-textures';

export interface RangoliFloor {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the Grand 3D Rangoli floor mandala with corner diyas,
 * glowing concentric geometry, and interactive particle shimmer.
 */
export function createRangoliFloor(): RangoliFloor {
  const group = new THREE.Group();
  group.name = 'Grand_Rangoli_Mandala';

  const rangoliTexture = createRangoliTexture();
  const flameTexture = createFlameParticleTexture();

  // Rangoli Floor Decal Mesh
  const rangoliMat = new THREE.MeshStandardMaterial({
    map: rangoliTexture,
    transparent: true,
    opacity: 0.96,
    roughness: 0.6,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 8.5), rangoliMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 1.22, 17.0); // In the center of the grand palace courtyard
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 8 Corner / Cardinal Brass Diyas around the Rangoli
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.25,
    metalness: 0.9,
  });
  const flameMat = new THREE.MeshBasicMaterial({
    map: flameTexture,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = 4.2;
    const dx = Math.cos(angle) * r;
    const dz = Math.sin(angle) * r;

    const dGroup = new THREE.Group();
    dGroup.position.set(dx, 1.25, 17.0 + dz);

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.1, 0.12, 16), brassMat);
    dGroup.add(cup);

    const flame = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.36), flameMat);
    flame.position.y = 0.22;
    dGroup.add(flame);

    group.add(dGroup);
  }

  // Sparkling golden dust motes rising from the Rangoli
  const sparkleCount = 60;
  const sparkleGeo = new THREE.BufferGeometry();
  const sparklePos = new Float32Array(sparkleCount * 3);
  for (let i = 0; i < sparkleCount; i++) {
    sparklePos[i * 3] = (Math.random() - 0.5) * 8.0;
    sparklePos[i * 3 + 1] = 1.22 + Math.random() * 2.0;
    sparklePos[i * 3 + 2] = 17.0 + (Math.random() - 0.5) * 8.0;
  }
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
  const sparkleMat = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.15,
    color: 0xffeaa7,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  group.add(sparkles);

  const update = (delta: number, time: number) => {
    // Subtle rotation shimmer of the rangoli energy
    floorMesh.rotation.z = Math.sin(time * 0.5) * 0.02;

    // Rising sparkle dust
    const arr = sparklePos;
    for (let i = 0; i < sparkleCount; i++) {
      arr[i * 3 + 1] += delta * 0.35;
      if (arr[i * 3 + 1] > 3.2) {
        arr[i * 3 + 1] = 1.25;
      }
    }
    sparkleGeo.attributes.position.needsUpdate = true;
  };

  return {
    group,
    update,
  };
}
