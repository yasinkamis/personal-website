import * as THREE from 'three';

/* Ashima 3D simplex noise */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const CORE_VERT = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uDistort;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  float n = snoise(normal*1.6 + vec3(uTime*0.25));
  float n2 = snoise(normal*3.4 - vec3(uTime*0.4));
  float d = n*uDistort + n2*uDistort*0.25;
  vec3 pos = position + normal*d;
  vNoise = d;
  vec4 mv = modelViewMatrix*vec4(pos,1.0);
  vNormal = normalize(normalMatrix*normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`;

const CORE_FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  float f = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
  float bands = 0.5 + 0.5*sin(vNoise*14.0 + uTime*0.8);
  vec3 base = mix(uColorA, uColorB, smoothstep(-0.4,0.4,vNoise) * 0.8 + bands*0.2);
  vec3 col = base*0.28 + base*f*1.6 + vec3(f*f)*0.55;
  gl_FragColor = vec4(col, 0.92);
}`;

const STAR_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
varying float vTw;
void main(){
  vec3 p = position;
  p.x += sin(uTime*0.15 + aSeed*20.0)*0.35;
  p.y += cos(uTime*0.12 + aSeed*17.0)*0.35;
  vec4 mv = modelViewMatrix*vec4(p,1.0);
  gl_Position = projectionMatrix*mv;
  vTw = 0.55 + 0.45*sin(uTime*1.5 + aSeed*40.0);
  gl_PointSize = (1.2 + aSeed*3.2) * uPx * (22.0 / -mv.z);
}`;

const STAR_FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if(d>0.5) discard;
  float a = smoothstep(0.5,0.0,d) * vTw;
  gl_FragColor = vec4(mix(uColorA,uColorB,vTw), a);
}`;

export interface SceneState {
  scroll: number;
  mx: number;
  my: number;
  velocity: number;
  boost: number;
}

interface Key {
  core: [number, number, number];
  scale: number;
  a: string;
  b: string;
  distort: number;
}

/* one key per page section (hero → contact) */
const KEYS: Key[] = [
  { core: [2.7, 0.1, 0], scale: 1.55, a: '#58a6ff', b: '#d2a8ff', distort: 0.42 },
  { core: [-2.9, 0, -1], scale: 1.1, a: '#7ee787', b: '#58a6ff', distort: 0.25 },
  { core: [4.4, 0.8, -9], scale: 1.5, a: '#d2a8ff', b: '#ff7ab6', distort: 0.7 },
  { core: [3.2, -1, -3], scale: 0.95, a: '#ffa657', b: '#ff5d8f', distort: 0.32 },
  { core: [-3.1, 0.5, -2], scale: 1.2, a: '#79c0ff', b: '#7ee787', distort: 0.5 },
  { core: [0, 0, -9], scale: 2.4, a: '#d2a8ff', b: '#58a6ff', distort: 0.2 },
  { core: [0, -0.1, 0.5], scale: 1.8, a: '#7ee787', b: '#58a6ff', distort: 0.62 },
];

const smooth = (u: number) => u * u * (3 - 2 * u);

export function createClassicScene(canvas: HTMLCanvasElement, state: SceneState) {
  const isMobile = window.innerWidth < 800;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 160);
  camera.position.set(0, 0, 9);

  const colorA = new THREE.Color(KEYS[0].a);
  const colorB = new THREE.Color(KEYS[0].b);
  const tmpA = new THREE.Color();
  const tmpB = new THREE.Color();

  /* ── Core (distorted iridescent orb) ── */
  const core = new THREE.Group();
  scene.add(core);

  const coreMat = new THREE.ShaderMaterial({
    vertexShader: CORE_VERT,
    fragmentShader: CORE_FRAG,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDistort: { value: KEYS[0].distort },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    },
  });
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1, isMobile ? 14 : 32), coreMat);
  core.add(orb);

  const shellMat = new THREE.MeshBasicMaterial({ color: colorA, wireframe: true, transparent: true, opacity: 0.16 });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 2), shellMat);
  core.add(shell);

  const ringMats: THREE.MeshBasicMaterial[] = [];
  const rings: THREE.Mesh[] = [];
  [1.85, 2.2, 2.6].forEach((r, i) => {
    const m = new THREE.MeshBasicMaterial({ color: colorB, transparent: true, opacity: 0.55 - i * 0.12 });
    ringMats.push(m);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012 + i * 0.004, 8, 160), m);
    ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    rings.push(ring);
    core.add(ring);
  });

  /* orbiting satellites on the first ring */
  const satGeo = new THREE.OctahedronGeometry(0.09, 0);
  const sats: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    sats.push(s);
    core.add(s);
  }

  /* ── Fly-through world: stars + floating wire shapes ── */
  const world = new THREE.Group();
  scene.add(world);

  const STAR_COUNT = isMobile ? 1500 : 3600;
  const sPos = new Float32Array(STAR_COUNT * 3);
  const sSeed = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 3 + Math.pow(Math.random(), 0.7) * 26;
    const th = Math.random() * Math.PI * 2;
    sPos[i * 3] = Math.cos(th) * r;
    sPos[i * 3 + 1] = Math.sin(th) * r * 0.7;
    sPos[i * 3 + 2] = -75 + Math.random() * 82;
    sSeed[i] = Math.random();
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute('aSeed', new THREE.BufferAttribute(sSeed, 1));
  const starMat = new THREE.ShaderMaterial({
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: dpr },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    },
  });
  world.add(new THREE.Points(starGeo, starMat));

  const shapeGeos = [
    new THREE.OctahedronGeometry(0.7),
    new THREE.TetrahedronGeometry(0.8),
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.TorusKnotGeometry(0.5, 0.14, 64, 8),
    new THREE.IcosahedronGeometry(0.65, 0),
    new THREE.TorusGeometry(0.6, 0.05, 6, 24),
  ].map(g => new THREE.EdgesGeometry(g));
  const shapeMats: THREE.LineBasicMaterial[] = [];
  const shapes: { m: THREE.LineSegments; spin: THREE.Vector3; base: THREE.Vector3; ph: number }[] = [];
  const SHAPE_COUNT = isMobile ? 16 : 34;
  for (let i = 0; i < SHAPE_COUNT; i++) {
    const mat = new THREE.LineBasicMaterial({ color: i % 2 ? colorA : colorB, transparent: true, opacity: 0.55 });
    shapeMats.push(mat);
    const m = new THREE.LineSegments(shapeGeos[i % shapeGeos.length], mat);
    const side = i % 2 ? 1 : -1;
    const base = new THREE.Vector3(side * (3.2 + Math.random() * 7), (Math.random() - 0.5) * 11, -62 + (i / SHAPE_COUNT) * 66);
    m.position.copy(base);
    m.scale.setScalar(0.6 + Math.random() * 1.5);
    m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    world.add(m);
    shapes.push({ m, spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), base, ph: Math.random() * 6 });
  }

  /* ── Loop ── */
  const sm = { scroll: 0, mx: 0, my: 0, vel: 0 };
  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;
  let slowFrames = 0;
  let degraded = false;
  let degradedTwice = false;
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;

  const frame = () => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const rawDt = clock.getDelta();
    const dt = Math.min(rawDt, 0.05);
    /* adaptive quality: sustained <~30fps → drop to 1x pixel ratio, once */
    if (!degradedTwice) {
      slowFrames = rawDt > 0.034 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 50) {
        slowFrames = 0;
        if (!degraded) {
          /* level 1: 1x pixel ratio */
          degraded = true;
          renderer.setPixelRatio(1);
          starMat.uniforms.uPx.value = 1;
          renderer.setSize(window.innerWidth, window.innerHeight, false);
        } else {
          /* level 2: fewer stars, hide floating shapes, calmer shell */
          degradedTwice = true;
          starGeo.setDrawRange(0, Math.floor(STAR_COUNT * 0.35));
          shapes.forEach(s => { s.m.visible = false; });
          shell.visible = false;
        }
      }
    }
    const t = clock.elapsedTime * (reduced ? 0.3 : 1);

    sm.scroll += (state.scroll - sm.scroll) * 0.06;
    sm.mx += (state.mx - sm.mx) * 0.05;
    sm.my += (state.my - sm.my) * 0.05;
    sm.vel += (Math.min(Math.abs(state.velocity), 60) - sm.vel) * 0.08;

    /* key interpolation */
    const seg = sm.scroll * (KEYS.length - 1);
    const i0 = Math.min(Math.floor(seg), KEYS.length - 2);
    const u = smooth(Math.min(Math.max(seg - i0, 0), 1));
    const k0 = KEYS[i0];
    const k1 = KEYS[i0 + 1];
    const aspect = camera.aspect;
    const narrow = Math.min(1, aspect / 1.4);

    const portrait = aspect < 0.95;
    /* portrait phones: keep the orb small, centered at the top and pushed back so it never sits behind text */
    const cx = portrait ? 0 : THREE.MathUtils.lerp(k0.core[0], k1.core[0], u) * narrow;
    const cy = portrait ? 2.9 : THREE.MathUtils.lerp(k0.core[1], k1.core[1], u);
    const cz = THREE.MathUtils.lerp(k0.core[2], k1.core[2], u) - (portrait ? 3 : 0);
    const sc = THREE.MathUtils.lerp(k0.scale, k1.scale, u) * (portrait ? 0.5 : 0.55 + 0.45 * narrow) * (1 + state.boost * 0.35);
    core.position.set(cx + sm.mx * 0.25, cy + sm.my * 0.2 + Math.sin(t * 0.7) * 0.12, cz);
    core.scale.setScalar(sc);
    core.rotation.y += dt * (0.12 + sm.vel * 0.04);
    core.rotation.x = sm.my * 0.25 + Math.sin(t * 0.3) * 0.1;
    core.rotation.z = sm.mx * 0.15;

    tmpA.set(k0.a).lerp(tmpB.set(k1.a), u);
    colorA.lerp(tmpA, 0.07);
    tmpA.set(k0.b).lerp(tmpB.set(k1.b), u);
    colorB.lerp(tmpA, 0.07);
    coreMat.uniforms.uDistort.value = THREE.MathUtils.lerp(k0.distort, k1.distort, u) + sm.vel * 0.006 + state.boost * 0.25;
    coreMat.uniforms.uTime.value = t;
    starMat.uniforms.uTime.value = t;
    shellMat.color.copy(colorA);
    ringMats.forEach(m => m.color.copy(colorB));
    shapeMats.forEach((m, i) => m.color.copy(i % 2 ? colorA : colorB));

    shell.rotation.y -= dt * 0.15;
    shell.rotation.x += dt * 0.05;
    rings.forEach((r, i) => {
      r.rotation.x += dt * (0.25 + i * 0.12);
      r.rotation.y += dt * (0.18 - i * 0.07);
    });
    sats.forEach((s, i) => {
      const a = t * (0.9 + i * 0.35) + i * 2.1;
      const rad = 1.85 + i * 0.35;
      s.position.set(Math.cos(a) * rad, Math.sin(a * 1.3 + i) * rad * 0.55, Math.sin(a) * rad);
      s.rotation.x += dt * 2;
      s.rotation.y += dt * 2;
    });

    /* fly-through */
    world.position.z = sm.scroll * 62;
    shapes.forEach(s => {
      s.m.rotation.x += dt * s.spin.x * (0.6 + sm.vel * 0.05);
      s.m.rotation.y += dt * s.spin.y * (0.6 + sm.vel * 0.05);
      s.m.position.y = s.base.y + Math.sin(t * 0.5 + s.ph) * 0.5;
    });

    /* camera parallax */
    camera.position.x += (sm.mx * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (sm.my * 0.6 - camera.position.y) * 0.04;
    camera.position.z = 9 - state.boost * 1.5;
    const fov = 50 + Math.min(sm.vel, 40) * 0.35;
    if (Math.abs(fov - camera.fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  frame();

  const onResize = () => {
    /* ignore mobile URL-bar height jitter; only react to real size changes */
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 140) return;
    lastW = w;
    lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  const onVis = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      clock.getDelta();
      frame();
    }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat?.dispose?.();
      });
      /* no forceContextLoss: StrictMode remounts reuse the same canvas */
      renderer.dispose();
    },
  };
}
