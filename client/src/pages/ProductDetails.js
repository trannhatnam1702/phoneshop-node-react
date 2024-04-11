import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/layout'
import { useNavigate, useParams } from 'react-router-dom'
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
    const [relatedProducts, setRelatedProductss] = useState([]);
    const [show3DModel,setShow3DModel] = useState(false);

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
            setRelatedProductss(data?.products);
        } catch (error) {
            console.log(error);
        }
    }
        //Hàm tạo mô hình 3D
        const load3DModel = () => {
            if(show3DModel) {
                const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            
            renderer.setClearColor(0xffffff, 0.05);
            renderer.setSize(1000, 600);
        
            const width = window.innerWidth;
            const height = window.innerHeight;  
            const loader = new GLTFLoader();
    
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
    
            const spotLight = new THREE.SpotLight(0xffffff, 0.5);
            spotLight.position.set(6, 2 , 3);
            spotLight.target.position.set(6, 1, 0);
            scene.add(spotLight);
            scene.add(spotLight.target);
    
            camera.position.set(0,0.5,1.5);
            camera.lookAt(0,0,0);
    
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(width, height, 30);
            controls.zoom = 2;
            controls.update();

            loader.load('/iphone_14_pro_max.glb', function(gltf) {
                const object = gltf.scene;
                scene.add(object)
    
                const distanceToObject = camera.position.distanceTo(object.position);
                const newDistance = distanceToObject * 0.3;
                controls.target.copy(object.position);
                camera.position.set(0, 0.1, newDistance);
                camera.updateProjectionMatrix();
            });
            const popupContainer = document.getElementById('popup-container');
            if (popupContainer) {
                popupContainer.appendChild(renderer.domElement);
            }
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
    
            animate();
            }
        };
        
        useEffect(() => {
            if (show3DModel) {
                load3DModel();
            }
        }, [show3DModel]);
    
        const handleGoBack = () => {
            navigate(-1);
        };

        const handleOpen3DModel = () => {
            setShow3DModel(true); 
            load3DModel();// Mở pop-up khi bấm vào nút "Watch 3D"
        };

        const handleClose3DModel = () => {
            setShow3DModel(false); // Đóng pop-up khi cần
            // Xóa canvas của mô hình 3D khỏi pop-up container
            const canvasContainer = document.getElementById('canvas-container');
            if (canvasContainer) {
                canvasContainer.innerHTML = '';
            }
        };
        
        //Đóng 3D Model
    return (
        <Layout>
            {/* {JSON.stringify(category, null, 4)} */}
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
                            <button class="btn btn-secondary ms-1" onClick={() => {
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
                                        <div id="popup-container">
                                            {/* {load3DModel()}; */}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button class="btn btn-secondary ms-1" onClick={handleGoBack}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row container'>
                <h6>Similar Products</h6>
                {relatedProducts.length < 1 && (<p className='text-center'>No Similar Product found</p>)}
                <div className='d-flex flex-wrap my-3'>
                    {relatedProducts?.map(p => (
                        <>
                            <div className="card m-2" style={{ width: '16rem' }}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    <p className="card-text">${p.price}</p>
                                    <button class="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details...</button>
                                    <button class="btn btn-secondary ms-1" onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem(
                                            "cart",
                                            JSON.stringify([...cart, p])
                                        );
                                        toast.success('Product added to Cart!');
                                    }}>Add to cart</button>
                                    
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails
