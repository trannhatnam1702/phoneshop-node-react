import React from 'react'
import { Link } from 'react-router-dom'


const footer = () => {
    return (

        <div className='bg-dark text-light py-4 footer'>
            <div className='container'>
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><Link to='/' className="nav-link px-2">Home</Link></li>
                    <li className="nav-item"><Link to='/contact' className="nav-link px-2 ">Contact</Link></li>
                    <li className="nav-item"><Link to='/about' className="nav-link px-2">About</Link></li>
                </ul>
                <p className='d-flex justify-content-center align-items-center text-muted'>Footer © copyright</p>
            </div>
        </div>
    )
}

export default footer
