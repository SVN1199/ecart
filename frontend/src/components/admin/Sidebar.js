import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'

const Sidebar = () => {
    const navigate = useNavigate()

    return (
        <div className="sidebar-wrapper mt-2">
            <nav id="sidebar" className='mt-3'>
                <ul className="list-unstyled components">
                    <li className='mx-3'>
                        <Link
                            to='/dashboard'
                            style={
                                { textDecoration: 'none', color: 'white' }
                            }
                        >
                            <i className="fas fa-tachometer-alt"></i>
                            Dashboard
                        </Link>
                    </li>

                    <li className='mx-3'>
                        <NavDropdown
                            title={
                                <span>
                                    <i className='fa fa-product-hunt'></i>
                                    <span>Product</span>
                                </span>
                            }>
                            <NavDropdown.Item
                                style={{ color: 'white', backgroundColor: 'black' }}
                                onClick={() => navigate('/admin/products')} >
                                <i className='fa fa-shopping-basket'>
                                </i>
                                <span className='mx-3'>All</span>
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                style={{ color: 'white', backgroundColor: 'black' }}
                                onClick={() => navigate('/admin/products/create')} >
                                <i className='fa fa-plus'></i>
                                <span className='mx-3'>Create</span>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </li>

                    <li className='mx-3'>
                        <Link to="/admin/orders"
                            style={
                                { textDecoration: 'none', color: 'white' }
                            }
                        ><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>

                    <li className='mx-3'>
                        <Link to="/admin/users"
                            style={
                                { textDecoration: 'none', color: 'white' }
                            }
                        ><i className="fa fa-users"></i> Users</Link>
                    </li>

                    <li>
                        <Link
                            to="/admin/reviews"
                            style={
                                { textDecoration: 'none', color: 'white' }
                            }
                        ><i className="fa fa-users"></i> Reviews</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar