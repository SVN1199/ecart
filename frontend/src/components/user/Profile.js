import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {

  const { user } = useSelector((state) => state.authState)

  return (
    <div className="container">
      {user && <div className="row user-profile">
        <div className="col-md-5 mt-5">
          <img src={user.avatar} alt="User Avatar" className='user_avatar d-block mx-auto rounded' />
          <Link to='/myprofile/update' style={{ textDecoration: 'none' }}>
            <div className="btn_edit mt-5">Edit Profile</div>
          </Link>
        </div>
        <div className="col-md-2"></div>
        <div className="col-md-5 mt-5">
          <h5>Full Name</h5>
          <div>{user.name}</div><br />
          <h5>Email</h5>
          <div>{user.email}</div><br />
          <h5>Joined</h5>
          <div>{String(user.createdAt.substring(0, 10))}</div><br />
          <Link to='/orders'>
            <button className='my-orders'>My Orders</button><br />
          </Link>
          <Link to='/myprofile/update/password' style={{ textDecoration: 'none' }}>
            <button className='change-password mt-3'>Change Password</button>
          </Link>
        </div>
      </div>}
    </div>
  )
}

export default Profile