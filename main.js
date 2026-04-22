import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTENEDOR
const container = document.getElementById('scene-container');
container.appendChild(renderer.domElement);

// ================= ESCENA =================
const scene = new THREE.Scene();

// ================= CÁMARA =================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 20);

// ================= CONTROLES =================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ================= LUCES =================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

// Luz azul futurista
const blueLight = new THREE.PointLight(0x00ffff, 1, 50);
blueLight.position.set(0, 5, 0);
scene.add(blueLight);

// ================= PISO GLASS =================
const groundGeometry = new THREE.PlaneGeometry(200, 200);
groundGeometry.rotateX(-Math.PI / 2);

const groundMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x88ccff,
  transparent: true,
  opacity: 0.25,
  roughness: 0.1,
  metalness: 0.3,
  transmission: 1,
  thickness: 0.5,
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ================= GRID =================
const grid = new THREE.GridHelper(200, 40, 0x00ffff, 0x00ffff);
grid.position.y = 0.01;
grid.material.opacity = 0.5;
grid.material.transparent = true;
scene.add(grid);

// ================= FONDO =================
const textureLoader = new THREE.TextureLoader();
textureLoader.load('textures/space.jpg', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

// ================= MODELO =================
const gltfLoader = new GLTFLoader().setPath('./millenium_falcon/');
gltfLoader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.position.set(0, 1, 0);

  scene.add(mesh);
});

// ================= ANIMACIÓN =================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ================= RESPONSIVE =================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});