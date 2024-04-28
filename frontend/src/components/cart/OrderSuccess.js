import React from 'react'
import { Link } from 'react-router-dom'

const OrderSuccess = () => {
  return (
    <div className="container container-fluid">
      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
          <img className="my-2 img-fluid d-block mx-auto" src="/images/tick.png" alt="Order Success" width="200" height="200" />
          <h2>Your Order has been placed successfully.</h2>
          <Link to="/orders" style={{ textDecoration: 'none', fontFamily: 'sans-serif' }}>Go to Orders</Link>
        </div>

      </div>
    </div>
  )
}

export default OrderSuccess