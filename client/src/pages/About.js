import React from 'react'
import Layout from '../components/Layout/layout.js'

const About = () => {
    return (
        <Layout title={"About us - PhoneShop"}>
            <div className='container'>
                <div className="p-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="wrapper">
                                    <div className="row no-gutters">
                                        <div className="col-lg-6">
                                            <div className="w-100 p-md-5 p-4">
                                                <h2>About us</h2>
                                                <hr class="bg-danger border-2 border-top border-danger"></hr>
                                                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 d-flex align-items-stretch">
                                            <div className="info-wrap w-100 p-5 img" style={{ backgroundImage: 'url(/images/about-img.png)' }} />


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

export default About
