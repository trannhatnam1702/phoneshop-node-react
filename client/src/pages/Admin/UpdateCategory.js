import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCategory = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [id, setId] = useState('');

    const getSingleCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/single-category/${params.slug}`);
            setName(data.Category.name);
            setId(data.Category._id);
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getSingleCategory();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const categoryData = new FormData();
            categoryData.append('name', name);
            image && categoryData.append('image', image);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${id}`, categoryData);
            if (data?.success) {
                toast.success(data?.message);
                navigate('/dashboard/admin/category');
            } else {
                toast.success(`Category updated Successfully!`);

            }
        } catch (error) {
            console.log(error);
            toast.error('Error in submitting form!');

        }
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`, { name: name });
            if (data?.success) {
                toast.success(`${name} is deleted!`);
                navigate('/dashboard/admin/category');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error in deleting Category!');

        }
    };
    return (
        <Layout title={'Update Category - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='w-75 p-3'>
                            <h2 className='my-3'>Update Category</h2>
                            <div className='w-50 p-3'>
                                <div className='mb-3'>
                                    <input type='text' value={name} placeholder="Product's Name" className='form-control' onChange={(e) => setName(e.target.value)}></input>
                                </div>
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
                                            <img src={`${process.env.REACT_APP_API}/api/v1/category/image-category/${id}`} height={'200px'} className='img img-responsive'></img>
                                        </div>
                                    )}
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
        </Layout>
    )
}

export default UpdateCategory
