import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div className='mt-4'>
                <nav className="nav nav-pills flex-column">
                    <h5 className=''>Navigation</h5>
                    <NavLink to='/dashboard/admin/create-category' className="nav-link ps-5 mt-2">Create Category</NavLink>
                    <NavLink to='/dashboard/admin/create-product' className="nav-link ps-5">Create Product</NavLink>
                    <NavLink to='/dashboard/admin/products' className="nav-link ps-5">Products</NavLink>
                    <NavLink to='/dashboard/admin/category' className="nav-link ps-5">Categories</NavLink>
                    <NavLink to='/dashboard/admin/orders' className="nav-link ps-5">Orders</NavLink>
                    <NavLink to='/dashboard/admin/users' className="nav-link ps-5">Users</NavLink>
                </nav>
            </div>
        </>
    )
}

export default AdminMenu
