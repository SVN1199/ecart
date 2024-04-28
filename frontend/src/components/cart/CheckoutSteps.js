import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
    return (
        <div className="checkout-progress d-flex justify-content-center mt-2 mb-3">
            {shipping ?
                <Link to="/shipping">
                    <div className="step active-step">Shipping Info</div>
                </Link> :
                <Link to="/shipping">
                    <div className="step incomplete">Shipping Info</div>
                </Link>
            }

            {confirmOrder ?
                <Link to="/order/confirm">
                    <div className="step active-step">Confirm Order</div>
                </Link> :
                <Link to="/order/confirm">
                    <div className="step incomplete">Confirm Order</div>
                </Link>
            }


            {payment ?
                <Link to="/payment">
                    <div className="step active-step">Payment</div>
                </Link> :
                <Link to="/payment">
                    <div className="step incomplete">Payment</div>
                </Link>
            }

        </div>
    )
}

export default CheckoutSteps