import React from 'react'
import Layout from '../components/Layout/layout.js'
import { Link } from 'react-router-dom'

const Contact = () => {
    return (
        <Layout title={"Contact us - PhoneShop"}>
            <div className='container'>
                <div className="p-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="wrapper">
                                    <div className="row no-gutters">
                                        <div className="col-lg-6">
                                            <div className="contact-wrap w-100 p-md-5 p-4">
                                                <h2>Contact us</h2>
                                                <p className="mb-4">We’d love to hear from you</p>
                                                <i >Whether you’re curious about products, prices, or anything. We’re ready to answer any and all questions</i>
                                                <div className="row mb-4 mt-4">
                                                    <div className="col-md-4">
                                                        <div className="dbox w-100 d-flex align-items-start">
                                                            <div className="text">
                                                                <p><span>Address:</span> HUTECH</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="dbox w-100 d-flex align-items-start">
                                                            <div className="text">
                                                                <p><span>Email:</span> <a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="dbox w-100 d-flex align-items-start">
                                                            <div className="text">
                                                                <p><span>Phone:</span> <a href="tel://1234567920">+ 1234 5678 90</a></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-100 social-media mt-5">
                                                    <h3>Follow us here</h3>
                                                    <p>
                                                        <Link >Facebook</Link>
                                                        <Link >Instagram</Link>
                                                        <Link >Youtube</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 d-flex align-items-stretch">
                                            <div className="info-wrap w-100 p-5 img" style={{ backgroundImage: 'url(/images/contact-img.jpg)' }} />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Contact
