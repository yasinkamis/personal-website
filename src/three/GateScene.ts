import * as THREE from 'three';

export type GateMood = 'idle' | 'terminal' | 'classic';
export type GateKey = 'terminal' | 'classic';

interface GateOpts {
  onHover?: (k: GateKey | null) => void;
  onSelect?: (k: GateKey) => void;
}

const MOODS: Record<GateMood, [string, string]> = {
  idle: ['#58a6ff', '#d2a8ff'],
  terminal: ['#7ee787', '#2ea043'],
  classic: ['#79c0ff', '#ff7ab6'],
};

const PORTAL_DEF: Record<GateKey, { title: string; sub: string; color: string }> = {
  terminal: { title: 'TERMINAL', sub: '$_  power user', color: '#7ee787' },
  classic: { title: 'CLASSIC', sub: '◆  visual tour', color: '#79c0ff' },
};

/** Draw a portal label onto a canvas and return it as a texture. */
function makeLabelTexture(title: string, sub: string, color: string): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 26;
  ctx.font = '800 78px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(title, w / 2, h / 2 - 22);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(230,236,245,0.78)';
  ctx.font = '500 30px "JetBrains Mono", monospace';
  ctx.fillText(sub, w / 2, h / 2 + 54);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  return tex;
}

export function createGateScene(canvas: HTMLCanvasElement, opts: GateOpts = {}) {
  const isMobile = window.innerWidth < 800;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.9));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02050b, isMobile ? 0.05 : 0.042);

  const camera = new THREE.PerspectiveCamera(isMobile ? 74 : 66, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0.4, 8);

  const colorA = new THREE.Color(MOODS.idle[0]);
  const colorB = new THREE.Color(MOODS.idle[1]);
  const tA = new THREE.Color();

  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(o: T): T => { disposables.push(o); return o; };

  /* ── floor + ceiling grid (the "hall") ── */
  const gridColor = new THREE.Color('#2a3a66');
  const floor = new THREE.GridHelper(80, 80, gridColor, gridColor);
  (floor.material as THREE.Material & { transparent: boolean; opacity: number }).transparent = true;
  (floor.material as THREE.Material & { opacity: number }).opacity = 0.22;
  floor.position.y = -2.4;
  scene.add(floor);
  disposables.push(floor.geometry, floor.material as THREE.Material);

  const ceiling = new THREE.GridHelper(80, 80, gridColor, gridColor);
  (ceiling.material as THREE.Material & { transparent: boolean; opacity: number }).transparent = true;
  (ceiling.material as THREE.Material & { opacity: number }).opacity = 0.12;
  ceiling.position.y = 5.5;
  scene.add(ceiling);
  disposables.push(ceiling.geometry, ceiling.material as THREE.Material);

  /* ── ambient particles ── */
  const pN = isMobile ? 220 : 520;
  const pPos = new Float32Array(pN * 3);
  for (let i = 0; i < pN; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 50;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pPos[i * 3 + 2] = -Math.random() * 60 + 6;
  }
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = track(new THREE.PointsMaterial({
    color: 0x9fc0ff, size: isMobile ? 0.05 : 0.04, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── selectable portals ── */
  type Portal = {
    key: GateKey;
    group: THREE.Group;
    ring: THREE.Mesh;
    ring2: THREE.Mesh;
    discMat: THREE.Material & { opacity: number };
    glowDiscMat: THREE.Material & { opacity: number };
    beamMat: THREE.Material & { opacity: number };
    glowMat: THREE.Material & { opacity: number };
    labelMat: THREE.Material & { opacity: number };
    hit: THREE.Mesh;
    color: THREE.Color;
    hoverT: number;
  };
  const portals: Portal[] = [];
  const px = isMobile ? 2.5 : 3.6;

  (Object.keys(PORTAL_DEF) as GateKey[]).forEach((key, idx) => {
    const def = PORTAL_DEF[key];
    const color = new THREE.Color(def.color);
    const group = new THREE.Group();
    group.position.set(idx === 0 ? -px : px, 0, -2);

    // floor reflection glow
    const floorGlowGeo = track(new THREE.CircleGeometry(2.4, 40));
    const floorGlowMat = track(new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false,
    })) as THREE.MeshBasicMaterial;
    const floorGlow = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -2.38;
    group.add(floorGlow);

    // vertical light beam
    const beamGeo = track(new THREE.CylinderGeometry(0.06, 0.4, 8, 16, 1, true));
    const beamMat = track(new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    })) as THREE.MeshBasicMaterial;
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = -0.4;
    group.add(beam);

    // outer glow disc
    const glowGeo = track(new THREE.CircleGeometry(2.2, 48));
    const glowMat = track(new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false,
    })) as THREE.MeshBasicMaterial;
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.z = -0.05;
    group.add(glow);

    // two rings
    const ringGeo = track(new THREE.TorusGeometry(1.65, 0.05, 12, 110));
    const ringMat = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0 })) as THREE.MeshBasicMaterial;
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const ring2Geo = track(new THREE.TorusGeometry(1.9, 0.015, 8, 110));
    const ring2Mat = track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0 })) as THREE.MeshBasicMaterial;
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    group.add(ring2);

    // inner disc
    const discGeo = track(new THREE.CircleGeometry(1.6, 48));
    const discMat = track(new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false,
    })) as THREE.MeshBasicMaterial;
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.z = -0.03;
    group.add(disc);

    // label
    const labelTex = track(makeLabelTexture(def.title, def.sub, def.color));
    const labelGeo = track(new THREE.PlaneGeometry(2.7, 1.35));
    const labelMat = track(new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, opacity: 0.0, depthWrite: false })) as THREE.MeshBasicMaterial;
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.z = 0.03;
    group.add(label);

    // hit area
    const hitGeo = track(new THREE.CircleGeometry(2.0, 24));
    const hitMat = track(new THREE.MeshBasicMaterial({ visible: false }));
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.userData.key = key;
    group.add(hit);

    group.scale.setScalar(0.0001);
    scene.add(group);
    portals.push({ key, group, ring, ring2, discMat, glowDiscMat: glowMat, beamMat, glowMat: floorGlowMat, labelMat, hit, color, hoverT: 0 });
  });

  const st = { mx: 0, my: 0, ready: 0, targetReady: 0, warp: 0, targetWarp: 0, auto: 0 };
  let mood: GateMood = 'idle';
  let hovered: GateKey | null = null;
  let pointerActive = false;
  const clock = new THREE.Clock();
  let raf = 0;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const updateHover = () => {
    if (st.ready < 0.5) return;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(portals.map(p => p.hit), false);
    const key = (hits[0]?.object.userData.key as GateKey | undefined) ?? null;
    if (key !== hovered) {
      hovered = key;
      mood = key ?? 'idle';
      opts.onHover?.(key);
      canvas.style.cursor = key ? 'pointer' : 'grab';
    }
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    st.ready += (st.targetReady - st.ready) * 0.06;
    st.warp += (st.targetWarp - st.warp) * 0.06;

    tA.set(MOODS[mood][0]);
    colorA.lerp(tA, 0.06);
    tA.set(MOODS[mood][1]);
    colorB.lerp(tA, 0.06);

    // idle auto-sway when the user isn't steering
    if (!pointerActive) st.auto += dt * 0.25;
    const ax = pointerActive ? st.mx : Math.sin(st.auto) * 0.35;
    const ay = pointerActive ? st.my : Math.sin(st.auto * 0.7) * 0.12;

    // particles drift
    particles.rotation.y += dt * 0.01;
    particles.position.z = (particles.position.z + dt * (0.6 + st.warp * 8)) % 12;

    portals.forEach((p, i) => {
      const isHover = hovered === p.key;
      p.hoverT += ((isHover ? 1 : 0) - p.hoverT) * 0.12;
      const vis = st.ready * (1 - st.warp);
      const bob = Math.sin(t * 1.0 + i * 1.7) * 0.1;
      p.group.scale.setScalar(Math.max(0.0001, vis * (1 + p.hoverT * 0.12)));
      p.group.position.y = bob + p.hoverT * 0.12;
      p.group.position.z = -2 + p.hoverT * 0.7 - st.warp * 10;
      p.ring.rotation.z += dt * (0.25 + p.hoverT * 0.9) * (i ? -1 : 1);
      p.ring2.rotation.z -= dt * (0.15 + p.hoverT * 0.6) * (i ? -1 : 1);
      (p.ring.material as THREE.Material & { opacity: number }).opacity = vis * (0.6 + p.hoverT * 0.4);
      (p.ring2.material as THREE.Material & { opacity: number }).opacity = vis * (0.3 + p.hoverT * 0.5);
      p.labelMat.opacity = vis;
      p.glowMat.opacity = vis * (0.1 + p.hoverT * 0.3);
      p.beamMat.opacity = vis * (0.06 + p.hoverT * 0.22);
      p.discMat.opacity = vis * (0.05 + p.hoverT * 0.14);
      p.glowDiscMat.opacity = vis * (0.05 + p.hoverT * 0.18);
    });

    // camera orbit (look around the hall)
    const yaw = ax * 0.4;
    const pitch = ay * 0.22;
    const rad = isMobile ? 8.4 : 8;
    const tx = Math.sin(yaw) * rad;
    const tz = Math.cos(yaw) * rad - st.warp * 9;
    camera.position.x += (tx - camera.position.x) * 0.06;
    camera.position.z += (tz - camera.position.z) * 0.06;
    camera.position.y += (0.4 + pitch * 2.2 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, -2);
    camera.fov = (isMobile ? 74 : 66) + st.warp * 40;
    camera.updateProjectionMatrix();

    // fade the hall out during warp
    const hallOp = 1 - st.warp;
    (floor.material as THREE.Material & { opacity: number }).opacity = 0.22 * hallOp;
    (ceiling.material as THREE.Material & { opacity: number }).opacity = 0.12 * hallOp;

    updateHover();
    renderer.render(scene, camera);
  };
  frame();

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  const onMove = (e: PointerEvent) => {
    pointerActive = true;
    st.mx = (e.clientX / window.innerWidth - 0.5) * 2;
    st.my = -(e.clientY / window.innerHeight - 0.5) * 2;
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const onLeave = () => { pointerActive = false; };
  const onClick = () => { if (hovered) opts.onSelect?.(hovered); };
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);
  canvas.style.cursor = 'grab';

  return {
    setMood(m: GateMood) { mood = m; },
    setReady(v: boolean) { st.targetReady = v ? 1 : 0; },
    hoverPortal(k: GateKey | null) {
      hovered = k;
      mood = k ?? 'idle';
      opts.onHover?.(k);
    },
    warp() { st.targetWarp = 1; st.targetReady = 0; },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    },
  };
}
