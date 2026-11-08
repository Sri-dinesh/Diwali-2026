import * as THREE from 'three';
import { createGoldEngravingTexture, createFlameParticleTexture } from '../procedural-textures';

export interface PushpakVimana {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the divine 3D Pushpak Vimana (flying celestial chariot)
 * Sculpted golden swan/peacock prow, multi-tier aerial pavilion,
 * glowing trailing stardust engine, carrying Rama, Sita, Lakshmana, and Hanuman.
 */
export function createPushpakVimana(): PushpakVimana {
  const group = new THREE.Group();
  group.name = 'Pushpak_Vimana_Chariot';

  const goldTexture = createGoldEngravingTexture();
  const flameTexture = createFlameParticleTexture();

  const royalGoldMat = new THREE.MeshStandardMaterial({
    map: goldTexture,
    bumpMap: goldTexture,
    bumpScale: 0.05,
    color: 0xffdf78,
    roughness: 0.2,
    metalness: 0.95,
  });

  const silkCanopyMat = new THREE.MeshStandardMaterial({
    color: 0xe67e22, // Saffron silk
    roughness: 0.65,
    metalness: 0.1,
  });

  const rubyMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3838,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.7,
  });

  // Base Chariot Hull (Boat-like floating celestial vessel)
  const hullGroup = new THREE.Group();
  group.add(hullGroup);

  const hull = new THREE.Mesh(new THREE.ConeGeometry(2.4, 6.5, 16), royalGoldMat);
  hull.rotation.x = Math.PI / 2;
  hull.scale.set(1.2, 0.45, 1.0);
  hullGroup.add(hull);

  // Swan / Hamsa Sculpted Figurehead at the prow
  const prow = new THREE.Group();
  prow.position.set(0, 0.6, 3.4);

  const swanNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.4, 12), royalGoldMat);
  swanNeck.rotation.x = 0.5;
  prow.add(swanNeck);

  const swanHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), royalGoldMat);
  swanHead.position.set(0, 0.8, 0.45);
  prow.add(swanHead);

  const swanBeak = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.45, 8), rubyMat);
  swanBeak.rotation.x = 1.6;
  swanBeak.position.set(0, 0.75, 0.75);
  prow.add(swanBeak);
  hullGroup.add(prow);

  // Celestial Wings on sides
  [-1.8, 1.8].forEach((wx, i) => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.4), royalGoldMat);
    wing.position.set(wx, 0.2, 0);
    wing.rotation.z = (i === 0 ? 1 : -1) * 0.25;
    wing.rotation.y = (i === 0 ? 1 : -1) * 0.2;
    hullGroup.add(wing);
  });

  // Multi-tier Royal Pavilion
  const pavilion = new THREE.Group();
  pavilion.position.set(0, 0.8, 0);

  // 6 Golden Pillars
  for (let p = 0; p < 6; p++) {
    const angle = (p / 6) * Math.PI * 2;
    const px = Math.cos(angle) * 1.2;
    const pz = Math.sin(angle) * 1.8;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12), royalGoldMat);
    pillar.position.set(px, 0.9, pz);
    pavilion.add(pillar);
  }

  // Golden Domed Canopy (Chhatra)
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), silkCanopyMat);
  dome.position.y = 1.8;
  pavilion.add(dome);

  // Finial Spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 12), royalGoldMat);
  spire.position.y = 2.8;
  pavilion.add(spire);

  // Stylized Royal Silhouettes inside the Vimana (Rama, Sita, Lakshmana, Hanuman)
  const passengerMatRama = new THREE.MeshStandardMaterial({ color: 0x3498db });
  const passengerMatSita = new THREE.MeshStandardMaterial({ color: 0xe91e63 });
  const passengerMatLakshmana = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
  const passengerMatHanuman = new THREE.MeshStandardMaterial({ color: 0xe67e22 });

  const passengers = [
    { x: -0.3, z: 0.2, mat: passengerMatRama }, // Lord Rama
    { x: 0.3, z: 0.2, mat: passengerMatSita }, // Sita Devi
    { x: -0.6, z: -0.4, mat: passengerMatLakshmana }, // Lakshmana
    { x: 0.6, z: -0.4, mat: passengerMatHanuman }, // Hanuman
  ];

  passengers.forEach((p) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(p.x, 0.3, p.z);
    const pBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.7, 8), p.mat);
    pBody.position.y = 0.35;
    pGroup.add(pBody);
    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), royalGoldMat);
    pHead.position.y = 0.8;
    pGroup.add(pHead);
    pavilion.add(pGroup);
  });

  hullGroup.add(pavilion);

  // Divine Glowing Halo Light
  const vimanaLight = new THREE.PointLight(0xffdf78, 2.8, 12);
  vimanaLight.position.set(0, 1.2, 0);
  group.add(vimanaLight);

  // Stardust Particle Trail
  const trailCount = 50;
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(trailCount * 3);
  for (let i = 0; i < trailCount; i++) {
    trailPos[i * 3] = (Math.random() - 0.5) * 1.5;
    trailPos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
    trailPos[i * 3 + 2] = -3 - Math.random() * 8;
  }
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailMat = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.25,
    color: 0xffdd66,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const stardustTrail = new THREE.Points(trailGeo, trailMat);
  group.add(stardustTrail);

  const update = (delta: number, time: number) => {
    // Gentle celestial floating wave
    hullGroup.position.y = Math.sin(time * 1.6) * 0.25;
    hullGroup.rotation.z = Math.sin(time * 1.2) * 0.04;
    hullGroup.rotation.x = Math.cos(time * 1.4) * 0.03;

    // Stardust trail drifting backward
    const arr = trailPos;
    for (let i = 0; i < trailCount; i++) {
      arr[i * 3 + 2] -= delta * 6;
      if (arr[i * 3 + 2] < -12) {
        arr[i * 3 + 2] = -3;
        arr[i * 3] = (Math.random() - 0.5) * 1.5;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      }
    }
    trailGeo.attributes.position.needsUpdate = true;
  };

  return {
    group,
    update,
  };
}
