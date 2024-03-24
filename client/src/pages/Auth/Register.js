import React, { useState } from 'react';
import Layout from '../../components/Layout/layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, { name, email, password, address, phone, answer });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error('Error')
        }

    };

    return (
        <Layout title={'Register - PhoneShop'}>
            {/* <div className="vh-100 bg-image" style={{ backgroundImage: 'url("https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp")' }}> */}
            <div className="mask d-flex align-items-center h-100 gradient-custom-3 p-5">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: 15 }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">Create an account</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example1cg">Your Name</label>
                                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} id="form3Example1cg" className="form-control form-control-lg" placeholder='Enter your Name' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example3cg">Your Email</label>

                                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} id="form3Example3cg" className="form-control form-control-lg" placeholder='Enter your Email' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example4cg">Password</label>

                                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} id="form3Example4cg" className="form-control form-control-lg" placeholder='Enter your Password' required />
                                        </div>
                                        {/* <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example4cdg">Repeat your password</label>

                                            <input type="password" id="form3Example4cdg" className="form-control form-control-lg" placeholder='Repeat your Password' />
                                        </div> */}
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example1cg">Your Phone</label>

                                            <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} id="form3Example1cg" className="form-control form-control-lg" placeholder='Enter your Phone' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example1cg">Your Address</label>

                                            <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} id="form3Example1cg" className="form-control form-control-lg" placeholder='Enter your Address' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example1cg">Your favorite Phone</label>

                                            <input type="text" onChange={(e) => setAnswer(e.target.value)} value={answer} id="form3Example1cg" className="form-control form-control-lg" placeholder='Enter your Answer' required />
                                        </div>
                                        {/* <div className="form-check d-flex justify-content-center mb-5">
                                            <input className="form-check-input me-2" type="checkbox" defaultValue id="form2Example3cg" />
                                            <label className="form-check-label" htmlFor="form2Example3g">
                                                I agree all statements in <a href="#!" className="text-body"><u>Terms of service</u></a>
                                            </label>
                                        </div> */}
                                        <div className="d-flex justify-content-center">
                                            <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button>
                                        </div>
                                        <p className="text-center text-muted mt-5 mb-0">Have already an account? <a href="/login" className="fw-bold text-body"><u>Login here</u></a></p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}

        </Layout>
    )
}

export default Register
