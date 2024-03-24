import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/layout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useCart } from '../context/cart.js';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProductss] = useState([]);

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
