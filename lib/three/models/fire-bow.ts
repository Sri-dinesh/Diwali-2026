import * as THREE from 'three';
import { createGoldEngravingTexture, createFlameParticleTexture, createSanskritMantraTexture } from '../procedural-textures';

export interface FireBowControls {
  group: THREE.Group;
  arrowGroup: THREE.Group;
  drawBow: (drawRatio: number) => void;
  fireArrow: (target: THREE.Vector3, onHit?: () => void) => void;
  update: (delta: number, time: number) => void;
  isFiring: boolean;
}

/**
 * Creates the ultra-detailed celestial bow (Kodanda) and Agni Astra (Fire Arrow)
 * with golden carvings, ruby insets, glowing bowstring, trailing fire embers,
 * concentrated needle-point flame, and glowing Sanskrit mantra aura.
 */
export function createFireBow(): FireBowControls {
  const group = new THREE.Group();
  group.name = 'Kodanda_Bow_Group';

  const goldTexture = createGoldEngravingTexture();
  const flameTexture = createFlameParticleTexture();
  const mantraTexture = createSanskritMantraTexture('ॐ श्री रामाय नमः');

  // Materials
  const goldBowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdf6d,
    roughness: 0.22,
    metalness: 0.92,
    map: goldTexture,
    bumpMap: goldTexture,
    bumpScale: 0.05,
    envMapIntensity: 1.5,
  });

  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a1b1b,
    roughness: 0.65,
    metalness: 0.15,
  });

  const rubyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd63031,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.7,
    thickness: 0.5,
    emissive: 0x550000,
    emissiveIntensity: 0.6,
  });

  const bowAuraMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa502,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  // Central Grip
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16), gripMaterial);
  grip.castShadow = true;
  group.add(grip);

  for (let y = -0.15; y <= 0.15; y += 0.075) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.012, 12, 24), goldBowMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  }

  const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), goldBowMaterial);
  medallion.rotation.x = Math.PI / 2;
  const gem = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), rubyMaterial);
  gem.position.z = 0.025;
  medallion.add(gem);
  group.add(medallion);

  // Recurve Limbs
  const limbPointsUpper: THREE.Vector3[] = [];
  const limbPointsLower: THREE.Vector3[] = [];
  const segments = 24;
  const bowHeight = 1.35;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = 0.175 + t * (bowHeight - 0.175);
    const z = Math.sin(t * Math.PI * 0.9) * 0.32 - Math.pow(t, 2.5) * 0.18;
    limbPointsUpper.push(new THREE.Vector3(0, y, z));
    limbPointsLower.push(new THREE.Vector3(0, -y, z));
  }

  const upperCurve = new THREE.CatmullRomCurve3(limbPointsUpper);
  const lowerCurve = new THREE.CatmullRomCurve3(limbPointsLower);

  const upperLimb = new THREE.Mesh(new THREE.TubeGeometry(upperCurve, 32, 0.038, 12, false), goldBowMaterial);
  const lowerLimb = new THREE.Mesh(new THREE.TubeGeometry(lowerCurve, 32, 0.038, 12, false), goldBowMaterial);
  upperLimb.castShadow = true;
  lowerLimb.castShadow = true;
  group.add(upperLimb);
  group.add(lowerLimb);

  [limbPointsUpper[segments], limbPointsLower[segments]].forEach((tipPos, idx) => {
    const tipGroup = new THREE.Group();
    tipGroup.position.copy(tipPos);
    tipGroup.rotation.x = idx === 0 ? 0.3 : -0.3;

    const tipSpire = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 12), goldBowMaterial);
    tipSpire.position.y = idx === 0 ? 0.08 : -0.08;
    tipSpire.rotation.x = idx === 0 ? 0 : Math.PI;
    tipGroup.add(tipSpire);

    const tipGem = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), rubyMaterial);
    tipGroup.add(tipGem);
    group.add(tipGroup);
  });

  const upperAura = new THREE.Mesh(new THREE.TubeGeometry(upperCurve, 24, 0.055, 8, false), bowAuraMaterial);
  const lowerAura = new THREE.Mesh(new THREE.TubeGeometry(lowerCurve, 24, 0.055, 8, false), bowAuraMaterial);
  group.add(upperAura);
  group.add(lowerAura);

  // Bowstring
  const stringMaterial = new THREE.MeshBasicMaterial({
    color: 0xfffae6,
    transparent: true,
    opacity: 0.95,
  });

  const tipTop = limbPointsUpper[segments];
  const tipBottom = limbPointsLower[segments];

  const stringGeom = new THREE.BufferGeometry();
  const stringPositions = new Float32Array(3 * 3);
  stringGeom.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3));
  const bowString = new THREE.Line(stringGeom, stringMaterial);
  group.add(bowString);

  // --- The Fire Arrow (Agni Astra) ---
  const arrowGroup = new THREE.Group();
  arrowGroup.name = 'Agni_Astra_Arrow';

  const shaftGeom = new THREE.CylinderGeometry(0.012, 0.012, 1.1, 12);
  shaftGeom.rotateX(Math.PI / 2);
  const arrowShaft = new THREE.Mesh(shaftGeom, goldBowMaterial);
  arrowGroup.add(arrowShaft);

  // Arrowhead
  const headGeom = new THREE.ConeGeometry(0.045, 0.18, 8);
  headGeom.rotateX(-Math.PI / 2);
  const arrowHead = new THREE.Mesh(
    headGeom,
    new THREE.MeshStandardMaterial({
      color: 0xff3838,
      emissive: 0xff793f,
      emissiveIntensity: 1.5,
      roughness: 0.15,
      metalness: 0.95,
    })
  );
  arrowHead.position.z = 0.58;
  arrowGroup.add(arrowHead);

  // Concentrated Blazing Needle-Point Fire Flame
  const tipFlameMat = new THREE.MeshBasicMaterial({
    map: flameTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const tipFlameMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.75), tipFlameMat);
  tipFlameMesh.position.set(0, 0, 0.72);
  tipFlameMesh.rotation.y = Math.PI / 2;
  arrowGroup.add(tipFlameMesh);

  const tipFlameMesh2 = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.75), tipFlameMat);
  tipFlameMesh2.position.set(0, 0, 0.72);
  arrowGroup.add(tipFlameMesh2);

  // Fletchings
  for (let f = 0; f < 3; f++) {
    const angle = (f * Math.PI * 2) / 3;
    const fletch = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.045, 0.14), goldBowMaterial);
    fletch.position.set(Math.cos(angle) * 0.022, Math.sin(angle) * 0.022, -0.45);
    fletch.rotation.z = angle;
    arrowGroup.add(fletch);
  }

  // Sanskrit Mantra Aura
  const mantraMat = new THREE.SpriteMaterial({
    map: mantraTexture,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const mantraSprite = new THREE.Sprite(mantraMat);
  mantraSprite.scale.set(1.4, 0.35, 1);
  mantraSprite.position.set(0, 0.18, 0.1);
  arrowGroup.add(mantraSprite);

  // Flaming Arrow Point Light
  const arrowLight = new THREE.PointLight(0xff5e00, 0.0, 10);
  arrowLight.position.set(0, 0, 0.7);
  arrowGroup.add(arrowLight);

  // Fire Particles System
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleAges = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 0.1;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    particlePositions[i * 3 + 2] = 0.5 - Math.random() * 0.9;
    particleSizes[i] = 0.1 + Math.random() * 0.18;
    particleAges[i] = Math.random();
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.28,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xff8800,
  });
  const fireParticles = new THREE.Points(particleGeo, particleMat);
  arrowGroup.add(fireParticles);

  group.add(arrowGroup);

  const updateStringPosition = (nockZ: number) => {
    const pos = stringPositions;
    pos[0] = tipTop.x;
    pos[1] = tipTop.y;
    pos[2] = tipTop.z;
    pos[3] = 0;
    pos[4] = 0;
    pos[5] = nockZ;
    pos[6] = tipBottom.x;
    pos[7] = tipBottom.y;
    pos[8] = tipBottom.z;
    stringGeom.attributes.position.needsUpdate = true;
  };
  updateStringPosition(0.08);

  let currentDraw = 0;
  let isFiring = false;
  let flightProgress = 0;
  let flightStart = new THREE.Vector3();
  let flightTarget = new THREE.Vector3();
  let flightTargetLocal = new THREE.Vector3();
  const _flightPos = new THREE.Vector3();
  let onHitCallback: (() => void) | undefined;

  const drawBow = (drawRatio: number) => {
    currentDraw = THREE.MathUtils.clamp(drawRatio, 0, 1);
    const nockZ = 0.08 - currentDraw * 0.38;
    updateStringPosition(nockZ);

    if (!isFiring) {
      arrowGroup.position.set(0, 0, nockZ + 0.45);

      // NEEDLE POINT FIRE: Ignites fiercely as the bow is drawn
      tipFlameMat.opacity = currentDraw > 0.05 ? currentDraw * 0.95 : 0;
      particleMat.opacity = currentDraw > 0.05 ? currentDraw * 0.9 : 0;
      tipFlameMesh.scale.set(currentDraw, currentDraw * 1.2, currentDraw);
      tipFlameMesh2.scale.set(currentDraw, currentDraw * 1.2, currentDraw);

      arrowLight.intensity = currentDraw * 4.5;
      mantraSprite.material.opacity = currentDraw > 0.1 ? currentDraw * 0.95 : 0;
    }
  };

  const fireArrow = (target: THREE.Vector3, onHit?: () => void) => {
    isFiring = true;
    flightProgress = 0;
    onHitCallback = onHit;
    flightStart.copy(arrowGroup.position);
    group.localToWorld(flightStart);
    flightTarget.copy(target);

    // Keep tip flame raging during flight
    tipFlameMat.opacity = 1.0;
    particleMat.opacity = 0.9;
    arrowLight.intensity = 5.0;
    mantraSprite.material.opacity = 1.0;

    // Precompute target in local space once — Ravana doesn't move during battle
    flightTargetLocal.copy(flightTarget);
    try { group.worldToLocal(flightTargetLocal); } catch { flightTargetLocal.copy(flightTarget); }
  };

  const update = (delta: number, time: number) => {
    const auraPulse = Math.sin(time * 3.5) * 0.1 + 0.35;
    bowAuraMaterial.opacity = auraPulse;

    // Fluttering needle tip flame
    if (currentDraw > 0.05 || isFiring) {
      tipFlameMesh.rotation.z = Math.sin(time * 20) * 0.2;
      tipFlameMesh2.rotation.z = Math.cos(time * 20) * 0.2;
    }

    // Fire particles animation
    const posArr = particlePositions;
    for (let i = 0; i < particleCount; i++) {
      particleAges[i] += delta * 3.0;
      if (particleAges[i] > 1) {
        particleAges[i] = 0;
        posArr[i * 3] = (Math.random() - 0.5) * 0.08;
        posArr[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
        posArr[i * 3 + 2] = 0.65;
      } else {
        posArr[i * 3 + 2] -= delta * 2.2;
        posArr[i * 3 + 1] += delta * 0.2;
      }
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Flight kinematics
    if (isFiring) {
      flightProgress += delta * 1.8;
      if (flightProgress >= 1) {
        isFiring = false;
        flightProgress = 1;
        arrowGroup.position.set(0, 0, 0.08 + 0.45);
        updateStringPosition(0.08);
        drawBow(0);
        if (onHitCallback) onHitCallback();
      } else {
        _flightPos.lerpVectors(flightStart, flightTarget, flightProgress);
        _flightPos.y += Math.sin(flightProgress * Math.PI) * 1.2;
        try {
          const localPos = group.worldToLocal(_flightPos);
          arrowGroup.position.copy(localPos);
        } catch {
          // Fallback: place arrow along the direct line in world space
          arrowGroup.position.copy(_flightPos);
        }
        arrowGroup.lookAt(flightTargetLocal);
      }
    }
  };

  return {
    group,
    arrowGroup,
    drawBow,
    fireArrow,
    update,
    get isFiring() {
      return isFiring;
    },
  };
}
