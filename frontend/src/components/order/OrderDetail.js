import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { orderDetail as orderDetailAction } from '../../actions/orderAction';
import Loader from '../layouts/Loader';

const OrderDetail = () => {

    const { orderDetail, loading } = useSelector((state) => state.orderState)
    const { shippingInfo = {}, user = {}, orderStatus = "Processing", orderItems = [], totalPrice = 0, paymentInfo = {} } = orderDetail;
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(orderDetailAction(id))
    }, [id, dispatch])

    return (
        <Fragment>
            {
                loading ? <Loader /> :
                    <Fragment>
                        <div className="container container-fluid orderDetail">
                            <div className="row d-flex justify-content-between">
                                <div className="col-12 col-lg-8 mt-3 order-details">
                                    <h3 className="my-4"><b>Order  #{orderDetail._id}</b></h3>
                                    <h4 className="mb-3"><b style={{ color: 'blue' }}>Shipping Info</b></h4>
                                    <p><b>Name : </b>{user.name}</p>
                                    <p><b>Phone : </b> 999 999 9999</p>
                                    <p className="mb-4"><b>Address : </b>
                                        {shippingInfo.address},
                                        {shippingInfo.city},
                                        {shippingInfo.postalCode},
                                        {shippingInfo.state},
                                        {shippingInfo.country}
                                    </p>
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
                            </div>

                        </div>
                    </Fragment>
            }
        </Fragment>
    )
}

export default OrderDetail