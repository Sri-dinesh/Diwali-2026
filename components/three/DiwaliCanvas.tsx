'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createRama, RamaCharacter } from '../../lib/three/models/rama';
import { createRavana, RavanaCharacter } from '../../lib/three/models/ravana';
import { createAyodhyaKingdom, AyodhyaPalace } from '../../lib/three/models/ayodhya';
import { createPushpakVimana, PushpakVimana } from '../../lib/three/models/pushpak-vimana';
import { createDiyasSystem, DiyasSystem } from '../../lib/three/models/diyas';
import { createSarayuRiver, SarayuRiver } from '../../lib/three/models/sarayu';
import { createRangoliFloor, RangoliFloor } from '../../lib/three/models/rangoli';
import { createFireworksSystem, FireworksSystem } from '../../lib/three/models/fireworks';
import { createLankaBattlefield, LankaBattlefield } from '../../lib/three/models/battlefield';
import { sound } from '../../lib/audio/sound-synth';

export interface DiwaliCanvasProps {
  currentChapter: number;
  isOrbitMode: boolean;
  onDiyaLit?: () => void;
  onArrowFired?: () => void;
  onRavanaDefeated?: () => void;
  onBattleStageChange?: (stage: string) => void;
}

export interface DiwaliCanvasRef {
  playBattleSequence: () => void;
  fireAgniAstra: () => void;
  lightPersonalDiya: () => void;
  launchFirework: () => void;
}

