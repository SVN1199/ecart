import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReview, getProduct } from '../../actions/productsActions'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import Loader from '../layouts/Loader'
import { Carousel, Modal } from 'react-bootstrap'
import MetaData from '../layouts/MetaData'
import { addCartItem } from '../../actions/cartActions'
import { clearError, clearProduct, clearReviewSubmitted } from '../../slices/productSlice'
import ProductReview from './ProductReview'

const ProductDetail = () => {

    const dispatch = useDispatch()
    const { id } = useParams()

    const { product = {}, loading, isReviewSubmitted, error } = useSelector((state) => state.productState)
    const { user } = useSelector(state => state.authState);

    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber === 1) return
        const qty = count.valueAsNumber - 1
        setQuantity(qty)
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const reviewHandler = () => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);
        dispatch(createReview(formData))

    }

    useEffect(() => {
        if (isReviewSubmitted) {
            handleClose()
            toast('Review Submitted successfully', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearReviewSubmitted())
            })
        }
        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (!product._id || isReviewSubmitted) {
            dispatch(getProduct(id))
        }

        return () => {
            dispatch(clearProduct())
        }

    }, [dispatch, id, isReviewSubmitted, error])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={product && product.name} />
                    {product &&
                        <div className="container product_details mt-5">
                            <div className="row single_product">
                                <div className="col-md-6">
                                    <div className="product_image">
                                        <Carousel pause='hover'>
                                            {product.images && product.images.map((image) => (
                                                <Carousel.Item key={image._id}>
                                                    <img
                                                        className='mx-auto d-block'
                                                        src={image.image}
                                                        alt="Product"
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </div>
                                    <br />
                                </div>
                                <div className="col-md-6 mx-auto d-block'">
                                    <div className="product_name">
                                        {product.name}
                                    </div>
                                    <div className="product_id">
                                        {`ProductId : #${product._id}`}
                                    </div>
                                    <div className="product_reviews">
                                        <div className="ratings mt-auto card_ratings">
                                            <div className="rating-outer">
                                                <div className="rating-inner"
                                                    style={{ width: `${product.ratings / 5 * 100}%` }}>
                                                </div>
                                            </div>
                                            <span className='product_noOfReviews'>
                                                {`${product.noOfReviews} Reviews`}
                                            </span>
                                        </div>
                                        <div className="product_price">
                                            {`$${product.price}`}
                                        </div>
                                        <div className="product_addToCart">
                                            <span> <button className='minus_btn' onClick={decreaseQty}>-</button></span>
                                            <span className='btn-number '>
                                                <input type="number" className='count' value={quantity} readOnly />
                                            </span>
                                            <span> <button type='button' className='plus_btn' onClick={increaseQty}>+</button></span>
                                            <span className="addToCart">
                                                <button type='button'
                                                    onClick={() => {
                                                        dispatch(addCartItem(product._id, quantity))
                                                        toast('Cart Item Added', {
                                                            type: 'success',
                                                            position: 'bottom-center',
                                                        })
                                                    }}
                                                    disabled={product.stock === 0 ? true : false}
                                                >
                                                    Add To Cart
                                                </button>
                                            </span>
                                        </div>
                                        <div className="product_stock">
                                            <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                                        </div>
                                        <div className="product_description">
                                            <h6>Description : </h6>
                                            <p>{product.description}</p>
                                        </div>
                                        <div className="product_seller">
                                            <span>SoldBy : </span>
                                            <b>{`${product.seller}`}</b>
                                        </div>
                                        {user ? <div className="product_submit_review">
                                            <button onClick={handleShow}>Submit Your Review</button>
                                        </div> :
                                            <div className="alert alert-danger mt-5"> Login to Post Review</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>}
                    <div className="row mt-2 mb-5">
                        <div className="rating w-50 modalProduct">
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Submit Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <ul className="stars" >
                                        {
                                            [1, 2, 3, 4, 5].map(star => (
                                                <li
                                                    key={star}
                                                    value={star}
                                                    onClick={() => setRating(star)}
                                                    className={`star ${star <= rating ? 'orange' : ''}`}
                                                    onMouseOver={(e) => e.target.classList.add('yellow')}
                                                    onMouseOut={(e) => e.target.classList.remove('yellow')}

                                                ><i className="fa fa-star"></i></li>
                                            ))
                                        }


                                    </ul>

                                    <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-1">

                                    </textarea>
                                    <button
                                        disabled={loading}
                                        onClick={reviewHandler}
                                        aria-label="Close"
                                        className="btn btn-primary my-3 float-right review-btn px-4 text-white">
                                        Submit
                                    </button>
                                </Modal.Body>

                            </Modal>
                        </div>
                    </div>

                    {
                        product.reviews && product.reviews.length > 0 ?
                            <ProductReview reviews={product.reviews} /> : null
                    }
                </Fragment>
            }
        </Fragment>
    )
}

export default ProductDetail