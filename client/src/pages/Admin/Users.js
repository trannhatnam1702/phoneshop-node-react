import React from 'react'
import Layout from '../../components/Layout/layout'
import AdminMenu from '../../components/Layout/AdminMenu'

const Users = () => {
    return (
        <Layout title={'All Users - PhoneShop'}>
            <div className='container-fluid p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card w-75 p-3'>
                            <h1>Users</h1>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Users
