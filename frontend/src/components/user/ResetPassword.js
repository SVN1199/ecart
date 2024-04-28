import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, resetPassword } from '../../actions/userActions'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = () => {

    const { loading, isAuthenticated, error } = useSelector((state) => state.authState)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {token} = useParams()

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('password', password)
        formData.append('confirmPassword', confirmPassword)
        dispatch(resetPassword(formData, token))
    }

    useEffect(() => {
        if (isAuthenticated) {
            toast('Password reset success !', {
                type: 'success',
                position: 'bottom-center'
            })
            navigate('/')
            return
        }

        if(error){
            toast(error, {
              type : 'error',
              position : 'bottom-center',
              onOpen : () => {dispatch(clearAuthError)}
            })
          }

    }, [isAuthenticated, navigate, dispatch, error])

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="forgot-password">
                        <div className='text-center'>Reset Password  <div className="login_line"></div></div>
                        <form onSubmit={submitHandler}>
                            <input
                                type="text"
                                placeholder='Enter Your New Password...'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            /><br /><br />
                            <input
                                type="text"
                                placeholder='Enter Your Confirm Password...'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            /><br />
                            <button type='submit' disabled={loading}>Reset Password</button>
                        </form>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    )
}

export default ResetPassword