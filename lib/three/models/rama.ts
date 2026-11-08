import * as THREE from 'three';
import { createGoldEngravingTexture, createPeacockFeatherTexture } from '../procedural-textures';
import { createFireBow, FireBowControls } from './fire-bow';

export interface RamaCharacter {
  group: THREE.Group;
  fireBow: FireBowControls;
  aimAtTarget: (target: THREE.Vector3) => void;
  setPose: (pose: 'holding' | 'drawing' | 'released', progress: number) => void;
  update: (delta: number, time: number) => void;
}

/**
 * Creates the ultra-detailed 3D character of Lord Rama
 * Royal heroic physique, divine blue complexion, mukut crown with peacock feather,
 * pitambar saffron silk dhoti, golden armor and ornaments, quiver of arrows,
 * holding the celestial Kodanda fire bow, with dynamic arm kinematics.
 */
export function createRama(): RamaCharacter {
  const group = new THREE.Group();
  group.name = 'Lord_Rama_Hero';

  const goldTexture = createGoldEngravingTexture();
  const peacockTexture = createPeacockFeatherTexture();

  // --- Materials ---
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7c9f, // Divine blue (Neelamegha shyama)
    roughness: 0.45,
    metalness: 0.08,
  });

  const dhotiMaterial = new THREE.MeshStandardMaterial({
    color: 0xf39c12, // Rich saffron
    roughness: 0.68,
    metalness: 0.12,
  });

  const goldClothBorder = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.28,
    metalness: 0.88,
    map: goldTexture,
  });

  const royalGoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdf78,
    roughness: 0.2,
    metalness: 0.95,
    map: goldTexture,
    bumpMap: goldTexture,
    bumpScale: 0.04,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x111119,
    roughness: 0.85,
    metalness: 0.1,
  });

  const rubyJewelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe74c3c,
    roughness: 0.1,
    metalness: 0.3,
    transmission: 0.8,
    thickness: 0.5,
  });

  // Base hierarchy
  const bodyRoot = new THREE.Group();
  group.add(bodyRoot);

  // Legs & Dhoti
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.95, 16), skinMaterial);
  leftLeg.position.set(-0.2, 0.475, 0);
  leftLeg.castShadow = true;
  bodyRoot.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.95, 16), skinMaterial);
  rightLeg.position.set(0.2, 0.475, 0.08);
  rightLeg.castShadow = true;
  bodyRoot.add(rightLeg);

  // Anklets
  [-0.2, 0.2].forEach((x, i) => {
    const anklet = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.02, 12, 24), royalGoldMaterial);
    anklet.rotation.x = Math.PI / 2;
    anklet.position.set(x, 0.1, i === 0 ? 0 : 0.08);
    bodyRoot.add(anklet);
  });

  // Dhoti
  const dhotiMain = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.85, 24), dhotiMaterial);
  dhotiMain.position.set(0, 0.72, 0.03);
  dhotiMain.castShadow = true;
  bodyRoot.add(dhotiMain);

  const pleatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.05, 0.26),
    new THREE.Vector3(0.04, 0.7, 0.3),
    new THREE.Vector3(-0.02, 0.35, 0.32),
  ]);
  const pleat = new THREE.Mesh(new THREE.TubeGeometry(pleatCurve, 16, 0.07, 8, false), goldClothBorder);
  bodyRoot.add(pleat);

  const kamarband = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 16, 32), royalGoldMaterial);
  kamarband.rotation.x = Math.PI / 2;
  kamarband.position.set(0, 1.08, 0);
  bodyRoot.add(kamarband);

  const waistMedallion = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), royalGoldMaterial);
  waistMedallion.rotation.x = Math.PI / 2;
  waistMedallion.position.set(0, 1.08, 0.28);
  const waistGem = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), rubyJewelMaterial);
  waistGem.position.z = 0.02;
  waistMedallion.add(waistGem);
  bodyRoot.add(waistMedallion);

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.1, 0);
  bodyRoot.add(torsoGroup);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 0.65, 20), skinMaterial);
  chest.position.set(0, 0.32, 0);
  chest.castShadow = true;
  torsoGroup.add(chest);

  // Janeu thread
  const janeuCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 0.58, 0.15),
    new THREE.Vector3(-0.05, 0.32, 0.24),
    new THREE.Vector3(0.22, 0.08, 0.2),
    new THREE.Vector3(0.22, 0.08, -0.15),
    new THREE.Vector3(-0.15, 0.42, -0.2),
  ]);
  const janeu = new THREE.Mesh(new THREE.TubeGeometry(janeuCurve, 24, 0.012, 8, true), royalGoldMaterial);
  torsoGroup.add(janeu);

  // Necklace & Pendant
  const necklaceCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0.55, 0.15),
    new THREE.Vector3(0, 0.44, 0.26),
    new THREE.Vector3(0.2, 0.55, 0.15),
  ]);
  const necklace = new THREE.Mesh(new THREE.TubeGeometry(necklaceCurve, 16, 0.03, 8, false), royalGoldMaterial);
  torsoGroup.add(necklace);

  const pendant = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), rubyJewelMaterial);
  pendant.position.set(0, 0.41, 0.27);
  torsoGroup.add(pendant);

  // Sash
  const sashCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.6, -0.05),
    new THREE.Vector3(-0.1, 0.45, 0.22),
    new THREE.Vector3(0.18, 0.25, 0.24),
    new THREE.Vector3(0.28, 0.1, 0.1),
  ]);
  const sash = new THREE.Mesh(new THREE.TubeGeometry(sashCurve, 20, 0.065, 8, false), dhotiMaterial);
  torsoGroup.add(sash);

  // Quiver of Arrows
  const quiverGroup = new THREE.Group();
  quiverGroup.position.set(0.18, 0.42, -0.26);
  quiverGroup.rotation.z = -0.35;
  quiverGroup.rotation.x = 0.2;

  const quiverTube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.75, 16), royalGoldMaterial);
  quiverGroup.add(quiverTube);

  for (let a = 0; a < 6; a++) {
    const angle = (a / 6) * Math.PI * 2;
    const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 8), royalGoldMaterial);
    arrowShaft.position.set(Math.cos(angle) * 0.04, 0.45, Math.sin(angle) * 0.04);
    quiverGroup.add(arrowShaft);

    const fletch = new THREE.Mesh(
      new THREE.ConeGeometry(0.025, 0.1, 6),
      new THREE.MeshStandardMaterial({ color: 0x00cec9, roughness: 0.5 })
    );
    fletch.position.set(Math.cos(angle) * 0.04, 0.62, Math.sin(angle) * 0.04);
    quiverGroup.add(fletch);
  }
  torsoGroup.add(quiverGroup);

  // --- Dynamic Arm Rigging for Pose Sequencing ---
  // Left Arm (Holding Kodanda Bow)
  const leftShoulderPivot = new THREE.Group();
  leftShoulderPivot.position.set(-0.35, 0.55, 0.05);
  torsoGroup.add(leftShoulderPivot);

  const leftShoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), skinMaterial);
  leftShoulderPivot.add(leftShoulderMesh);

  const leftBajuband = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 12, 24), royalGoldMaterial);
  leftBajuband.rotation.x = Math.PI / 2;
  leftBajuband.position.set(0, -0.15, 0);
  leftShoulderPivot.add(leftBajuband);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.55, 16), skinMaterial);
  leftArm.position.set(0, -0.28, 0);
  leftShoulderPivot.add(leftArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMaterial);
  leftHand.position.set(0, -0.58, 0);
  leftShoulderPivot.add(leftHand);

  // Attach Fire Bow to Left Hand
  const fireBow = createFireBow();
  fireBow.group.position.set(0, -0.58, 0.05);
  leftShoulderPivot.add(fireBow.group);

  // Right Arm (Drawing the String & Arrow)
  const rightShoulderPivot = new THREE.Group();
  rightShoulderPivot.position.set(0.35, 0.55, 0.05);
  torsoGroup.add(rightShoulderPivot);

  const rightShoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), skinMaterial);
  rightShoulderPivot.add(rightShoulderMesh);

  const rightBajuband = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 12, 24), royalGoldMaterial);
  rightBajuband.rotation.x = Math.PI / 2;
  rightBajuband.position.set(0, -0.15, 0);
  rightShoulderPivot.add(rightBajuband);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.5, 16), skinMaterial);
  rightArm.position.set(0, -0.25, 0);
  rightShoulderPivot.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMaterial);
  rightHand.position.set(0, -0.52, 0);
  rightShoulderPivot.add(rightHand);

  // Head and Mukut
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.18, 16), skinMaterial);
  neck.position.set(0, 0.7, 0);
  torsoGroup.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.88, 0.03);
  torsoGroup.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), skinMaterial);
  head.scale.set(0.95, 1.15, 1.0);
  head.castShadow = true;
  headGroup.add(head);

  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), hairMaterial);
  hairBack.position.set(0, 0.02, -0.06);
  headGroup.add(hairBack);

  [-0.15, 0.15].forEach((hx) => {
    const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.015, 0.28, 8), hairMaterial);
    lock.position.set(hx, -0.12, 0.02);
    headGroup.add(lock);
  });

  // Tilak
  const tilak = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.01), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  tilak.position.set(0, 0.06, 0.16);
  const tilakRed = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.045, 0.011), new THREE.MeshBasicMaterial({ color: 0xd63031 }));
  tilakRed.position.set(0, 0.05, 0.161);
  headGroup.add(tilak);
  headGroup.add(tilakRed);

  // Earrings
  [-0.165, 0.165].forEach((kx) => {
    const kundal = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 12, 20), royalGoldMaterial);
    kundal.position.set(kx, -0.04, 0);
    headGroup.add(kundal);
  });

  // Mukut
  const mukutGroup = new THREE.Group();
  mukutGroup.position.set(0, 0.14, 0);
  headGroup.add(mukutGroup);

  const mukutBase = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.175, 0.12, 24), royalGoldMaterial);
  mukutGroup.add(mukutBase);

  const mukutMid = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.18, 24), royalGoldMaterial);
  mukutMid.position.y = 0.14;
  mukutGroup.add(mukutMid);

  const mukutSpire = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 16), royalGoldMaterial);
  mukutSpire.position.y = 0.35;
  mukutGroup.add(mukutSpire);

  const crownRuby = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), rubyJewelMaterial);
  crownRuby.position.set(0, 0.12, 0.16);
  mukutGroup.add(crownRuby);

  const kalasha = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), royalGoldMaterial);
  kalasha.position.y = 0.5;
  mukutGroup.add(kalasha);

  // Peacock Feather
  const featherGroup = new THREE.Group();
  featherGroup.position.set(0.05, 0.35, 0.1);
  featherGroup.rotation.z = -0.35;
  featherGroup.rotation.x = -0.2;

  const featherMat = new THREE.MeshBasicMaterial({
    map: peacockTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const featherMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.44), featherMat);
  featherMesh.position.y = 0.2;
  featherGroup.add(featherMesh);
  mukutGroup.add(featherGroup);

  // Halo
  const haloGeo = new THREE.RingGeometry(0.25, 0.45, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.set(0, 0.05, -0.15);
  headGroup.add(halo);

  const divineLight = new THREE.PointLight(0xfff3cc, 1.8, 6);
  divineLight.position.set(0, 1.5, 0.5);
  group.add(divineLight);

  // Arm Kinematics & Posing
  const setPose = (pose: 'holding' | 'drawing' | 'released', progress: number) => {
    const p = THREE.MathUtils.clamp(progress, 0, 1);

    if (pose === 'holding') {
      // Direct poised holding pose: Left arm holding Kodanda bow, right arm at side
      leftShoulderPivot.rotation.x = -0.35;
      leftShoulderPivot.rotation.y = -0.2;
      leftShoulderPivot.rotation.z = 0.1;

      rightShoulderPivot.rotation.x = -0.2;
      rightShoulderPivot.rotation.y = 0.15;
      rightShoulderPivot.rotation.z = -0.1;

      fireBow.group.rotation.x = 0.35;
      fireBow.group.rotation.y = 0.15;
      fireBow.group.rotation.z = 0.0;
      fireBow.drawBow(0);
    } else if (pose === 'drawing') {
      // Dynamic ready-to-shoot drawing pose:
      // Left arm raises forward firmly towards Ravana
      leftShoulderPivot.rotation.x = THREE.MathUtils.lerp(-0.35, -1.48, p);
      leftShoulderPivot.rotation.y = THREE.MathUtils.lerp(-0.2, -0.12, p);
      leftShoulderPivot.rotation.z = THREE.MathUtils.lerp(0.1, -0.05, p);

      // Right arm raises and draws backward towards the ear/cheek
      rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(-0.2, -1.42, p);
      rightShoulderPivot.rotation.y = THREE.MathUtils.lerp(0.15, 0.45, p);
      rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(-0.1, 0.15, p);

      // Bow compensates shoulder rotation so arrow points horizontally straight forward at Ravana
      fireBow.group.rotation.x = THREE.MathUtils.lerp(0.35, 1.48, p);
      fireBow.group.rotation.y = THREE.MathUtils.lerp(0.15, 0.05, p);
      fireBow.group.rotation.z = 0;
      fireBow.drawBow(p);
    } else if (pose === 'released') {
      // Recoil on arrow release:
      // Right hand springs forward slightly as string snaps
      rightShoulderPivot.rotation.x = -1.35;
      rightShoulderPivot.rotation.y = 0.35;
      // Left arm absorbs recoil
      leftShoulderPivot.rotation.x = -1.52;
      fireBow.group.rotation.x = 1.52;
    }
  };

  // Set default initial holding pose
  setPose('holding', 1.0);

  const aimAtTarget = (target: THREE.Vector3) => {
    group.lookAt(target.x, group.position.y, target.z);
  };

  const update = (delta: number, time: number) => {
    const breath = Math.sin(time * 1.8) * 0.025;
    torsoGroup.position.y = 1.1 + breath * 0.5;
    chest.scale.set(1 + breath * 0.4, 1, 1 + breath * 0.5);

    featherGroup.rotation.z = -0.35 + Math.sin(time * 2.8) * 0.08;
    featherGroup.rotation.x = -0.2 + Math.cos(time * 2.2) * 0.06;

    pleat.rotation.y = Math.sin(time * 2.4) * 0.05;
    halo.rotation.z = time * 0.2;

    fireBow.update(delta, time);
  };

  return {
    group,
    fireBow,
    aimAtTarget,
    setPose,
    update,
  };
}
