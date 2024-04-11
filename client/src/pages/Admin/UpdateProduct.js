import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateProduct = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [image3D, setImage3D] = useState('');
    const [shipping, setShipping] = useState('');
    const [id, setId] = useState('');

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setName(data.products.name);
            setId(data.products._id);
            setDescription(data.products.description);
            setPrice(data.products.price);
            setQuantity(data.products.quantity);
            setShipping(data.products.shipping);
            setCategory(data.products.category._id);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSingleProduct();
    }, []);


    const getAllCate = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/list-category`);
            if (data?.success) {
                setCategories(data?.Category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error in getting Category!');
        }
    };

    useEffect(() => {
        getAllCate();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('quantity', quantity);
            productData.append('shipping', shipping);
            image && productData.append('image', image);
            image3D && productData.append('image3D', image3D);
            productData.append('category', category);
            const { data } = axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData);
            if (data?.success) {
                toast.error(data?.message);
            } else {
                toast.success(`Product updated Successfully!`);
                navigate('/dashboard/admin/products');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error in creating product!');
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.prompt('Are you sure you want to Delete this product?');
            if (!answer)
                return;
            const { data } = axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            toast.success(`Delete Product Successfully!`);
            navigate('/dashboard/admin/products');
        } catch (error) {
            console.log(error);
            toast.error('Error in Deleting product!');
        }
    };

    return (
        <Layout title={'Update Product - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='w-75 p-3'>
                            <h2>Update Product</h2>
                            <div className='m-1'>
                                <Select bordered={false} placeholder='Select a Category' size='large' showSearch className='form-control mb-3'
                                    onChange={(value) => { setCategory(value) }} value={category}>
                                    {categories?.map((c) => (
                                        <Option key={c._id} value={c._id}>{c.name}</Option>
                                    ))}
                                </Select>
                                <div className='mb-3'>
                                    <label className='btn btn-outline-secondary col-md-12'>
                                        {image ? image.name : 'Upload Image'}
                                        <input type='file' name='image' accept='/image/*' onChange={(e) => setImage(e.target.files[0])} hidden></input>
                                    </label>
                                </div>
                                <div className='mb-3'>
                                    {image ? (
                                        <div className='text-center'>
                                            <img src={URL.createObjectURL(image)} height={'200px'} className='img img-responsive'></img>
                                        </div>
                                    ) : (
                                        <div className='text-center'>
                                            <img src={`${process.env.REACT_APP_API}/api/v1/product/image-product/${id}`} height={'200px'} className='img img-responsive'></img>
                                        </div>
                                    )}
                                </div>
                                <div className='mb-3'>
                                    <label className='btn btn-outline-secondary col-md-12'>
                                        {image3D ? image3D.name : 'Upload 3D Model'}
                                        <input type='file' name='image3D' accept='/model/*' onChange={(e) => setImage3D(e.target.files[0])} hidden></input>
                                    </label>
                                </div>
                                <div className='mb-3'>
                                    {image3D ? (
                                        <div className='text-center'>
                                            <p>Upload 3D Model: {image3D.name}</p>
                                        </div>
                                    ): (
                                        <div className='text-center'>
                                            <p>3D Model: {name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={name} placeholder="Product's Name" className='form-control' onChange={(e) => setName(e.target.value)}></input>
                                </div>
                                <div className='mb-3'>
                                    <textarea type='text' value={description} placeholder="Description" className='form-control' onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                                <div className='mb-3'>
                                    <input type='number' value={price} placeholder="Price" className='form-control' onChange={(e) => setPrice(e.target.value)}></input>
                                </div>
                                <div className='mb-3'>
                                    <input type='number' value={quantity} placeholder="Quantity" className='form-control' onChange={(e) => setQuantity(e.target.value)}></input>
                                </div>
                                <div className='mb-3'>
                                    <Select bordered={false} placeholder='Select Shipping' size='large' showSearch className='form-control mb-3'
                                        onChange={(value) => { setShipping(value) }} value={shipping ? "yes" : "No"} >
                                        <Option value='0'>No</Option>
                                        <Option value='1'>Yes</Option>
                                    </Select>
                                </div>
                                <div className='mb-3'>
                                    <button type='' className='btn btn-primary' onClick={handleUpdate}>Update</button>
                                </div>
                                <div className='mb-3'>
                                    <button type='' className='btn btn-danger' onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default UpdateProduct
