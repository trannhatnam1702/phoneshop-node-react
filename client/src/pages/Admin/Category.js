import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const getAllCate = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/list-category`);
            if (data.success) {
                setCategories(data.Category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error in getting Category!');
        }
    };

    useEffect(() => {
        getAllCate();
    }, []);
    return (
        <Layout title={'Category list - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card p-3'>
                            <h2>Category list</h2>
                            <div className='d-flex flex-wrap'>
                                {categories?.map((c) => (
                                    <>
                                        <Link key={c._id} to={`/dashboard/admin/category/${c.slug}`} className='text-dark'>
                                            <div className="card m-2" style={{ width: '18rem' }}>
                                                <img src={`${process.env.REACT_APP_API}/api/v1/category/image-category/${c._id}`} className="card-img-top" alt={c.name} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{c.name}</h5>
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

export default Category
