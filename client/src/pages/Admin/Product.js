import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Product = () => {
    const [products, setProducts] = useState([]);

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Error in getting Product!');
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);


    return (
        <Layout title={'Products list - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card p-3'>
                            <h2>Product list</h2>
                            <div className='d-flex flex-wrap'>
                                {products?.map((p) => (
                                    <>
                                        <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className='text-dark'>
                                            <div className="card m-2" style={{ width: '18rem' }}>
                                                <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${p._id}`} className="card-img-top" alt={p.name} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{p.name}</h5>
                                                    <p className="card-text">{p.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product
