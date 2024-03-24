import React, { useState } from 'react';
import Layout from '../../components/Layout/layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { email, newPassword, answer });
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
        <Layout title={'Forgot Password - PhoneShop'}>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3 p-5">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: 15, width: "100%" }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">Reset Password</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example3cg">Your Email</label>
                                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} id="form3Example3cg" className="form-control form-control-lg" placeholder='Enter your Email' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example3cg">Your Secret answer</label>
                                            <input type="text" onChange={(e) => setAnswer(e.target.value)} value={answer} id="form3Example3cg" className="form-control form-control-lg" placeholder='Enter your Answer' required />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="form3Example4cg">Password</label>
                                            <input type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} id="form3Example4cg" className="form-control form-control-lg" placeholder='Enter your Password' required />
                                        </div>
                                        <div className="d-flex justify-content-center mb-3">
                                            <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Save</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default ForgotPassword
