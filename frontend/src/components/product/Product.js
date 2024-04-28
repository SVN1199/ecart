import React from 'react'
import { Link } from 'react-router-dom'

const Product = ({ product, col }) => {
    console.log(product)
    return (
        <div className={`col-sm-12 col-md-3 col-lg-${col}`}>
            <Link style={{ textDecoration: 'none' }} to={`/product/${product._id}`}>
                <div className="card">
                    <div className="card_content">
                        <div className="card_image">
                            <img src={product.images[0].image} alt="" className='mx-auto d-block' />
                        </div>
                        <div className="card_description">
                            <div className="card_title">
                                {product.name}
                            </div>
                            <div className="home_main">
                                <div className="ratings mt-auto card_ratings">
                                    <div className="rating-outer">
                                        <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                                    </div>
                                    <span id="no_of_reviews">({product.noOfReviews} Reviews)</span>
                                </div>
                                <div className="card_price">
                                    Rs. {product.price}
                                </div>
                            </div>
                            <div className="card_button">
                                <button>View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default Product