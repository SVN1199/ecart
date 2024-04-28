import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
        loading: false
    },
    reducers: {
        addCartItemsRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        addCartItemsSuccess(state, action) {
            const item = action.payload
            const isItemExists = state.items.find(i => i.product === item.product)

            if (isItemExists) {
                state = {
                    ...state,
                    loading: false
                }
            } else {
                state = {
                    items: [...state.items, item],
                    loading: false
                }
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
            return state
        },
        increaseCartItemQty(state, action) {
            state.items = state.items.map(item => {
                if (item.product === action.payload) {
                    item.quantity = item.quantity + 1
                }
                return item
            })
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        decreaseCartItemQty(state, action) {
            state.items = state.items.map(item => {
                if (item.product === action.payload) {
                    item.quantity = item.quantity - 1
                }
                return item
            })
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItemFromCart(state, action) {
            const filteredItems = state.items.filter(item => {
                return item.product !== action.payload
            })
            localStorage.setItem('cartItems', JSON.stringify(filteredItems));
            return {
                ...state,
                items: filteredItems
            }
        },
        saveShippingInfo(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
            return {
                ...state,
                shippingInfo: action.payload
            }
        },
        orderCompleted(state, action) {
            localStorage.removeItem('cartItems')
            localStorage.removeItem('shippingInfo')
            sessionStorage.removeItem('orderInfo')
            return {
                items: [],
                loading: false,
                shippingInfo: {}
            }
        }
    }
})

const { actions, reducer } = cartSlice
export const {
    addCartItemsRequest,
    addCartItemsSuccess,
    increaseCartItemQty,
    decreaseCartItemQty,
    removeItemFromCart,
    saveShippingInfo,
    orderCompleted
} = actions
export default reducer