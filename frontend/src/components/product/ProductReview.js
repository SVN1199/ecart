import React from 'react'

const ProductReview = ({ reviews }) => {
    return (
        <div className="container productReview">
            <div className="row">
                <div className="col-md-12">
                    <div class="reviews w-75">
                        <h4>Other's Reviews:</h4>
                        <hr />
                        {reviews && reviews.map(review => (
                            <div key={review._id} class="review-card my-3">
                                <div class="rating-outer">
                                    <div class="rating-inner" style={{ width: `${review.rating / 5 * 100}%` }}></div>
                                </div>
                                <p class="review_user">by {review.user?.name}</p>
                                <p class="review_comment">{review.comment}</p>

                                <hr />
                            </div>
                        ))
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductReview