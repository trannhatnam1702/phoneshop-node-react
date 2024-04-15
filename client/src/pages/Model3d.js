import React, { useEffect } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useParams } from 'react-router-dom';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Model3d = () => {
    const params = useParams();

    useEffect(() => {
        const load3DModel = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/image3d-product/${params.id}`, {
                    responseType: 'arraybuffer'
                });
                const arrayBuffer = response.data;

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ antialias: true });

                renderer.setClearColor(0xffffff, 0.05);
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);

                const loader = new GLTFLoader();
                loader.parse(arrayBuffer, '', (gltf) => {
                    const object = gltf.scene;
                    scene.add(object);

                    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                    scene.add(ambientLight);

                    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
                    directionalLight.position.set(3, 10, 3);
                    scene.add(directionalLight);

                    const boundingBox = new THREE.Box3().setFromObject(object);
                    const center = boundingBox.getCenter(new THREE.Vector3());
                    const size = boundingBox.getSize(new THREE.Vector3());

                    // Đặt camera ở trung tâm của mô hình
                    camera.position.copy(center);
                    // Điều chỉnh khoảng cách camera để mô hình nằm trung tâm trong khung hình
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = camera.fov * (Math.PI / 180); // Chuyển đổi góc FOV sang radian
                    const distance = Math.abs(maxDim / Math.sin(fov / 2));
                    camera.position.z = distance;

                    camera.lookAt(center);

                    // Tạo controls và chỉnh vị trí
                    const controls = new OrbitControls(camera, renderer.domElement);
                    controls.target.copy(center);
                    controls.update();

                    const animate = () => {
                        requestAnimationFrame(animate);
                        controls.update();
                        renderer.render(scene, camera);
                    };

                    animate();
                });
            } catch (error) {
                console.error('Error loading 3D model:', error);
            }
        };

        load3DModel();

        // Cleanup khi component unmount
        return () => {
            const canvas = document.querySelector('canvas');
            canvas && document.body.removeChild(canvas);
        };
    }, [params.id]);

    return null; // Không cần render gì cả, do mọi thứ được render trong useEffect
};

export default Model3d;
