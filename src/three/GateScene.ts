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

const MOODS: Record<GateMood, [string, string]> = {
  idle: ['#58a6ff', '#d2a8ff'],
  terminal: ['#7ee787', '#2ea043'],
  classic: ['#79c0ff', '#ff7ab6'],
};

export function createGateScene(canvas: HTMLCanvasElement) {
  const isMobile = window.innerWidth < 800;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 6;

  const colorA = new THREE.Color(MOODS.idle[0]);
  const colorB = new THREE.Color(MOODS.idle[1]);
  const tA = new THREE.Color();

  const N = isMobile ? 500 : 1400;
  const pos = new Float32Array(N * 2 * 3);
  const end = new Float32Array(N * 2);
  const seed = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.6 + Math.pow(Math.random(), 1.4) * 20;
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
      uSpeed: { value: 2 },
      uDepth: { value: 90 },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    },
  });
  scene.add(new THREE.LineSegments(geo, mat));

  /* tunnel rings */
  const ringMat = new THREE.MeshBasicMaterial({ color: colorA, transparent: true, opacity: 0.35 });
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(4.5 + i * 0.35, 0.01, 6, 120), ringMat);
    r.position.z = -i * 7;
    rings.push(r);
    scene.add(r);
  }
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 1),
    new THREE.MeshBasicMaterial({ color: colorB, wireframe: true, transparent: true, opacity: 0.35 }),
  );
  core.position.z = -6;
  scene.add(core);

  const st = { speed: 2, target: 2, mx: 0, my: 0, flash: 0 };
  let mood: GateMood = 'idle';
  const clock = new THREE.Clock();
  let raf = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    st.speed += (st.target - st.speed) * 0.045;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uSpeed.value = st.speed;

    tA.set(MOODS[mood][0]);
    colorA.lerp(tA, 0.06);
    tA.set(MOODS[mood][1]);
    colorB.lerp(tA, 0.06);
    ringMat.color.copy(colorA);
    (core.material as THREE.MeshBasicMaterial).color.copy(colorB);

    rings.forEach((r, i) => {
      r.position.z = ((r.position.z + dt * st.speed * 1.2 + 63) % 63) - 63 + 0 * i;
      r.rotation.z += dt * 0.1 * (i % 2 ? 1 : -1);
    });
    core.rotation.x += dt * 0.3;
    core.rotation.y += dt * 0.4;
    core.scale.setScalar(1 + Math.sin(t * 2) * 0.05 + st.speed * 0.02);

    camera.fov = 70 + Math.min(st.speed, 60) * 0.9;
    camera.updateProjectionMatrix();
    camera.position.x += (st.mx * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (st.my * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -20);
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
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onMove);

  return {
    setMood(m: GateMood) {
      mood = m;
      st.target = m === 'idle' ? 2 : 6;
    },
    warp() {
      st.target = 140;
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      mat.dispose();
      ringMat.dispose();
      renderer.dispose();
    },
  };
}
