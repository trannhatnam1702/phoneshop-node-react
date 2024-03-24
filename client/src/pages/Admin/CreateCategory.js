import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [image, setImage] = useState('');
    const [updatedImage, setUpdatedImage] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const categoryData = new FormData();
            categoryData.append('name', name);
            categoryData.append('image', image);
            const { data } = axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, categoryData);

            if (data?.success) {
                toast.success(`${data?.Category.name} is created!`);
                getAllCate();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error in submitting form!');

        }
    };

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
        <Layout title={'Create Category - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='w-75 p-3'>
                            <h2 className='my-3'>Create Category</h2>
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
                                    {image && (
                                        <div className='text-center'>
                                            <img src={URL.createObjectURL(image)} height={'200px'} className='img img-responsive'></img>
                                        </div>
                                    )}
                                </div>
                                <button type="" onClick={handleSubmit} className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory
