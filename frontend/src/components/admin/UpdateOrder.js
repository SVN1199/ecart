import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { updateOrder, orderDetail as orderDetailAction } from '../../actions/orderAction';
import { clearError, clearOrderUpdated } from '../../slices/orderSlice';

const UpdateOrder = () => {

    const { loading, isOrderUpdated, error, orderDetail } = useSelector(state => state.orderState)
    const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {} } = orderDetail;
    const isPaid = paymentInfo.status === 'succeeded' ? true : false;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const { id: orderId } = useParams();

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrder(orderId, orderData))
    }

    useEffect(() => {
        if (isOrderUpdated) {
            toast('Order Updated Succesfully!', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearOrderUpdated())
            })

            return;
        }

        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }

        dispatch(orderDetailAction(orderId))
    }, [isOrderUpdated, error, dispatch, orderId])

    useEffect(() => {
        if (orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    }, [orderDetail])

    return (
        <div className="container ">
            <div className="row">
                <div className="col-12 col-md-12">
                    <Sidebar />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="row d-flex justify-content-between orderDetail">
                        <div className="col-12 col-md-6 mt-3 order-details">
                            <h3 className="my-4"><b>Order  #{orderDetail._id}</b></h3>
                            <h4 className="mb-3"><b style={{ color: 'blue' }}>Shipping Info</b></h4>
                            <p><b>Name : </b>{ user && user.name}</p>
                            <p><b>Phone : </b> 999 999 9999</p>
                        {
                            shippingInfo &&
                            <>
                                <p className="mb-4"><b>Address : </b>
                                {shippingInfo.address},
                                {shippingInfo.city},
                                {shippingInfo.postalCode},
                                {shippingInfo.state},
                                {shippingInfo.country}
                            </p>
                            </>
                        }
                            <p><b>Amount : </b>{totalPrice}</p>
                            <hr />

                            <h4 className="my-4" ><b style={{ color: 'blue' }}>Payment</b></h4>
                            <p className={`${isPaid ? 'greenColor' : 'redColor'}`} ><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>


                            <h4 className="my-4">Order Status:</h4>
                            <p className={orderStatus && orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'} ><b>{orderStatus}</b></p>

                            <h4 className="my-4">Order Items:</h4>
                            <hr />
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(item => (
                                    <div className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>${item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <hr />
                        </div>
                        <div className="col-12 col-md-6 mt-3 ">
                            <h4 className="my-4">Order Status</h4>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    onChange={e => setOrderStatus(e.target.value)}
                                    value={orderStatus}
                                    name="status"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>

                            </div>
                            <button
                                disabled={loading}
                                onClick={submitHandler}
                                className="btn btn-primary btn-block my-3"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                    <div className="row">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateOrder