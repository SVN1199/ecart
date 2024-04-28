import axios from "axios"
import { addCartItemsRequest, addCartItemsSuccess } from "../slices/cartSlice"

export const addCartItem = (id, quantity) => async(dispatch) => {
    try {
        dispatch(addCartItemsRequest())
        const {data} = await axios.get(`/api/v1/product/${id}`)
        dispatch(addCartItemsSuccess({
            product : data.product._id,
            name : data.product.name,
            price : data.product.price,
            image : data.product.images[0].image,
            stock : data.product.stock,
            quantity
        }))
    } catch (error) {
        
    }
}