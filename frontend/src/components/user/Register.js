import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layouts/MetaData'
import { useEffect, useState } from 'react'
import { clearAuthError, register } from '../../actions/userActions'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const { loading, error, isAuthenticated } = useSelector((state) => state.authState)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')

    const onchange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(e.target.files[0])
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value })
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('password', userData.password)
        formData.append('avatar', avatar)
        dispatch(register(formData))
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
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

    }, [dispatch, navigate, error, isAuthenticated])

    return (
        <div>
            <MetaData title={`Register`} />
            <div className="login_body">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="register_box">
                                <div className="login_heading text-center">
                                    Register
                                    <div className="login_line"></div>
                                    <div className="login_form">
                                        <form onSubmit={submitHandler}>
                                            <input
                                                type="text"
                                                placeholder='Enter Your Name...'
                                                name='name'
                                                onChange={onchange}
                                            /><br />
                                            <input
                                                type="text"
                                                placeholder='Enter Your Email...'
                                                name='email'
                                                onChange={onchange}
                                            /><br />
                                            <input
                                                type="password"
                                                placeholder='Enter Your Password...'
                                                name='password'
                                                onChange={onchange}
                                            /><br />
                                            <div class="row-container">
                                                <img src={avatarPreview} alt="Avatar" className='rounded' />
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    onChange={onchange}
                                                />
                                            </div>
                                            <div className="forgot_password text-end">
                                                Forgot Password ?
                                            </div>
                                            <button type='submit' disabled={loading}>SIGN UP</button>
                                            <div className="forgot_password text-end">
                                                New User ?
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div><br /><br /><br />
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register