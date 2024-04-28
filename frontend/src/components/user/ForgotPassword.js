import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError, forgotPassword } from '../../actions/userActions'
import { toast } from 'react-toastify'

const ForgotPassword = () => {

  const [email, setEmail] = useState('')

  const {loading, message, error} = useSelector((state)=>state.authState)

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    dispatch(forgotPassword(formData))
  }

  useEffect(() => {
    if(message){
      toast(message, {
        type : 'success',
        position : 'bottom-center'
      })
      setEmail('')
      return
    }

    if(error){
      toast(error, {
        type : 'error',
        position : 'bottom-center',
        onOpen : () => {dispatch(clearAuthError)}
      })
    }


  }, [message, error, dispatch])

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="forgot-password">
            <div className='text-center'>Forgot Password <div className='login_line'></div></div>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder='Enter Your Email...'
                name='email'
                onChange={(e) => setEmail(e.target.value)}
                className='mt-3 mb-3'
              /><br />
              <button type='submit' disabled={loading}>Send Email</button>
            </form>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  )
}

export default ForgotPassword