import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../actions/productsActions'
import { getUsers } from '../../actions/userActions'
import { adminOrders as adminOrdersAction } from '../../actions/orderAction'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const { products = [] } = useSelector(state => state.productsState);
    const { adminOrders = [] } = useSelector(state => state.orderState);
    const { users = [] } = useSelector(state => state.userState);

    const dispatch = useDispatch();
    let outOfStock = 0;

    if (products.length > 0) {
        products.forEach(product => {
            if (product.stock === 0) {
                outOfStock = outOfStock + 1;
            }
        })
    }

    let totalAmount = 0;
    if (adminOrders.length > 0) {
        adminOrders.forEach(order => {
            totalAmount += order.totalPrice
        })
    }


    useEffect(() => {
        dispatch(getAdminProducts);
        dispatch(getUsers);
        dispatch(adminOrdersAction)
    }, [])

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-12">
                    <Sidebar />
                </div>
            </div>
            <div className="row dashboardbar">
                <div className="col-12 col-md-12">
                    <h4 class="my-3">Dashboard</h4>
                    <div class="row pr-4">
                        <div class="col-xl-12 col-sm-12 mb-2">
                            <div class="card text-white bg-primary o-hidden h-100">
                                <div class="card-body">
                                    <div class="text-center card-font-size">
                                        Total Amount<br />
                                        <b>$ {totalAmount.toFixed(2)}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row pr-4">
                        <div class="col-xl-3 col-md-3 col-sm-6 mb-2">
                            <div class="card text-white bg-success o-hidden h-100">
                                <div class="card-body">
                                    <div class="text-center card-font-size">
                                        Products<br />
                                        <b>{products.length}</b></div>
                                </div>
                                <Link
                                    className="card-footer text-white clearfix small z-1"
                                    to="/admin/products"
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div class="col-xl-3 col-md-3 col-sm-6 mb-2">
                            <div class="card text-white bg-danger o-hidden h-100">
                                <div class="card-body">
                                    <div class="text-center card-font-size">Orders<br />
                                        <b>{adminOrders.length}</b>
                                    </div>
                                </div>
                                <Link
                                    className="card-footer text-white clearfix small z-1"
                                    to="/admin/orders"
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div class="col-xl-3 col-md-3 col-sm-6 mb-3">
                            <div class="card text-white bg-info o-hidden h-100">
                                <div class="card-body">
                                    <div class="text-center card-font-size">Users<br />
                                        <b>{users.length}</b>
                                    </div>
                                </div>
                                <Link
                                    className="card-footer text-white clearfix small z-1"
                                    to="/admin/users"
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div class="col-xl-3 col-md-3 col-sm-6 mb-3">
                            <div class="card text-white bg-warning o-hidden h-100">
                                <div class="card-body">
                                    <div class="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard