import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/layout'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryList = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (params?.slug) getProductByCate();
        // eslint-disable-next-line
    }, [params?.slug]);

    const getProductByCate = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.Products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className='container'>
                <h2 className='text-center mt-4'>{category?.name}</h2>
                <h6 className='text-center'>{products?.length} result found</h6>
                <div className='row'>
                    <div className='d-flex flex-wrap my-3'>
                        {products?.map(p => (
                            <>
                                <div className="card m-2" style={{ width: '18rem' }}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        <p className="card-text">${p.price}</p>
                                        <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details...</button>
                                        <button className="btn btn-secondary ms-1">Add to cart</button> 
                                        <button className="btn btn-primary ms-1">Watch 3D</button>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                    {/* <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-warning' onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}>
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        )}
                    </div> */}
                </div>
            </div>
        </Layout>
    )
}
    
export default CategoryList