export const DiwaliCanvas = React.forwardRef<DiwaliCanvasRef, DiwaliCanvasProps>(function DiwaliCanvas(
  { currentChapter, isOrbitMode, onDiyaLit, onArrowFired, onRavanaDefeated, onBattleStageChange },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    isSoftwareGl: boolean;
    rama: RamaCharacter | null;
    ravana: RavanaCharacter | null;
    ayodhya: AyodhyaPalace | null;
    vimana: PushpakVimana | null;
    diyas: DiyasSystem | null;
    sarayu: SarayuRiver | null;
    rangoli: RangoliFloor | null;
    fireworks: FireworksSystem | null;
    battlefield: LankaBattlefield | null;
    targetCamPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    currentChapter: number;
    isOrbitMode: boolean;
    time: number;
    // Rama vs Ravana Continuous Cinematic Animation State Machine
    battleAnim: {
      isPlaying: boolean;
      timer: number;
      stage: 'IDLE' | 'HOLDING' | 'DRAWING' | 'RELEASED' | 'RAVANA_FIRE' | 'CRACKERS' | 'COMPLETED';
      drawSoundPlayed: boolean;
      releaseSoundPlayed: boolean;
      impactSoundPlayed: boolean;
      crackersLaunched: boolean;
    };
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    isSoftwareGl: false,
    rama: null,
    ravana: null,
    ayodhya: null,
    vimana: null,
    diyas: null,
    sarayu: null,
    rangoli: null,
    fireworks: null,
    battlefield: null,
    targetCamPos: new THREE.Vector3(0, 3.5, 34),
    targetLookAt: new THREE.Vector3(0, 8, 4),
    currentLookAt: new THREE.Vector3(0, 8, 4),
    currentChapter: 0,
    isOrbitMode: false,
    time: 0,
    battleAnim: {
      isPlaying: false,
      timer: 0,
      stage: 'IDLE',
      drawSoundPlayed: false,
      releaseSoundPlayed: false,
      impactSoundPlayed: false,
      crackersLaunched: false,
    },
  });

  // Camera settings for static chapter views
  const updateChapterCamera = (chapter: number) => {
    const s = stateRef.current;
    if (s.isOrbitMode || s.battleAnim.isPlaying) return;

    switch (chapter) {
      case 0: // 01 — The Waiting Kingdom
        s.targetCamPos.set(0, 3.5, 34);
        s.targetLookAt.set(0, 8, 4);
        if (s.camera && s.camera.position.z < 10) {
          s.camera.position.set(0, 3.5, 34);
          s.currentLookAt.set(0, 8, 4);
          s.camera.lookAt(0, 8, 4);
        }
        break;
      case 1: // 02 — The Battlefield
      case 2: // 03 — The Divine Bow
      case 3: // 04 — The Fire Arrow
        // Directly frame Lord Rama in heroic 3/4 front view
        s.targetCamPos.set(-1.4, 1.85, -24.2);
        s.targetLookAt.set(0.0, 1.75, -22.0);
        if (s.camera && s.camera.position.z > -10) {
          s.camera.position.set(-1.4, 1.85, -24.2);
          s.currentLookAt.set(0.0, 1.75, -22.0);
          s.camera.lookAt(0.0, 1.75, -22.0);
        }
        break;
      case 4: // 05 — Victory
        s.targetCamPos.set(3.8, 3.5, -21.5);
        s.targetLookAt.set(0, 2.2, -26.5);
        break;
      case 5: // 06 — The Return (Pushpak Vimana)
        s.targetCamPos.set(5.5, 10.5, 12);
        s.targetLookAt.set(0, 9.5, 5);
        break;
      case 6: // 07 — Lighting the Kingdom
        s.targetCamPos.set(0, 5.0, 31);
        s.targetLookAt.set(0, 5.5, 2);
        if (s.camera && s.camera.position.z < 10) {
          s.camera.position.set(0, 5.0, 31);
          s.currentLookAt.set(0, 5.5, 2);
          s.camera.lookAt(0, 5.5, 2);
        }
        if (s.diyas && !s.diyas.isLit) {
          s.diyas.lightKingdom();
          sound.playTempleBell();
        }
        break;
      case 7: // 08 — The Grand Celebration
        s.targetCamPos.set(0, 10.0, 30);
        s.targetLookAt.set(0, 10.0, 0);
        break;
      case 8: // 09 — Sarayu River of Lights
        s.targetCamPos.set(0, 1.4, 34);
        s.targetLookAt.set(0, 0.6, 26);
        break;
      case 9: // 10 — Final Blessing
      default:
        s.targetCamPos.set(0, 2.4, 25.5);
        s.targetLookAt.set(0, 3.2, 10);
        break;
    }
  };

  /**
   * Start the continuous Rama Killing Ravana Cinematic Animation:
   * 1. 0s to 1s: Rama holding bow & arrow (calm determination)
   * 2. After 1s: Rama ready to shoot pose (bow pulled, arrow tip in raging fire)
   * 3. After 1s: Arrow releases in slow motion
   * 4. Arrow catches fire to Ravana -> Ravana is in fire for 5 SECONDS!
   * 5. After 5s of fire: From bottom to top, crackers are blown!
   */
  const playBattleSequence = useCallback(() => {
    const s = stateRef.current;
    if (!s.rama || !s.ravana) return;

    // Reset actors
    s.ravana.reset();
    s.rama.setPose('holding', 1.0);
    s.rama.fireBow.drawBow(0);

    // Arrive zoomed out so the full battle scene (Rama, Ravana, battlefield) is visible
    s.targetCamPos.set(-6.0, 4.5, -38.0);
    s.targetLookAt.set(0.0, 2.0, -25.0);
    s.currentLookAt.set(0.0, 2.0, -25.0);
    if (s.camera) {
      s.camera.position.set(-6.0, 4.5, -38.0);
      s.camera.lookAt(0.0, 2.0, -25.0);
    }

    // Initialize state machine
    s.battleAnim = {
      isPlaying: true,
      timer: 0,
      stage: 'HOLDING',
      drawSoundPlayed: false,
      releaseSoundPlayed: false,
      impactSoundPlayed: false,
      crackersLaunched: false,
    };

    if (onBattleStageChange) onBattleStageChange('HOLDING');
  }, [onBattleStageChange]);

  // Synchronize chapter change
  useEffect(() => {
    stateRef.current.currentChapter = currentChapter;
    stateRef.current.isOrbitMode = isOrbitMode;

    if (stateRef.current.controls) {
      stateRef.current.controls.enabled = isOrbitMode;
    }

    updateChapterCamera(currentChapter);

    // Auto-trigger battle animation when arriving at Chapter 1 (The Battlefield)
    if (currentChapter === 1) {
      playBattleSequence();
    }
  }, [currentChapter, isOrbitMode, playBattleSequence]);

  const fireAgniAstra = useCallback(() => {
    playBattleSequence();
  }, [playBattleSequence]);

  const lightPersonalDiya = useCallback(() => {
    const s = stateRef.current;
    if (!s.diyas) return;
    s.diyas.lightKingdom();
    sound.playTempleBell();
    if (s.fireworks) {
      s.fireworks.launchFirework();
    }
    if (onDiyaLit) onDiyaLit();
  }, [onDiyaLit]);

  const launchFirework = useCallback(() => {
    const s = stateRef.current;
    if (s.fireworks) {
      s.fireworks.launchFirework();
    }
  }, []);

  React.useImperativeHandle(ref, () => ({
    playBattleSequence,
    fireAgniAstra,
    lightPersonalDiya,
    launchFirework,
  }));

  // Setup WebGL Scene Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();
    stateRef.current.isSoftwareGl = isSoftwareGl;

    // 2. Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    stateRef.current.renderer = renderer;

    // 3. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070914);
    scene.fog = new THREE.Fog(0x070914, 30, 110);
    stateRef.current.scene = scene;

    // 4. Camera Setup
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    if (stateRef.current.currentChapter === 1) {
      camera.position.set(-1.4, 1.85, -24.2);
      camera.lookAt(0.0, 1.75, -22.0);
      stateRef.current.targetCamPos.set(-1.4, 1.85, -24.2);
      stateRef.current.targetLookAt.set(0.0, 1.75, -22.0);
      stateRef.current.currentLookAt.set(0.0, 1.75, -22.0);
    } else {
      camera.position.set(0, 3.5, 34);
    }
    stateRef.current.camera = camera;

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 2.0;
    controls.maxDistance = 75.0;
    controls.enabled = stateRef.current.isOrbitMode;
    stateRef.current.controls = controls;

    // 6. Mandatory Studio Environment Reflection
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // RoomEnvironment fallback safe
    }

    // 7. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x4466aa, 0x1a1105, 1.2);
    scene.add(hemiLight);

    const moonKeyLight = new THREE.DirectionalLight(0xdde8ff, 1.8);
    moonKeyLight.position.set(15, 25, 20);
    moonKeyLight.castShadow = !isSoftwareGl;
    if (moonKeyLight.castShadow) {
      moonKeyLight.shadow.mapSize.width = 1024;
      moonKeyLight.shadow.mapSize.height = 1024;
      moonKeyLight.shadow.bias = -0.0005;
    }
    scene.add(moonKeyLight);

    const divineSunFill = new THREE.DirectionalLight(0xffa500, 1.1);
    divineSunFill.position.set(-15, 15, -10);
    scene.add(divineSunFill);

    // Moon in the sky
    const moonGeo = new THREE.SphereGeometry(2.8, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff9e6 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-18, 32, -45);
    scene.add(moon);

    const moonHalo = new THREE.Mesh(
      new THREE.RingGeometry(2.9, 5.5, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffe6a3,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    moonHalo.position.copy(moon.position);
    moonHalo.lookAt(camera.position);
    scene.add(moonHalo);

    // Starfield Cosmos
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 160;
      starPos[i * 3 + 1] = 10 + Math.random() * 60;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 8. Ground Base Plane
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x140e0b,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // 9. Instantiate all 3D Models
    const ayodhya = createAyodhyaKingdom();
    scene.add(ayodhya.group);
    stateRef.current.ayodhya = ayodhya;

    const battlefield = createLankaBattlefield();
    scene.add(battlefield.group);
    stateRef.current.battlefield = battlefield;

    const rama = createRama();
    rama.group.position.set(0, 0, -22);
    scene.add(rama.group);
    stateRef.current.rama = rama;

    const ravana = createRavana();
    ravana.group.position.set(0, 0, -28);
    scene.add(ravana.group);
    stateRef.current.ravana = ravana;

    const vimana = createPushpakVimana();
    vimana.group.position.set(0, 9.5, 6.0);
    scene.add(vimana.group);
    stateRef.current.vimana = vimana;

    const diyas = createDiyasSystem();
    scene.add(diyas.group);
    stateRef.current.diyas = diyas;

    const sarayu = createSarayuRiver();
    scene.add(sarayu.group);
    stateRef.current.sarayu = sarayu;

    const rangoli = createRangoliFloor();
    scene.add(rangoli.group);
    stateRef.current.rangoli = rangoli;

    const fireworks = createFireworksSystem();
    scene.add(fireworks.group);
    stateRef.current.fireworks = fireworks;

    // Automatic trigger: start battle animation immediately when arrived near Lord Rama
    if (stateRef.current.currentChapter === 1) {
      setTimeout(() => {
        playBattleSequence();
      }, 100);
    }

    // 10. Click Interaction
    const handleCanvasClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'CANVAS') return;

      if (stateRef.current.currentChapter >= 6) {
        stateRef.current.fireworks?.launchFirework();
      }
    };
    window.addEventListener('click', handleCanvasClick);

    // 11. Resize Handler
    const handleResize = () => {
      if (!container || !stateRef.current.camera || !stateRef.current.renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      stateRef.current.camera.aspect = w / h;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main Render & Animation Loop
    let animationFrameId = 0;
    let prevTime = performance.now();
    let totalElapsedTime = 0;

    if (typeof window !== 'undefined') {
      (window as any).__diwali = {
        playBattleSequence,
        setAnimTimer: (timer: number) => {
          stateRef.current.battleAnim.timer = timer;
        },
        getState: () => ({
          anim: stateRef.current.battleAnim,
          camPos: stateRef.current.camera?.position,
          targetCamPos: stateRef.current.targetCamPos,
        }),
      };
    }

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - prevTime) / 1000, 0.25);
      prevTime = now;
      totalElapsedTime += delta;
      const time = totalElapsedTime;
      stateRef.current.time = time;

      // Guard: if renderer or scene was disposed, stop animating
      const _renderer = stateRef.current.renderer;
      const _scene = stateRef.current.scene;
      const _camera = stateRef.current.camera;
      if (!_renderer || !_scene || !_camera) {
        return;
      }

      // --- CONTINUOUS RAMA VS RAVANA BATTLE STATE MACHINE ---
      const anim = stateRef.current.battleAnim;

      // Update nested models — skip distant/irrelevant systems during battle to save GPU
      const battleActive = anim.isPlaying;
      ayodhya.update(delta, time);
      if (!battleActive) {
        diyas.update(delta, time);
        rangoli.update(delta, time);
        sarayu.update(delta, time);
      }
      battlefield.update(delta, time);
      rama.update(delta, time);
      ravana.update(delta, time);
      vimana.update(delta, time);
      fireworks.update(delta);

      if (anim.isPlaying) {
        anim.timer += delta;

        // Stage 1: Rama holding the bow & arrow (0s to 1.0s)
        if (anim.timer < 1.0) {
          if (anim.stage !== 'HOLDING') {
            anim.stage = 'HOLDING';
            if (onBattleStageChange) onBattleStageChange('HOLDING');
          }
          rama.setPose('holding', 1.0);
          rama.aimAtTarget(ravana.group.position);

          // Zoomed-out view keeping both Rama and Ravana in frame
          stateRef.current.targetCamPos.set(-6.0, 4.5, -38.0);
          stateRef.current.targetLookAt.set(0.0, 2.0, -25.0);
        }
        // Stage 2: Ready to shoot / Bow-pulling pose with arrow needle point in fire (1.0s to 2.2s)
        else if (anim.timer >= 1.0 && anim.timer < 2.2) {
          if (anim.stage !== 'DRAWING') {
            anim.stage = 'DRAWING';
            if (onBattleStageChange) onBattleStageChange('DRAWING');
          }
          const drawProgress = (anim.timer - 1.0) / 1.2;
          rama.setPose('drawing', drawProgress);
          rama.aimAtTarget(ravana.group.position);

          if (!anim.drawSoundPlayed) {
            anim.drawSoundPlayed = true;
            sound.playBowDraw();
          }

          // Zoomed-out view of Rama drawing the bow, full scene visible
          stateRef.current.targetCamPos.set(-5.0, 4.2, -37.0);
          stateRef.current.targetLookAt.set(0.0, 2.0, -25.0);
        }
        // Stage 3: Arrow releases in slow-motion flight (2.2s to 3.0s)
        else if (anim.timer >= 2.2 && anim.timer < 3.0) {
          if (anim.stage !== 'RELEASED') {
            anim.stage = 'RELEASED';
            if (onBattleStageChange) onBattleStageChange('RELEASED');
          }
          rama.setPose('released', 1.0);

          if (!anim.releaseSoundPlayed) {
            anim.releaseSoundPlayed = true;
            sound.playArrowRelease();
            // Launch arrow towards Ravana
            rama.fireBow.fireArrow(new THREE.Vector3(0, 2.3, -28));
          }

          // Zoomed-out side view tracking the arrow, full scene visible
          stateRef.current.targetCamPos.set(4.0, 4.0, -36.0);
          stateRef.current.targetLookAt.set(0.0, 2.2, -26.0);
        }
        // Stage 4: Arrow catches fire to Lord Ravana -> Ravana is in fire for 5 SECONDS! (3.0s to 8.0s)
        else if (anim.timer >= 3.0 && anim.timer < 8.0) {
          if (anim.stage !== 'RAVANA_FIRE') {
            anim.stage = 'RAVANA_FIRE';
            if (onBattleStageChange) onBattleStageChange('RAVANA_FIRE');
          }

          if (!anim.impactSoundPlayed) {
            anim.impactSoundPlayed = true;
            sound.playShankh();
            sound.playWarDrum();
            // IGNITE RAVANA IN RAGING FIRE FOR 5 FULL SECONDS!
            ravana.catchFire(5.0);
            if (onArrowFired) onArrowFired();
          }

          // Zoomed-out view of Ravana on fire, full scene visible
          stateRef.current.targetCamPos.set(4.0, 4.0, -37.0);
          stateRef.current.targetLookAt.set(0.0, 2.2, -26.0);
        }
        // Stage 5: After 5 seconds of fire, Ravana dissolves and BOTTOM TO TOP CRACKERS ARE BLOWN! (8.0s to 13.5s)
        else if (anim.timer >= 8.0 && anim.timer < 13.5) {
          if (anim.stage !== 'CRACKERS') {
            anim.stage = 'CRACKERS';
            if (onBattleStageChange) onBattleStageChange('CRACKERS');
          }

          if (!anim.crackersLaunched) {
            anim.crackersLaunched = true;
            // ASCENDING GROUND-TO-SKY CRACKER SHOW!
            fireworks.launchGroundToSkyCrackerShow(new THREE.Vector3(0, 0, -26));
            sound.playTempleBell();
            if (onRavanaDefeated) onRavanaDefeated();
          }

          // Zoomed-out elevated view of crackers, full scene visible
          stateRef.current.targetCamPos.set(0.0, 6.0, -32.0);
          stateRef.current.targetLookAt.set(0.0, 6.0, -26.0);
        }
        // Animation sequence finishes, transitions smoothly
        else if (anim.timer >= 13.5) {
          anim.isPlaying = false;
          anim.stage = 'COMPLETED';
          if (onBattleStageChange) onBattleStageChange('COMPLETED');
          updateChapterCamera(stateRef.current.currentChapter);
        }
      } else {
        // Idle aim at Ravana in early chapters
        if (stateRef.current.currentChapter <= 4) {
          rama.aimAtTarget(ravana.group.position);
        }
      }

      // Smooth Camera Damping with instant cut for large scene jumps
      if (!stateRef.current.isOrbitMode) {
        // Use squared distance to avoid a sqrt every frame
        const dx = camera.position.x - stateRef.current.targetCamPos.x;
        const dy = camera.position.y - stateRef.current.targetCamPos.y;
        const dz = camera.position.z - stateRef.current.targetCamPos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq > 144) { // 12^2
          camera.position.copy(stateRef.current.targetCamPos);
          stateRef.current.currentLookAt.copy(stateRef.current.targetLookAt);
          camera.lookAt(stateRef.current.currentLookAt);
        } else {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, stateRef.current.targetCamPos.x, 2.5, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, stateRef.current.targetCamPos.y, 2.5, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, stateRef.current.targetCamPos.z, 2.5, delta);

          stateRef.current.currentLookAt.x = THREE.MathUtils.damp(
            stateRef.current.currentLookAt.x,
            stateRef.current.targetLookAt.x,
            3.0,
            delta
          );
          stateRef.current.currentLookAt.y = THREE.MathUtils.damp(
            stateRef.current.currentLookAt.y,
            stateRef.current.targetLookAt.y,
            3.0,
            delta
          );
          stateRef.current.currentLookAt.z = THREE.MathUtils.damp(
            stateRef.current.currentLookAt.z,
            stateRef.current.targetLookAt.z,
            3.0,
            delta
          );

          camera.lookAt(stateRef.current.currentLookAt);
        }
      } else {
        controls.update();
      }

      // Occasional celebratory fireworks in chapters 7 & 8
      if (stateRef.current.currentChapter >= 7 && Math.random() < 0.02) {
        fireworks.launchFirework();
      }

      try {
        renderer.render(scene, camera);
      } catch {
        // Context lost or renderer error — skip this frame, keep looping
      }

      if (isSoftwareGl) {
        try {
          const gl = renderer?.getContext() as WebGL2RenderingContext | null;
          if (!gl) {
            animationFrameId = window.setTimeout(animate, 60);
          } else {
            const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
            gl.flush();
            const poll = () => {
              try {
                const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
                if (st === gl.UNSIGNALED) {
                  window.setTimeout(poll, 5);
                } else {
                  if (sync) gl.deleteSync(sync);
                  animationFrameId = window.setTimeout(animate, 60);
                }
              } catch {
                animationFrameId = window.setTimeout(animate, 60);
              }
            };
            window.setTimeout(poll, 5);
          }
        } catch {
          animationFrameId = window.setTimeout(animate, 60);
        }
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onArrowFired, onBattleStageChange, onRavanaDefeated, playBattleSequence]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
});
