import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import axios from 'axios';

const load3DModel = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log(productId);

    if (!productId) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setClearColor(0xffffff, 0.05);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const loader = new GLTFLoader();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(3, 10, 3);
    scene.add(directionalLight);

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Tải model từ URL và hiển thị
    axios.get(`https://picked-primate-poorly.ngrok-free.app/api/v1/product/image3d-product/${productId}`, {
        responseType: 'arraybuffer'
    }).then(response => {
        const arrayBuffer = response.data;
        loader.parse(arrayBuffer, '', (gltf) => {
            const object = gltf.scene;
            scene.add(object);

            const boundingBox = new THREE.Box3().setFromObject(object);
            const center = boundingBox.getCenter(new THREE.Vector3());
            const size = boundingBox.getSize(new THREE.Vector3());

            camera.position.copy(center);
            camera.position.x += Math.max(size.x, size.y, size.z) * 2;
            camera.position.y += Math.max(size.x, size.y, size.z) * 0.5;
            camera.lookAt(center);

            controls.target.copy(center);
            controls.update();
        });
    }).catch(error => {
        console.error('Error loading 3D model:', error);
    });

    const popupContainer = document.getElementById('model-container');
    if (popupContainer) {
        popupContainer.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
};

export default load3DModel;