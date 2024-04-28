import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { validateShipping } from './Shipping'
import axios from 'axios'
import { orderCompleted } from '../../slices/cartSlice'
import { createOrder } from '../../actions/orderAction'
import { clearError as clearOrderError } from '../../slices/orderSlice'
import CheckoutSteps from './CheckoutSteps'

const Payment = () => {
    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    const { user } = useSelector(state => state.authState)
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState)
    const { error: orderError } = useSelector(state => state.orderState)

    const paymentData = {
        amount: orderInfo && Math.round(orderInfo.totalPrice * 100),
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    }

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate)
        if (orderError) {
            toast(orderError, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()) }
            })
            return
        }
    }, [navigate, shippingInfo, dispatch, orderError])

    const submitHandler = async (e) => {
        e.preventDefault();
        const payButton = document.querySelector('#pay_btn');
        payButton.disabled = true;

        try {
            const { data } = await axios.post('/api/v1/payment/process', paymentData);
            const clientSecret = data.client_secret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            console.log('Result:', result); // Log the result for debugging

            if (result.error) {
                toast(result.error.message, {
                    type: 'error',
                    position: 'bottom-center'
                });
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    toast('Payment Success!', {
                        type: 'success',
                        position: 'bottom-center'
                    });
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    };
                    dispatch(orderCompleted());
                    dispatch(createOrder(order));
                    setTimeout(() => {
                        navigate('/order/success');
                    }, 0);
                } else {
                    toast('Please Try again!', {
                        type: 'warning',
                        position: 'bottom-center'
                    });
                }
            }
        } catch (error) {
            // Handle errors here, you might want to display an error message
            console.error('Error:', error);
            toast('An error occurred. Please try again later.', {
                type: 'error',
                position: 'bottom-center'
            });
        } finally {
            // Ensure the button is re-enabled regardless of success or failure
            payButton.disabled = false;
        }

    };


    return (
        <div>
            <CheckoutSteps shipping confirmOrder payment/>
            <div className="container">
                <div className="row card-pay">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <form onSubmit={submitHandler} className="shadow-lg p-3 mt-4">
                            <h4 className="mb-4">Card Info</h4>
                            <div className="form-group">
                                <label htmlFor="card_num_field">Card Number</label><br />
                                <CardNumberElement
                                    type="text"
                                    id="card_num_field"
                                    className="form-control"
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="card_exp_field">Card Expiry</label><br />
                                <CardExpiryElement
                                    type="text"
                                    id="card_exp_field"
                                    className="form-control"

                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="card_cvc_field">Card CVC</label><br />
                                <CardCvcElement
                                    type="text"
                                    id="card_cvc_field"
                                    className="form-control"
                                    value=""
                                />
                            </div>

                            <button
                                id="pay_btn"
                                type="submit"
                            >
                                Pay {`- $${orderInfo && orderInfo.totalPrice}`}
                            </button>

                        </form>
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        </div>
    )
}

export default Payment