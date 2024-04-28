import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown, Image } from 'react-bootstrap'
import ecart from './ECart.png'
import { logOut } from '../../actions/userActions'

const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useSelector((state) => state.authState)
  const { items: cartItems } = useSelector((state) => state.cartState)

  const logOutHandler = () => {
    dispatch(logOut)
  }

  useEffect(() => {
  }, [navigate, isAuthenticated])

  return (
    <div className='navbar row header sticky-top'>
      <div className="header_body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-3">
              <Link to='/cart' style={{ textDecoration: 'none', color: 'white' }}>
                <span className='cart-header'>
                  <span className='cart_num'>{cartItems.length}</span>
                  <i className='fa fa-cart-shopping'></i>
                </span>
              </Link>
              <div className="navbar-brand">
                <Link to="/">
                  <img src={ecart} alt="" style={{ width: '40px', height: '30px', borderRadius: '3px' }} />
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 mt-md-0 search">
              <Search />
            </div>
            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
              {isAuthenticated ?
                (
                  <Dropdown className='d-inline user_name' >
                    <Dropdown.Toggle variant='default text-white pr-5' id='dropdown-basic'>
                      <figure className='avatar avatar-nav'>
                        <Image className='rounded' width="50px" height='40px' src={user.avatar ?? './images/default_avatar.png'} />
                      </figure>
                      <span>{user.name}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {
                        user.role === 'admin' &&
                        <Dropdown.Item onClick={() => { navigate('/dashboard') }} className='text-dark'>DashBoard</Dropdown.Item>
                      }
                      <Dropdown.Item onClick={() => { navigate('/myprofile') }} className='text-dark'>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={() => { navigate('/orders') }} className='text-dark'>Orders</Dropdown.Item>
                      <Dropdown.Item onClick={logOutHandler} className='text-danger'>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )

                :
                <Link to="/login" className="btn btn-login mt-2" id="login_btn">Login</Link>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header