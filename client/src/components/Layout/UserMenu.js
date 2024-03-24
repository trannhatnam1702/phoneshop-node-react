import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
    return (
        <>
            <div className='mt-4'>
                <nav className="nav nav-pills flex-column">
                    <h5 className=''>Navigation</h5>
                    <NavLink to='/dashboard/user/profile' className="nav-link ps-5 mt-2">Profile</NavLink>
                    <NavLink to='/dashboard/user/orders' className="nav-link ps-5">Orders</NavLink>
                </nav>
            </div>
        </>
    )
}

export default UserMenu
