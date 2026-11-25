import * as THREE from 'three';

const WARP_VERT = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uDepth;
attribute float aEnd;
attribute float aSeed;
varying float vA;
varying float vSeed;
void main(){
  vec3 p = position;
  float z = mod(p.z + uTime*uSpeed, uDepth) - uDepth + 6.0;
  p.z = z - aEnd * (0.25 + uSpeed*0.06);
  vSeed = aSeed;
  vA = smoothstep(-uDepth, -uDepth*0.6, z) * (1.0 - aEnd*0.7);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}`;

const WARP_FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vA;
varying float vSeed;
void main(){
  gl_FragColor = vec4(mix(uColorA,uColorB,vSeed), vA);
}`;

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

const PORTAL_DEF: Record<GateKey, { x: number; title: string; sub: string; color: string }> = {
  terminal: { x: -3.35, title: 'TERMINAL', sub: '$_  power user', color: '#7ee787' },
  classic: { x: 3.35, title: 'CLASSIC', sub: '◆  visual tour', color: '#79c0ff' },
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
  ctx.shadowBlur = 24;
  ctx.font = '800 76px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(title, w / 2, h / 2 - 20);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(230,236,245,0.72)';
  ctx.font = '500 30px "JetBrains Mono", monospace';
  ctx.fillText(sub, w / 2, h / 2 + 52);

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function createGateScene(canvas: HTMLCanvasElement, opts: GateOpts = {}) {
  const isMobile = window.innerWidth < 800;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 7);

  const colorA = new THREE.Color(MOODS.idle[0]);
  const colorB = new THREE.Color(MOODS.idle[1]);
  const tA = new THREE.Color();

  /* ── background warp field ── */
  const N = isMobile ? 420 : 1100;
  const pos = new Float32Array(N * 2 * 3);
  const end = new Float32Array(N * 2);
  const seed = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.pow(Math.random(), 1.4) * 22;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.65;
    const z = Math.random() * 90;
    const s = Math.random();
    for (let k = 0; k < 2; k++) {
      const o = (i * 2 + k) * 3;
      pos[o] = x;
      pos[o + 1] = y;
      pos[o + 2] = z;
      end[i * 2 + k] = k;
      seed[i * 2 + k] = s;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: WARP_VERT,
    fragmentShader: WARP_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 1.2 },
      uDepth: { value: 90 },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    },
  });
  scene.add(new THREE.LineSegments(geo, mat));

  /* ── two selectable portals ── */
  type Portal = {
    key: GateKey;
    group: THREE.Group;
    ring: THREE.Mesh;
    ringMat: THREE.MeshBasicMaterial;
    glowMat: THREE.MeshBasicMaterial;
    labelMat: THREE.MeshBasicMaterial;
    hit: THREE.Mesh;
    baseX: number;
    color: THREE.Color;
    hoverT: number; // 0..1
  };
  const portals: Portal[] = [];
  const disposables: Array<{ dispose(): void }> = [];

  (Object.keys(PORTAL_DEF) as GateKey[]).forEach(key => {
    const def = PORTAL_DEF[key];
    const color = new THREE.Color(def.color);
    const group = new THREE.Group();
    group.position.set(def.x, 0, -1.5);

    // outer glow disc
    const glowGeo = new THREE.CircleGeometry(2.0, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    // ring
    const ringGeo = new THREE.TorusGeometry(1.55, 0.045, 10, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    // inner faint disc
    const discGeo = new THREE.CircleGeometry(1.5, 48);
    const discMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.z = -0.02;
    group.add(disc);

    // label
    const labelTex = makeLabelTexture(def.title, def.sub, def.color);
    const labelGeo = new THREE.PlaneGeometry(2.6, 1.3);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, opacity: 0.0, depthWrite: false });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.z = 0.02;
    group.add(label);

    // invisible hit area (bigger for easy hover/click)
    const hitGeo = new THREE.CircleGeometry(1.9, 24);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.userData.key = key;
    group.add(hit);

    group.scale.setScalar(0.0001); // hidden until ready
    scene.add(group);

    portals.push({ key, group, ring, ringMat, glowMat, labelMat, hit, baseX: def.x, color, hoverT: 0 });
    disposables.push(glowGeo, glowMat, ringGeo, ringMat, discGeo, discMat, labelGeo, labelMat, labelTex, hitGeo, hitMat);
  });

  const st = { speed: 1.2, target: 1.2, mx: 0, my: 0, ready: 0, targetReady: 0 };
  let mood: GateMood = 'idle';
  let hovered: GateKey | null = null;
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
      opts.onHover?.(key);
      canvas.style.cursor = key ? 'pointer' : 'default';
    }
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    st.speed += (st.target - st.speed) * 0.045;
    st.ready += (st.targetReady - st.ready) * 0.06;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uSpeed.value = st.speed;

    tA.set(MOODS[mood][0]);
    colorA.lerp(tA, 0.06);
    tA.set(MOODS[mood][1]);
    colorB.lerp(tA, 0.06);

    // portals
    portals.forEach((p, i) => {
      const isHover = hovered === p.key;
      p.hoverT += ((isHover ? 1 : 0) - p.hoverT) * 0.12;
      const vis = st.ready;
      const bob = Math.sin(t * 1.1 + i * 1.7) * 0.12;
      const s = vis * (1 + p.hoverT * 0.14);
      p.group.scale.setScalar(Math.max(0.0001, s));
      p.group.position.y = bob + p.hoverT * 0.15;
      p.group.position.z = -1.5 + p.hoverT * 0.6;
      p.ring.rotation.z += dt * (0.2 + p.hoverT * 0.8) * (i ? -1 : 1);
      p.ringMat.opacity = vis * (0.55 + p.hoverT * 0.45);
      p.glowMat.opacity = vis * (0.08 + p.hoverT * 0.22);
      p.labelMat.opacity = vis;
    });

    // camera "look around" orbit from pointer
    const yaw = st.mx * 0.42;
    const pitch = st.my * 0.26;
    const rad = 7;
    camera.position.x += (Math.sin(yaw) * rad - camera.position.x) * 0.06;
    camera.position.z += (Math.cos(yaw) * rad - camera.position.z) * 0.06;
    camera.position.y += (pitch * 2.2 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, -1.5);

    camera.fov = 68 + Math.min(st.speed, 80) * 0.7;
    camera.updateProjectionMatrix();

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
    st.mx = (e.clientX / window.innerWidth - 0.5) * 2;
    st.my = -(e.clientY / window.innerHeight - 0.5) * 2;
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const onClick = () => {
    if (hovered) opts.onSelect?.(hovered);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);

  return {
    setMood(m: GateMood) {
      mood = m;
      st.target = m === 'idle' ? 1.2 : 3.2;
    },
    /** Reveal the selectable portals once the boot sequence finishes. */
    setReady(v: boolean) {
      st.targetReady = v ? 1 : 0;
    },
    hoverPortal(k: GateKey | null) {
      // allow external (button) hover to drive the scene highlight
      if (k) {
        hovered = k;
        mood = k;
      } else if (hovered) {
        hovered = null;
        mood = 'idle';
      }
    },
    warp() {
      st.target = 150;
      st.targetReady = 0;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('click', onClick);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      disposables.forEach(d => d.dispose());
      mat.dispose();
      renderer.dispose();
    },
  };
}
