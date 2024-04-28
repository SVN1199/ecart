import React, { useEffect, useState } from 'react'
import MetaData from '../layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, login } from '../../actions/userActions'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { loading, error, isAuthenticated } = useSelector((state) => state.authState)
    const redirect = location.search?'/'+location.search.split('=')[1]:'/';

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
            return
        }

        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
            return
        }

    }, [error, navigate, isAuthenticated, dispatch, redirect])

    return (
        <div>
            <MetaData title={`Login`} />
            <div className="login_body">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="login_box">
                                <div className="login_heading text-center">
                                    Login
                                    <div className="login_line"></div>
                                    <div className="login_form">
                                        <form onSubmit={submitHandler}>
                                            <input
                                                type="text"
                                                placeholder='Enter Your Email...'
                                                name='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            /><br />
                                            <input
                                                type="text"
                                                placeholder='Enter Your Password...'
                                                name='password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            /><br />
                                            <Link to={'/password/forgot'} style={{ textDecoration: 'none' }}>
                                                <div className="forgot_password text-end">
                                                    Forgot Password ?
                                                </div>
                                            </Link>
                                            <button type='submit' disabled={loading}>SIGN IN</button>
                                            <Link to='/register' style={{ textDecoration: 'none' }}>
                                                <div className="forgot_password text-end">
                                                    New User ?
                                                </div>
                                            </Link>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login