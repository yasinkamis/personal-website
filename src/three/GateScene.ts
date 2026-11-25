import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export type GateMood = 'idle' | 'terminal' | 'classic';
export type GateKey = 'terminal' | 'classic';
export type Lang = 'en' | 'tr';

interface GateOpts {
  lang?: Lang;
  onHover?: (k: GateKey | null) => void;
  onSelect?: (k: GateKey) => void;
}

const GATE_DEF: Record<GateKey, { title: string; sub: Record<Lang, string>; color: number; x: number }> = {
  terminal: { title: 'TERMINAL', sub: { en: 'power user', tr: 'uzman kullanıcı' }, color: 0x7ee787, x: -3.2 },
  classic: { title: 'CLASSIC', sub: { en: 'visual tour', tr: 'görsel tur' }, color: 0x79c0ff, x: 3.2 },
};

const GATE_Z = -9;

function makeLabelTexture(title: string, sub: string, colorHex: string): THREE.CanvasTexture {
  const w = 512, h = 192;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = colorHex;
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 24;
  ctx.font = '800 72px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(title, w / 2, h / 2 - 16);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(235,240,248,0.82)';
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillText(sub, w / 2, h / 2 + 46);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGateScene(canvas: HTMLCanvasElement, opts: GateOpts = {}) {
  let lang: Lang = opts.lang ?? 'en';
  const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 800;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 1.9));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x03060d, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03060d, 0.035);

  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.6, 5);

  // environment reflections (procedural, no downloads)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(o: T): T => { disposables.push(o); return o; };

  // lights
  scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x0a0f1c, 0.5));
  const key = new THREE.DirectionalLight(0xbcd4ff, 0.4);
  key.position.set(3, 8, 6);
  scene.add(key);

  // reflective floor
  const floorMat = track(new THREE.MeshStandardMaterial({
    color: 0x05080f, metalness: 0.9, roughness: 0.35, envMapIntensity: 0.55,
  }));
  const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(140, 140)), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const grid = new THREE.GridHelper(140, 140, 0x24375f, 0x18263f);
  (grid.material as THREE.Material & { transparent: boolean; opacity: number }).transparent = true;
  (grid.material as THREE.Material & { opacity: number }).opacity = 0.35;
  grid.position.y = 0.02;
  scene.add(grid);
  disposables.push(grid.geometry, grid.material as THREE.Material);

  // ambient particles
  const pN = isMobile ? 240 : 560;
  const pPos = new Float32Array(pN * 3);
  for (let i = 0; i < pN; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 70;
    pPos[i * 3 + 1] = Math.random() * 14;
    pPos[i * 3 + 2] = -Math.random() * 60 + 10;
  }
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = track(new THREE.PointsMaterial({
    color: 0x9fc0ff, size: 0.05, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // side pillars for a "hall" feel
  const pillarMat = track(new THREE.MeshStandardMaterial({ color: 0x0a1120, metalness: 0.7, roughness: 0.4, envMapIntensity: 0.5 }));
  const pillarGeo = track(new THREE.BoxGeometry(0.5, 7, 0.5));
  for (let i = 0; i < 7; i++) {
    const z = 4 - i * 4;
    for (const sx of [-7, 7]) {
      const pil = new THREE.Mesh(pillarGeo, pillarMat);
      pil.position.set(sx, 3.5, z);
      scene.add(pil);
    }
  }

  // ── gates ──
  type Gate = {
    key: GateKey;
    group: THREE.Group;
    frameMat: THREE.MeshStandardMaterial;
    portalMat: THREE.MeshStandardMaterial;
    light: THREE.PointLight;
    label: THREE.Mesh;
    labelMat: THREE.MeshBasicMaterial;
    pos: THREE.Vector3;
    activeT: number;
  };
  const gates: Gate[] = [];

  (Object.keys(GATE_DEF) as GateKey[]).forEach(k => {
    const def = GATE_DEF[k];
    const color = new THREE.Color(def.color);
    const group = new THREE.Group();
    group.position.set(def.x, 0, GATE_Z);
    group.userData.gateKey = k;

    const frameMat = track(new THREE.MeshStandardMaterial({
      color: 0x0b1424, emissive: color, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.25, envMapIntensity: 0.6,
    }));
    const pillarG = track(new THREE.CylinderGeometry(0.16, 0.16, 4.3, 18));
    for (const sx of [-1.25, 1.25]) {
      const p = new THREE.Mesh(pillarG, frameMat);
      p.position.set(sx, 2.15, 0);
      group.add(p);
    }
    const topG = track(new THREE.BoxGeometry(2.9, 0.34, 0.42));
    const top = new THREE.Mesh(topG, frameMat);
    top.position.set(0, 4.15, 0);
    group.add(top);

    // pedestal
    const pedMat = track(new THREE.MeshStandardMaterial({ color: 0x0a0f1b, metalness: 0.85, roughness: 0.2, envMapIntensity: 0.7 }));
    const ped = new THREE.Mesh(track(new THREE.CylinderGeometry(1.8, 2.1, 0.4, 36)), pedMat);
    ped.position.y = 0.2;
    group.add(ped);

    // portal surface (emissive, pulses, glows with bloom)
    const portalMat = track(new THREE.MeshStandardMaterial({
      color: 0x000000, emissive: color, emissiveIntensity: 1.3, transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    }));
    const portal = new THREE.Mesh(track(new THREE.PlaneGeometry(2.3, 3.85)), portalMat);
    portal.position.set(0, 2.15, 0);
    group.add(portal);

    // floating label
    const labelMat = track(new THREE.MeshBasicMaterial({
      map: makeLabelTexture(def.title, def.sub[lang], '#' + color.getHexString()),
      transparent: true, depthWrite: false, toneMapped: false,
    }));
    const label = new THREE.Mesh(track(new THREE.PlaneGeometry(3, 1.12)), labelMat);
    label.position.set(0, 5.15, 0);
    group.add(label);

    // glow light
    const light = new THREE.PointLight(color, 5, 16, 2);
    light.position.set(0, 2.4, 0.6);
    group.add(light);

    scene.add(group);
    gates.push({ key: k, group, frameMat, portalMat, light, label, labelMat, pos: new THREE.Vector3(def.x, 1.6, GATE_Z), activeT: 0 });
  });

  // ── postprocessing (bloom) ──
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    isMobile ? 0.7 : 0.95, 0.55, 0.55,
  );
  composer.addPass(bloom);
  composer.setSize(window.innerWidth, window.innerHeight);

  // ── input / controls ──
  const keys = new Set<string>();
  const move = { x: 0, y: 0 };       // external (joystick): x strafe, y forward
  let yaw = 0, pitch = 0;
  let ready = 0, targetReady = 0;
  let warp = 0, targetWarp = 0;
  let forcedActive: GateKey | null = null;
  let activeKey: GateKey | null = null;

  const clock = new THREE.Clock();
  let raf = 0;
  const raycaster = new THREE.Raycaster();
  const tapNDC = new THREE.Vector2();

  // drag-look
  let dragging = false, lastX = 0, lastY = 0, downT = 0, moved = 0;
  const LOOK = 0.0026;

  const setActive = (k: GateKey | null) => {
    if (k === activeKey) return;
    activeKey = k;
    opts.onHover?.(k);
  };

  const trySelect = (fromTap: boolean, ndc?: THREE.Vector2) => {
    if (ready < 0.5 || warp > 0.01) return;
    let hit: GateKey | null = null;
    if (fromTap && ndc) {
      raycaster.setFromCamera(ndc, camera);
      const inter = raycaster.intersectObjects(gates.map(g => g.group), true);
      let o: THREE.Object3D | null = inter[0]?.object ?? null;
      while (o && o.userData.gateKey == null) o = o.parent;
      hit = (o?.userData.gateKey as GateKey | undefined) ?? null;
    }
    const chosen = hit ?? activeKey;
    if (chosen) opts.onSelect?.(chosen);
  };

  const onDown = (e: PointerEvent) => {
    dragging = true; moved = 0;
    lastX = e.clientX; lastY = e.clientY; downT = performance.now();
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    yaw -= dx * LOOK;
    pitch = Math.max(-1.0, Math.min(1.0, pitch - dy * LOOK));
  };
  const onUp = (e: PointerEvent) => {
    const wasTap = moved < 10 && performance.now() - downT < 320;
    dragging = false;
    if (wasTap) {
      tapNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      tapNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      trySelect(true, tapNDC);
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.key.toLowerCase());
    if (e.key.toLowerCase() === 'e' || e.key === 'Enter') trySelect(false);
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.style.cursor = 'grab';

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const vel = new THREE.Vector3();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    ready += (targetReady - ready) * 0.05;
    warp += (targetWarp - warp) * 0.06;

    // movement input
    let fwd = move.y;
    let str = move.x;
    if (keys.has('w') || keys.has('arrowup')) fwd += 1;
    if (keys.has('s') || keys.has('arrowdown')) fwd -= 1;
    if (keys.has('d') || keys.has('arrowright')) str += 1;
    if (keys.has('a') || keys.has('arrowleft')) str -= 1;

    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    vel.set(0, 0, 0).addScaledVector(forward, fwd).addScaledVector(right, str);
    if (vel.lengthSq() > 1) vel.normalize();
    const speed = 6 * (1 - warp);
    camera.position.addScaledVector(vel, speed * dt);
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
    camera.position.z = Math.max(-13, Math.min(12, camera.position.z));
    camera.position.y = 1.6 + Math.sin(t * 8) * (vel.lengthSq() > 0.01 ? 0.03 : 0); // head bob

    // nearest gate (proximity) unless a button forces it
    let nearest: GateKey | null = null;
    let nd = Infinity;
    gates.forEach(g => {
      const dxz = Math.hypot(camera.position.x - g.pos.x, camera.position.z - g.pos.z);
      if (dxz < 4.2 && dxz < nd) { nd = dxz; nearest = g.key; }
    });
    setActive(forcedActive ?? nearest);

    // animate gates
    gates.forEach((g, i) => {
      const isActive = activeKey === g.key;
      g.activeT += ((isActive ? 1 : 0) - g.activeT) * 0.1;
      g.frameMat.emissiveIntensity = 0.8 + g.activeT * 1.4 + Math.sin(t * 2 + i) * 0.05;
      g.portalMat.emissiveIntensity = 1.1 + g.activeT * 1.6;
      g.portalMat.opacity = 0.5 + Math.sin(t * 1.5 + i) * 0.08 + g.activeT * 0.2;
      g.light.intensity = 4 + g.activeT * 8;
      g.label.lookAt(camera.position.x, g.label.getWorldPosition(new THREE.Vector3()).y, camera.position.z);
      const vis = ready;
      g.labelMat.opacity = vis;
      g.group.scale.setScalar(Math.max(0.0001, vis));
    });

    // particles drift
    particles.rotation.y += dt * 0.008;

    // warp: dolly toward active gate + crank bloom
    if (warp > 0.01 && activeKey) {
      const g = gates.find(x => x.key === activeKey)!;
      camera.position.x += (g.pos.x - camera.position.x) * 0.04 * warp * 4;
      camera.position.z += (g.pos.z + 1 - camera.position.z) * 0.04 * warp * 4;
    }
    bloom.strength = (isMobile ? 0.7 : 0.95) + warp * 2.2;
    renderer.toneMappingExposure = 1.05 + warp * 1.2;

    camera.rotation.set(pitch, yaw, 0);
    composer.render();
  };
  frame();

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  return {
    setReady(v: boolean) { targetReady = v ? 1 : 0; },
    setMoveVector(x: number, y: number) { move.x = x; move.y = y; },
    hoverPortal(k: GateKey | null) { forcedActive = k; },
    setLang(l: Lang) {
      lang = l;
      gates.forEach(g => {
        const def = GATE_DEF[g.key];
        const old = g.labelMat.map;
        g.labelMat.map = makeLabelTexture(def.title, def.sub[lang], '#' + new THREE.Color(def.color).getHexString());
        g.labelMat.needsUpdate = true;
        old?.dispose();
      });
    },
    warp() { targetWarp = 1; targetReady = 0; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      scene.traverse(o => { (o as THREE.Mesh).geometry?.dispose?.(); });
      gates.forEach(g => g.labelMat.map?.dispose());
      disposables.forEach(d => d.dispose());
      envRT.texture.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
