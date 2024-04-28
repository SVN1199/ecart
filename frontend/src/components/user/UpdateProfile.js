import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, updateProfile } from '../../actions/userActions'
import { toast } from 'react-toastify'
import { clearUpdateProfile } from '../../slices/authSlice'

const UpdateProfile = () => {

    const dispatch = useDispatch()

    const { loading, user, error, isUpdated } = useSelector((state) => state.authState)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')

    const onChangeAvatar = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(e.target.files[0])
            }
        }

        reader.readAsDataURL(e.target.files[0])
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('avatar', avatar)
        dispatch(updateProfile(formData))
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            if (user.avatar) {
                setAvatarPreview(user.avatar)
            }
        }

        if (isUpdated) {
            toast('Profile Updated Successfully', {
                type: 'success',
                position: 'bottom-center',
                onOpen : () => {dispatch(clearUpdateProfile())}
            })
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

    }, [user, isUpdated, error, dispatch])

    return (
        <div className="login_body">
            <div className="container">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="update_box">
                            <div className="login_heading text-center">
                                Update Profile
                                <div className="login_line"></div>
                                <div className="login_form">
                                    <form onSubmit={submitHandler}>
                                        <input
                                            type="text"
                                            placeholder='Enter Your Name...'
                                            name='name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        /><br />
                                        <input
                                            type="text"
                                            placeholder='Enter Your Email...'
                                            name='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        /><br />
                                        <div class="row-container">
                                            <img src={avatarPreview} alt="Avatar" className='rounded'/>
                                            <input
                                                type="file"
                                                name="avatar"
                                                onChange={onChangeAvatar}
                                            />
                                        </div>
                                        <button type='submit' disabled={loading}>
                                            Update Profile
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div><br /><br /><br />
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile