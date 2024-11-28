import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { Tween, Easing, Group } from '@tweenjs/tween.js';

// **Scenes**
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
let currentScene = scene1;

// **Set Background Colors for Scenes**
scene1.background = new THREE.Color(0x000000); // Black
scene2.background = new THREE.Color(0x333333); // Dark gray

// **Camera**
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

// **Renderer**
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// **Controls**
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// **Lighting for scene1**
const ambientLight1 = new THREE.AmbientLight(0x404040, 1);
scene1.add(ambientLight1);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(10, 10, 10);
scene1.add(directionalLight1);

// **Lighting for scene2**
const ambientLight2 = new THREE.AmbientLight(0x404040, 1);
scene2.add(ambientLight2);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(10, 10, 10);
scene2.add(directionalLight2);

// **Load Models**
const loader = new GLTFLoader();
let billboard1: THREE.Group, billboard2: THREE.Group;

// Load billboardModel.glb into scene1
loader.load(
  'models/BillboardModel.glb',
  function (gltf) {
    billboard1 = gltf.scene;
    billboard1.name = 'billboard1';
    scene1.add(billboard1);
    console.log('Billboard1 loaded:', billboard1);
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the first model:', error);
  }
);

// Load BillboardModel_2.glb into scene2
loader.load(
  'models/BillboardModel_2.glb',
  function (gltf) {
    billboard2 = gltf.scene;
    billboard2.name = 'billboard2';
    billboard2.position.set(10, 0, 0); // Move billboard2 to a different position
    scene2.add(billboard2);
    console.log('Billboard2 loaded:', billboard2);
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the second model:', error);
  }
);

// **Raycaster for Interaction**
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event: MouseEvent) {
  // Normalize mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Find intersections
  const intersects = raycaster.intersectObjects(currentScene.children, true);

  if (intersects.length > 0) {
    console.log('Intersections detected:', intersects);
    let clickedObject: THREE.Object3D | null = intersects[0].object;

    // Traverse up the parent chain to find the billboard
    while (clickedObject) {
      console.log('Checking object:', clickedObject.name);
      if (clickedObject.name === 'billboard1' || clickedObject.name === 'billboard2') {
        console.log('Billboard clicked:', clickedObject.name);
        // Animate camera transition
        animateCameraTransition();
        break;
      }
      clickedObject = clickedObject.parent;
    }
  } else {
    console.log('No intersections detected.');
  }
}

window.addEventListener('click', onMouseClick, false);

// **Create Tween Group**
const tweenGroup = new Group();

// **Animate Camera Transition**
function animateCameraTransition() {
  console.log('animateCameraTransition called');

  let targetScene;

  if (currentScene === scene1) {
    console.log('Transitioning to scene2');
    targetScene = scene2;
  } else {
    console.log('Transitioning to scene1');
    targetScene = scene1;
  }

  // Define the target camera position
  const targetPosition = {
    x: camera.position.x + 50,
    y: camera.position.y,
    z: camera.position.z,
  };
  console.log('Animating camera to position:', targetPosition);

  // Create a tween for the camera position
  const cameraTween = new Tween(camera.position, tweenGroup)
    .to(targetPosition, 2000) // Duration in milliseconds
    .easing(Easing.Quadratic.InOut)
    .onUpdate(() => {
      console.log('onUpdate called...');
      controls.update();
    })
    .onComplete(() => {
      console.log('Camera animation complete, resetting position and switching scenes');
      // Reset camera position and switch scenes
      camera.position.set(0, 0, 10);
      controls.update(); // Update controls after changing camera position
      currentScene = targetScene;
      console.log('Current scene updated to:', currentScene === scene1 ? 'scene1' : 'scene2');
    })
    .start();
}

// **Animation Loop**
function animate(time: number): void {
  requestAnimationFrame(animate);
  controls.update();
  tweenGroup.update(time); // Update the tweens using the group
  renderer.render(currentScene, camera);
}

// Start the animation loop
requestAnimationFrame(animate);

// **Handle Window Resizing**
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


