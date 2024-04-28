import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, updatePassword as updatePasswordAction} from '../../actions/userActions'
import { toast } from 'react-toastify'

const UpdatePassword = () => {

    const dispatch = useDispatch()

    const [password, setPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')

    const {loading, isUpdated, error} = useSelector((state)=>state.authState)

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('oldPassword', oldPassword)
        formData.append('password', password)
        dispatch(updatePasswordAction(formData))
    }

    useEffect(()=>{
        if (isUpdated) {
            toast('Password Updated Successfully', {
                type: 'success',
                position: 'bottom-center'
            })
            setOldPassword('')
            setPassword('')
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
    }, [dispatch, error, isUpdated])

  return (
    <div className="login_body">
    <div className="container">
        <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
                <div className="loginpass_box">
                    <div className="login_heading text-center">
                        Update Password
                        <div className="login_line"></div>
                        <div className="login_form mt-3">
                            <form onSubmit={submitHandler}>
                                <input
                                    type="text"
                                    placeholder='Enter Old Password...'
                                    name='oldPassword'
                                    value={oldPassword}
                                    onChange={(e)=>setOldPassword(e.target.value)}
                                /><br />
                                <input
                                    type="text"
                                    name='password'
                                    placeholder='Enter New Password...'
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                /><br />
                                <button type='submit' className='mt-3' disabled={loading}>
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3"></div>
        </div>
    </div>
</div>
  )
}

export default UpdatePassword