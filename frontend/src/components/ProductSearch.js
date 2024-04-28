import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import Loader from "./layouts/Loader";
import { getProducts } from "../actions/productsActions";

export default function ProductSearch() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [priceChanged, setPriceChanged] = useState(price);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);

    const { keyword } = useParams();
    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    const setCurrentPageNo = (pageNo) => {

        setCurrentPage(pageNo)

    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            })
        }
        dispatch(getProducts(keyword, priceChanged, category, rating, currentPage))
    }, [error, dispatch, currentPage, keyword, priceChanged, category, rating])


    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <section id="products" className="container ">
                        <div id="products_heading" className="mt-3">Search Products</div>
                        <div className="row">
                            <div className="col-6 col-md-3 mb-4 mt-4">
                                {/* Price Filter */}
                                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                                    <Slider
                                        range={true}
                                        marks={
                                            {
                                                1: "$1",
                                                1000: "$1000"
                                            }
                                        }
                                        min={1}
                                        max={1000}
                                        defaultValue={price}
                                        onChange={(price) => {
                                            setPrice(price)
                                        }}
                                        handleRender={
                                            renderProps => {
                                                return (
                                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}  >
                                                        <div {...renderProps.props}>  </div>
                                                    </Tooltip>
                                                )
                                            }
                                        }
                                    />
                                </div>
                                <div className="my-5"></div>
                                {/* Category Filter */}
                                <div className="categories">
                                    <div className="mb-3 category_heading">Categories</div>
                                    <ul className="pl-0 ">
                                        {categories.map(category =>
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"
                                                }}
                                                key={category}
                                                onClick={() => {
                                                    setCategory(category)
                                                }}
                                            >
                                                {category}
                                            </li>

                                        )}

                                    </ul>
                                </div>
                                <div className="my-5" />
                                {/* Ratings Filter */}
                                <div className="mt-5">
                                    <h4 className="mb-3 rating_heading">Ratings</h4>
                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star =>
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"
                                                }}
                                                key={star}
                                                onClick={() => {
                                                    setRating(star)
                                                }}
                                            >
                                                <div className="ratings-outer">
                                                    <div
                                                        className="ratings-inner"
                                                        style={{
                                                            width: `${star * 20}%`
                                                        }}
                                                    >
                                                    </div>
                                                </div>
                                            </li>

                                        )}

                                    </ul>
                                </div>
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {products && products.map(product => (
                                        <Product col={4} key={product._id} product={product} />
                                    ))}
                                </div>

                            </div>
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div> : null}
                </Fragment>
            }
        </Fragment>
    )
}