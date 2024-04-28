import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice'

const Cart = () => {

  const { items } = useSelector((state) => state.cartState)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQty = (item) => {
    const count = item.quantity;
    if (item.stock === 0 || count >= item.stock) return;
    dispatch(increaseCartItemQty(item.product))
  }

  const decreaseQty = (item) => {
    const count = item.quantity;
    if (count === 1) return;
    dispatch(decreaseCartItemQty(item.product))
  }

  const checkoutHandler = () =>{
    navigate('/login?redirect=shipping')
}

  return (
    <Fragment>
      {items.length === 0 ?
        <h2 className="mt-5 text-center" style={{ fontFamily: 'serif' }}>Your Cart is Empty</h2> :
        <Fragment>
          <div className="container container-fluid cart_body">
            <h5 className="mt-5">Your Cart: <b>{items.length}</b></h5>

            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8">
                <hr />
                {items.map(item => (
                  <div className="cart-item mt-3">
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img src={item.image} alt="Laptop" height="90" width="115" />
                      </div>
                      <div className="col-5 col-lg-3">
                        <Link to={`/product/${item.product}`}
                          style={{ textDecoration: 'none', color: 'indigo', fontWeight: '500' }}
                        >{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
                          <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                          <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() => dispatch(removeItemFromCart(item.product))}
                        ></i>
                      </div>

                    </div>
                  </div>

                ))}
                <hr />
              </div>

              <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                  <h4>Order Summary</h4>
                  <hr />
                  <p>Subtotal:  <span className="order-summary-values">
                    {items.reduce((acc, item) => (acc + item.quantity), 0)} (Units)
                  </span></p>
                  <p>Est. total: <span className="order-summary-values">
                    ${items.reduce((acc, item) => (acc + item.quantity * item.price), 0).toFixed(2)}
                  </span></p>

                  <hr />
                  <button 
                    id="checkout_btn" 
                    className="btn btn-primary checkBtn"
                    onClick={checkoutHandler}
                    >Check out</button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      }
    </Fragment>
  )
}

export default Cart