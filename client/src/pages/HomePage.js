import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/layout.js'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices.js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart.js';
import toast from 'react-hot-toast';

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            console.log(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCate();
        getTotal();
        // eslint-disable-next-line
    }, []);

    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/count-product`);
            setTotal(data?.total)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (page === 1) return;
        loadMore();
        // eslint-disable-next-line
    }, [page]);

    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products])
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getAllCate = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/list-category`);
            if (data?.success) {
                setCategories(data?.Category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
        // eslint-disable-next-line
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) flterProduct();
        // eslint-disable-next-line
    }, [checked, radio]);

    //filter by cate
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    const flterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, { checked, radio });
            setProducts(data?.products)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Layout title={"HomePage"}>
            <div className='container-fluid row mt-4'>
                <div className='col-md-2'>
                    <h4 className='text-center'>Categories</h4>
                    <div className='d-flex flex-column'>
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h4 className='text-center mt-4'>Prices</h4>
                    <div className='d-flex flex-column'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className='d-flex flex-column'>
                        <button className='btn btn-outline-dark mt-3' onClick={() => window.location.reload()}>Reset Filters</button>
                    </div>
                </div>
                <div className='col-md-10'>
                    {/* {JSON.stringify(radio, null, 4)} */}
                    <h2 className='text-center'>Welcome to Appo</h2>
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
                                        <button className="btn btn-secondary ms-1" onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem(
                                                "cart",
                                                JSON.stringify([...cart, p])
                                            );
                                            toast.success('Product added to Cart!');
                                        }}>
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-warning' onClick={(e) => {
                                e.preventDefault();
                                setPage(page + 1);
                            }}>
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage
