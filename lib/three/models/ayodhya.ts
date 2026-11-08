import * as THREE from 'three';
import { createSandstoneTexture, createGoldEngravingTexture } from '../procedural-textures';

export interface AyodhyaPalace {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the majestic ultra-realistic 3D Ayodhya Palace Kingdom
 * Multi-tier carved sandstone pillars, golden shikharas, ornate jharokhas,
 * torans with marigold garlands, grand palace stairs, and fluttering royal flags.
 */
export function createAyodhyaKingdom(): AyodhyaPalace {
  const group = new THREE.Group();
  group.name = 'Ayodhya_Kingdom_Palace';

  const sandstoneTexture = createSandstoneTexture();
  const goldTexture = createGoldEngravingTexture();

  // Materials
  const sandstoneMaterial = new THREE.MeshStandardMaterial({
    map: sandstoneTexture,
    bumpMap: sandstoneTexture,
    bumpScale: 0.08,
    roughness: 0.72,
    metalness: 0.08,
  });

  const goldSpireMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    bumpMap: goldTexture,
    bumpScale: 0.04,
    color: 0xffd700,
    roughness: 0.22,
    metalness: 0.94,
    envMapIntensity: 1.6,
  });

  const marigoldGarlandMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9900,
    roughness: 0.85,
    metalness: 0.05,
  });

  const bannerMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9534f, // Royal red/saffron flag
    roughness: 0.7,
    side: THREE.DoubleSide,
  });

  // --- 1. Grand Foundation Plinth & Steps (Jagati) ---
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(32, 1.2, 28), sandstoneMaterial);
  plinth.position.set(0, 0.6, 0);
  plinth.receiveShadow = true;
  group.add(plinth);

  // Grand Cascading Front Steps (Sopana)
  for (let s = 0; s < 6; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(16 - s * 0.4, 0.2, 1.2), sandstoneMaterial);
    step.position.set(0, s * 0.2 + 0.1, 14 + (6 - s) * 1.1);
    step.receiveShadow = true;
    group.add(step);
  }

  // --- 2. Main Central Royal Palace Sanctum (Mandapa) ---
  const centralHall = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 14), sandstoneMaterial);
  centralHall.position.set(0, 4.7, 0);
  centralHall.castShadow = true;
  centralHall.receiveShadow = true;
  group.add(centralHall);

  // Upper Terrace Plinth
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(15, 0.6, 15), sandstoneMaterial);
  terrace.position.set(0, 8.5, 0);
  group.add(terrace);

  // Second Tier Pavilions
  const secondTier = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 10), sandstoneMaterial);
  secondTier.position.set(0, 11, 0);
  secondTier.castShadow = true;
  group.add(secondTier);

  // --- 3. Majestic Golden Shikharas (Temple Domes & Spires) ---
  // Central Great Shikhara
  const shikharaBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.5, 5.5, 24), sandstoneMaterial);
  shikharaBase.position.set(0, 15.5, 0);
  group.add(shikharaBase);

  // Golden Ribbed Dome (Amalaka)
  const amalaka = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.8, 16, 32), goldSpireMaterial);
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.set(0, 18.5, 0);
  group.add(amalaka);

  // Supreme Golden Finial Kalasha (Spire Peak)
  const kalashaSpire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.5, 20), goldSpireMaterial);
  kalashaSpire.position.set(0, 21.2, 0);
  kalashaSpire.castShadow = true;
  group.add(kalashaSpire);

  // 4 Corner Golden Shikharas
  const cornerOffsets = [
    [-5, -5],
    [5, -5],
    [-5, 5],
    [5, 5],
  ];
  cornerOffsets.forEach(([cx, cz]) => {
    const cTower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 4.2, 16), sandstoneMaterial);
    cTower.position.set(cx, 10.5, cz);
    group.add(cTower);

    const cSpire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 16), goldSpireMaterial);
    cSpire.position.set(cx, 14.2, cz);
    group.add(cSpire);
  });

  // --- 4. Intricate Carved Pillars (Stambha) & Royal Colonnade ---
  const pillarPositions: [number, number][] = [];
  for (let x = -6.5; x <= 6.5; x += 3.25) {
    pillarPositions.push([x, 7.5]); // Front porch colonnade
  }
  for (let x = -6.5; x <= 6.5; x += 13.0) {
    for (let z = -6.5; z <= 6.5; z += 3.25) {
      pillarPositions.push([x, z]); // Side colonnades
    }
  }

  pillarPositions.forEach(([px, pz]) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(px, 1.2, pz);

    // Carved square base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), sandstoneMaterial);
    base.position.y = 0.3;
    pillarGroup.add(base);

    // Fluted shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 6.0, 16), sandstoneMaterial);
    shaft.position.y = 3.6;
    shaft.castShadow = true;
    pillarGroup.add(shaft);

    // Ornate capital bracket with lotus motif
    const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.35, 0.7, 8), sandstoneMaterial);
    capital.position.y = 6.95;
    pillarGroup.add(capital);

    group.add(pillarGroup);
  });

  // --- 5. Royal Torans (Arched Gateways) & Entrance Archway ---
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 1.2, 7.6);

  // Grand arched entrance opening
  const portalLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 0.8), sandstoneMaterial);
  portalLeft.position.set(-2.8, 2.75, 0);
  const portalRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 0.8), sandstoneMaterial);
  portalRight.position.set(2.8, 2.75, 0);
  archGroup.add(portalLeft);
  archGroup.add(portalRight);

  // Ornate Makara Toran Arch Beam
  const toranBeam = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.2, 1.2), sandstoneMaterial);
  toranBeam.position.set(0, 6.0, 0);
  archGroup.add(toranBeam);

  // Hanging Marigold Garlands draping the entrance
  const garlandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, 5.4, 0.5),
    new THREE.Vector3(-1.3, 4.2, 0.6),
    new THREE.Vector3(0, 4.8, 0.65),
    new THREE.Vector3(1.3, 4.2, 0.6),
    new THREE.Vector3(2.6, 5.4, 0.5),
  ]);
  const garland = new THREE.Mesh(new THREE.TubeGeometry(garlandCurve, 32, 0.09, 8, false), marigoldGarlandMaterial);
  archGroup.add(garland);

  group.add(archGroup);

  // --- 6. Ornate Balconies & Jharokhas ---
  [-4.8, 4.8].forEach((jx) => {
    const jharokha = new THREE.Group();
    jharokha.position.set(jx, 5.2, 7.2);

    // Projected balcony base
    const jBase = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.0, 8), sandstoneMaterial);
    jBase.rotation.x = Math.PI;
    jharokha.add(jBase);

    // Lattice rail (Jaali)
    const jRail = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 1.1, 12, 1, true), sandstoneMaterial);
    jRail.position.y = 0.55;
    jharokha.add(jRail);

    // Golden miniature dome canopy
    const jCanopy = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 12), goldSpireMaterial);
    jCanopy.position.y = 2.1;
    jharokha.add(jCanopy);

    group.add(jharokha);
  });

  // --- 7. Royal Flags & Banners (Fluttering in the Wind) ---
  const banners: THREE.Mesh[] = [];
  const flagPoints = [
    [-6.5, 9.0, 7.5],
    [6.5, 9.0, 7.5],
    [0, 23.5, 0],
    [-7, 9.0, -7],
    [7, 9.0, -7],
  ];

  flagPoints.forEach(([fx, fy, fz]) => {
    // Flag pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8), goldSpireMaterial);
    pole.position.set(fx, fy + 1.75, fz);
    group.add(pole);

    // Pennant Flag (Triangular royal dhwaja)
    const flagGeom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 1.5, 0,
      1.8, 1.0, 0,
      0, 0.5, 0,
    ]);
    flagGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    flagGeom.computeVertexNormals();

    const bannerMesh = new THREE.Mesh(flagGeom, bannerMaterial);
    bannerMesh.position.set(fx, fy + 1.2, fz);
    group.add(bannerMesh);
    banners.push(bannerMesh);
  });

  // --- 8. Warm Interior Sanctum Illumination ---
  const interiorLight = new THREE.PointLight(0xffaa33, 3.5, 18);
  interiorLight.position.set(0, 4.5, 3.0);
  group.add(interiorLight);

  const update = (delta: number, time: number) => {
    // Animate fluttering royal banners
    banners.forEach((banner, idx) => {
      banner.rotation.y = Math.sin(time * 3.5 + idx) * 0.25;
      banner.rotation.z = Math.cos(time * 2.8 + idx) * 0.08;
    });
  };

  return {
    group,
    update,
  };
}
