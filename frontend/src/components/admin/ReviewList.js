import React, { Fragment, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { toast } from 'react-toastify'
import { clearError } from '../../slices/userSlice'
import { clearReviewDeleted } from '../../slices/productSlice'
import { deleteReview, getReviews } from '../../actions/productsActions'

const ReviewList = () => {


    const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(state => state.productState)
    const [productId, setProductId] = useState("");
    const dispatch = useDispatch();

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: review.user.name,
                comment: review.comment,
                actions: (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, review._id)} className="btn productListBtn">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })

        return data;
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteReview(productId, id))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getReviews(productId))
    }

    useEffect(() => {
        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isReviewDeleted) {
            toast('Review Deleted Succesfully!', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearReviewDeleted())
            })
            dispatch(getReviews(productId))
            return;
        }


    }, [dispatch, error, isReviewDeleted])

    return (
        <div className="container">
            <div className="row productListComp">
                <div className="row">
                    <div className="col-12 col-md-12">
                        <Sidebar />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label >Product ID</label>
                                <input
                                    type="text"
                                    onChange={e => setProductId(e.target.value)}
                                    value={productId}
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary mt-1"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <h4 className="my-4">Product List</h4>
                            <Fragment>

                                {loading ? <Loader /> :
                                    <MDBDataTable
                                        data={setReviews()}
                                        bordered
                                        striped
                                        hover
                                        className="px-3"
                                    />
                                }
                            </Fragment>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewList