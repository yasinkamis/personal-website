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
  terminal: { title: 'TERMINAL', sub: { en: 'power user', tr: 'uzman kullanıcı' }, color: 0x7ee787, x: -2.7 },
  classic: { title: 'CLASSIC', sub: { en: 'visual tour', tr: 'görsel tur' }, color: 0x79c0ff, x: 2.7 },
};

const GATE_Z = -6;

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
  ctx.shadowBlur = 12;
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

/** Procedural dark tech-floor texture (panels + seams + speckle). */
function makeFloorTexture(): THREE.CanvasTexture {
  const s = 512;
  const cv = document.createElement('canvas');
  cv.width = s; cv.height = s;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, s, s);
  // panel tiles
  const tiles = 4;
  const step = s / tiles;
  for (let x = 0; x < tiles; x++) {
    for (let y = 0; y < tiles; y++) {
      const v = 8 + Math.floor(Math.random() * 6);
      ctx.fillStyle = `rgb(${v},${v + 4},${v + 12})`;
      ctx.fillRect(x * step + 2, y * step + 2, step - 4, step - 4);
    }
  }
  // seams
  ctx.strokeStyle = 'rgba(90,120,180,0.18)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= tiles; i++) {
    ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(s, i * step); ctx.stroke();
  }
  // speckle
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(150,180,220,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(26, 26);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** A dim "info board" mounted on the hall walls. */
function makePanelTexture(label: string, sub: string): THREE.CanvasTexture {
  const w = 512, h = 288;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = 'rgba(8,14,26,0.92)';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(124,156,255,0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.fillStyle = 'rgba(94,234,212,0.9)';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText(sub, 34, 64);
  ctx.fillStyle = '#e8eefb';
  ctx.font = '800 46px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(label, 32, 150);
  ctx.fillStyle = 'rgba(138,153,179,0.7)';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText('// yasinkamis.com', 34, 236);
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
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.092);

  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.6, 3.6);

  // environment reflections (procedural, no downloads)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(o: T): T => { disposables.push(o); return o; };

  // lights — near-black ambient; the gates light their own surroundings
  scene.add(new THREE.HemisphereLight(0x5a76b8, 0x04060c, 0.05));
  const key = new THREE.DirectionalLight(0xbcd4ff, 0.05);
  key.position.set(3, 8, 6);
  scene.add(key);

  // textured matte floor (procedural tech panels)
  const floorTex = track(makeFloorTexture());
  const floorMat = track(new THREE.MeshStandardMaterial({
    color: 0xffffff, map: floorTex, metalness: 0.0, roughness: 1.0, envMapIntensity: 0.04,
  }));
  const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(160, 160)), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // distant starfield — gives the sky depth (unaffected by fog, parallax on look/move)
  const starN = isMobile ? 520 : 1300;
  const sPos = new Float32Array(starN * 3);
  for (let i = 0; i < starN; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 55 + Math.random() * 40;
    sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    sPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 3; // bias above the horizon
    sPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const pMat = track(new THREE.PointsMaterial({
    color: 0xcdddff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, depthWrite: false,
  }));
  pMat.fog = false;
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // rounded hall columns (some carry a board, some stay empty)
  const SIDE_X = 5.6;
  const PILLAR_Z = [2, -2, -6, -10];
  const pillarMat = track(new THREE.MeshStandardMaterial({ color: 0x0c1526, metalness: 0.28, roughness: 0.62, envMapIntensity: 0.22 }));
  const capMat = track(new THREE.MeshStandardMaterial({ color: 0x0a0f1b, emissive: 0x18294a, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.45 }));
  const pillarGeo = track(new THREE.CylinderGeometry(0.26, 0.28, 7, 32));
  const capGeo = track(new THREE.CylinderGeometry(0.4, 0.4, 0.22, 32));
  for (const sx of [-SIDE_X, SIDE_X]) {
    for (const z of PILLAR_Z) {
      const pil = new THREE.Mesh(pillarGeo, pillarMat);
      pil.position.set(sx, 3.5, z);
      scene.add(pil);
      const cap = new THREE.Mesh(capGeo, capMat); cap.position.set(sx, 7.0, z); scene.add(cap);
      const base = new THREE.Mesh(capGeo, capMat); base.position.set(sx, 0.11, z); scene.add(base);
    }
  }

  // professional competency boards, mounted on the inner face of some columns
  const BOARDS: Array<[number, number, string, string]> = [
    [-SIDE_X, 2, 'VITE.JS', '// instant build'],
    [-SIDE_X, -2, 'ARCHITECTURE', '// scalable UI'],
    [-SIDE_X, -6, 'PERFORMANCE', '// web vitals'],
    [-SIDE_X, -10, 'SEO · GEO', '// discoverable'],
    [SIDE_X, 2, 'REACT · NEXT', '// frontend'],
    [SIDE_X, -2, 'DESIGN SYSTEMS', '// consistent UX'],
    [SIDE_X, -6, 'ACCESSIBILITY', '// a11y'],
    [SIDE_X, -10, '3D · MOTION', '// three · gsap'],
  ];
  const boardGeo = track(new THREE.PlaneGeometry(2.4, 1.4));
  BOARDS.forEach(([bx, bz, label, sub]) => {
    const side = bx < 0 ? -1 : 1;
    const tex = track(makePanelTexture(label, sub));
    const mat = track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.82 }));
    const board = new THREE.Mesh(boardGeo, mat);
    board.position.set(bx - side * 0.3, 3.1, bz);
    board.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(board);
  });

  // slow floating wireframe shapes (subtle ambiance)
  const floaters: THREE.Mesh[] = [];
  const floatMat = track(new THREE.MeshBasicMaterial({ color: 0x24375f, wireframe: true, transparent: true, opacity: 0.32 }));
  const floatGeos = [
    track(new THREE.IcosahedronGeometry(0.7, 0)),
    track(new THREE.OctahedronGeometry(0.6, 0)),
  ];
  const floatPos: Array<[number, number, number]> = [[-3.4, 5.2, -3], [3.4, 5.6, -7]];
  floatGeos.forEach((g, i) => {
    const m = new THREE.Mesh(g, floatMat);
    m.position.set(...floatPos[i]);
    scene.add(m);
    floaters.push(m);
  });

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
      color: 0x0b1424, emissive: color, emissiveIntensity: 0.5, metalness: 0.5, roughness: 0.3, envMapIntensity: 0.4,
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
    const pedMat = track(new THREE.MeshStandardMaterial({ color: 0x090e1a, metalness: 0.4, roughness: 0.55, envMapIntensity: 0.22 }));
    const ped = new THREE.Mesh(track(new THREE.CylinderGeometry(1.8, 2.1, 0.4, 36)), pedMat);
    ped.position.y = 0.2;
    group.add(ped);

    // portal surface (emissive, pulses, glows with bloom)
    const portalMat = track(new THREE.MeshStandardMaterial({
      color: 0x000000, emissive: color, emissiveIntensity: 0.7, transparent: true, opacity: 0.38, side: THREE.DoubleSide,
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
    const light = new THREE.PointLight(color, 3, 14, 2);
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
    isMobile ? 0.35 : 0.5, 0.5, 0.82,
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
  const hoverNDC = new THREE.Vector2();
  let hoverKey: GateKey | null = null;

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

  let lookId: number | null = null;
  const onDown = (e: PointerEvent) => {
    if (lookId !== null) return; // another finger already drives the look
    lookId = e.pointerId;
    dragging = true; moved = 0;
    lastX = e.clientX; lastY = e.clientY; downT = performance.now();
  };
  const onMove = (e: PointerEvent) => {
    if (dragging && e.pointerId === lookId) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw -= dx * LOOK;
      pitch = Math.max(-1.0, Math.min(1.0, pitch - dy * LOOK));
      return;
    }
    if (dragging) return; // ignore other fingers while looking
    // mouse-hover highlight on gates (desktop)
    hoverNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    hoverNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(hoverNDC, camera);
    const hit = raycaster.intersectObjects(gates.map(g => g.group), true);
    let o: THREE.Object3D | null = hit[0]?.object ?? null;
    while (o && o.userData.gateKey == null) o = o.parent;
    hoverKey = (o?.userData.gateKey as GateKey | undefined) ?? null;
    canvas.style.cursor = hoverKey ? 'pointer' : 'grab';
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerId !== lookId) return;
    const wasTap = moved < 10 && performance.now() - downT < 320;
    dragging = false;
    lookId = null;
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
    camera.position.x = Math.max(-9, Math.min(9, camera.position.x));
    camera.position.z = Math.max(-12, Math.min(10, camera.position.z));
    camera.position.y = 1.6 + Math.sin(t * 8) * (vel.lengthSq() > 0.01 ? 0.03 : 0); // head bob

    // nearest gate (proximity) unless a button forces it
    let nearest: GateKey | null = null;
    let nd = Infinity;
    gates.forEach(g => {
      const dxz = Math.hypot(camera.position.x - g.pos.x, camera.position.z - g.pos.z);
      if (dxz < 4.2 && dxz < nd) { nd = dxz; nearest = g.key; }
    });
    setActive(forcedActive ?? hoverKey ?? nearest);

    // animate gates
    gates.forEach((g, i) => {
      const isActive = activeKey === g.key;
      g.activeT += ((isActive ? 1 : 0) - g.activeT) * 0.1;
      g.frameMat.emissiveIntensity = 0.28 + g.activeT * 0.6 + Math.sin(t * 2 + i) * 0.03;
      g.portalMat.emissiveIntensity = 0.3 + g.activeT * 0.5;
      g.portalMat.opacity = 0.22 + Math.sin(t * 1.5 + i) * 0.03 + g.activeT * 0.18;
      g.light.intensity = 1.8 + g.activeT * 3;
      g.label.lookAt(camera.position.x, g.label.getWorldPosition(new THREE.Vector3()).y, camera.position.z);
      const vis = ready;
      g.labelMat.opacity = vis;
      g.group.scale.setScalar(Math.max(0.0001, vis));
    });

    // particles drift
    particles.rotation.y += dt * 0.008;
    floaters.forEach((f, i) => { f.rotation.x += dt * 0.1; f.rotation.y += dt * (0.12 + i * 0.03); });

    // warp: dolly toward active gate + crank bloom
    if (warp > 0.01 && activeKey) {
      const g = gates.find(x => x.key === activeKey)!;
      camera.position.x += (g.pos.x - camera.position.x) * 0.04 * warp * 4;
      camera.position.z += (g.pos.z + 1 - camera.position.z) * 0.04 * warp * 4;
    }
    bloom.strength = (isMobile ? 0.35 : 0.5) + warp * 1.7;
    renderer.toneMappingExposure = 0.9 + warp * 0.9;

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
