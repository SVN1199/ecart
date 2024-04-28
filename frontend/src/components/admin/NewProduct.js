import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewProduct } from '../../actions/productsActions';
import { toast } from "react-toastify";
import { clearError, clearProductCreated } from '../../slices/productSlice';

const NewProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { loading, isProductCreated, error } = useSelector(state => state.productState)

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
        'Homes'
    ]

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState == 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, file])
                }
            }

            reader.readAsDataURL(file)


        })

    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('seller', seller);
        formData.append('category', category);
        images.forEach(image => {
            formData.append('images', image)
        })
        dispatch(createNewProduct(formData))
    }

    useEffect(() => {
        if (isProductCreated) {
            toast('Product Created Succesfully!', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearProductCreated())
            })
            navigate('/admin/products')
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
    }, [isProductCreated, error, dispatch])

    return (
        <div className="container ">
            <div className="row">
                <div className="col-12 col-md-12">
                    <Sidebar />
                </div>
            </div>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="newproduct shadow-lg mt-3">
                        <form encType='multipart/form-data' onSubmit={submitHandler}>
                            <h5 className="mb-2 text-center">New Product <hr /></h5>
                            <div className="form-group">
                                <label for="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="price_field">Price</label>
                                <input
                                    type="number"
                                    id="price_field"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="description_field">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description_field"
                                    rows="8"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
                                    <option value="">Select</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="seller_field">Seller Name</label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    value={seller}
                                    onChange={(e) => setSeller(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className='custom-file-label' for='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.map(image => (
                                    <img
                                        className="mt-3 mr-2"
                                        key={image}
                                        src={image}
                                        alt={`Image Preview`}
                                        width="55"
                                        height="52"
                                    />
                                ))}
                            </div>
                            <br />
                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                            >
                                CREATE
                            </button>

                        </form>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    )
}

export default NewProduct