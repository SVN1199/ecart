import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layouts/MetaData'
import { getProducts } from '../actions/productsActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './layouts/Loader'
import Product from './product/Product'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Pagination from 'react-js-pagination'


const Home = () => {
  const dispatch = useDispatch()
  const { products, productsCount, resPerPage, loading, error } = useSelector((state) => state.productsState)

  const [currentPage, setCurrentPage] = useState(1)

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo)
  }

  useEffect(() => {
    if (error) {
      return toast.error('Hello', {
        position: 'bottom-center',
      });
    }

    dispatch(getProducts(null, null, null,null, currentPage));
  }, [error, dispatch, currentPage]);



  return (
    <Fragment>
      {
        loading ? <Loader />
          :
          <Fragment>
            <MetaData title={'Buy Best Products'} />
            <div className="container mt-5 overflow-y-hidden">
              <div className="row">
                <div className="col-12">
                  <div className="heading_home">Latest Products</div>
                </div><br />
              </div>
              <section>
                <div className="row">
                  {products && products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              </section>
              {
                productsCount > 0 && productsCount > resPerPage ?
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
                  </div> : null
              }
            </div>
          </Fragment>
      }
    </Fragment>
  )
}

export default Home