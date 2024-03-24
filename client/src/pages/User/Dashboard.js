import React from 'react'
import Layout from '../../components/Layout/layout'
import UserMenu from '../../components/Layout/UserMenu'

const Dashboard = () => {
    return (
        <Layout title={'Dashboard - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card w-75 p-3'>
                            <h1>Dashboard</h1>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
