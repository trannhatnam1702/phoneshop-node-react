import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cart.js';
import toast from 'react-hot-toast';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './client.css';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [show3DModel, setShow3DModel] = useState(false);

    useEffect(() => {
        if (params?.slug) getProduct();
        // eslint-disable-next-line
    }, [params?.slug]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.products);
            getRelatedProduct(data?.products._id, data?.products.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    const getRelatedProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    }

    const load3DModel = () => {
        if (show3DModel && product?._id) {
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

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.update();

            // Tải model từ URL và hiển thị
            axios.get(`${process.env.REACT_APP_API}/api/v1/product/image3d-product/${product._id}`, {
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

            const popupContainer = document.getElementById('popup-container');
            if (popupContainer) {
                popupContainer.innerHTML = '';
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
        }
    };

    useEffect(() => {
        if (show3DModel) {
            load3DModel();
        }
    }, [show3DModel, product._id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleOpen3DModel = () => {
        setShow3DModel(true);
    };

    const handleClose3DModel = () => {
        setShow3DModel(false);
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.innerHTML = '';
        }
    };

    return (
        <Layout>
            <div className='row container mt-4'>
                <div className='d-flex justify-content-evenly'>
                    <div className='col-md-5'>
                        <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${product._id}`} className="card-img-top" alt={product.name} height={'500px'} width={'100px'} />
                    </div>
                    <div className='col-md-6'>
                        <div className='ms-5'>
                            <h2 className='text-center'>Product Details</h2>
                            <h4>Name: {product.name}</h4>
                            <h4>Category: {product?.category?.name}</h4>
                            <h4>Price: {product.price}</h4>
                            <h4>Description: {product.description}</h4>
                            <button className="btn btn-secondary ms-1" onClick={() => {
                                setCart([...cart, product]);
                                localStorage.setItem(
                                    "cart",
                                    JSON.stringify([...cart, product])
                                );
                                toast.success('Product added to Cart!');
                            }}>Add to cart</button>
                            <button className="btn btn-secondary ms-1" onClick={handleOpen3DModel}>Watch 3D</button>
                            {show3DModel && (
                                <div className="popup-overlay" onClick={handleClose3DModel}>
                                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                                        <div className="popup-container" id="popup-container">
                                            { }
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button className="btn btn-secondary ms-1" onClick={handleGoBack}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row container'>
                <h6>Similar Products</h6>
                {relatedProducts.length < 1 && (<p className='text-center'>No Similar Product found</p>)}
                <div className='d-flex flex-wrap my-3'>
                    {relatedProducts?.map(p => (
                        <div key={p._id} className="card m-2" style={{ width: '16rem' }}>
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 30)}...</p>
                                <p className="card-text">${p.price}</p>
                                <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details...</button>
                                <button className="btn btn-secondary ms-1" onClick={() => {
                                    setCart([...cart, p]);
                                    localStorage.setItem(
                                        "cart",
                                        JSON.stringify([...cart, p])
                                    );
                                    toast.success('Product added to Cart!');
                                }}>Add to cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default ProductDetails;
