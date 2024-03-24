import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { BsFillCartFill } from 'react-icons/bs'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import Search from '../Form/Search'
import useCategory from '../../hooks/useCategory'
import { useCart } from '../../context/cart.js';
import { Badge } from "antd";

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const categories = useCategory();
    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: '',
        })
        localStorage.removeItem('auth');
        toast.success('Logout Successfully!');
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light shadow">
                <div className="container">
                    <Link to='/' className="navbar-brand"><img src='/logo.png' style={{ width: '90px' }} alt='logo'></img></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to='/' className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link to={'/categories'} className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                    Categories
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item mb-1" to={`/categories`}>All Categories</Link></li>
                                    {categories?.map((c) => (
                                        <li><Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link></li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <div className='mx-1'>
                                <Search></Search>
                            </div>
                            {
                                !auth?.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to='/register' className="nav-link">Register</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to='/login' className="nav-link">Login</NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown ">
                                            <NavLink className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" style={{ border: "none" }}>
                                                {auth?.user?.name}
                                            </NavLink>
                                            <ul className="dropdown-menu">
                                                <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink></li>
                                                <li >
                                                    <NavLink onClick={handleLogout} to='/login' className="dropdown-item mt-2">Logout</NavLink>
                                                </li>
                                            </ul>
                                        </li>


                                    </>
                                )
                            }
                            <li className="nav-item cart">
                                <NavLink to='/cart' className="nav-link">
                                    <Badge count={cart?.length} showZero offset={[10, -5]}>
                                        <BsFillCartFill />
                                    </Badge>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header
