import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list'
import { saveShippingInfo } from '../../slices/cartSlice';
import CheckoutSteps from './CheckoutSteps';
import { toast } from 'react-toastify';

export const validateShipping = (shippingInfo, navigate) => {

    if (
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.country ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode
    ) {
        toast.error('Please fill the shipping information', { position: 'bottom-center' })
        navigate('/shipping')
    }
}

const Shipping = () => {

    const { shippingInfo = {} } = useSelector(state => state.cartState)

    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);
    const countryList = Object.values(countries);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country, state }))
        navigate('/order/confirm')
    }

    return (
        <div>
            <CheckoutSteps shipping />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 shippingInfo">
                        <form onSubmit={submitHandler}>
                            <h4 className='text-center'>Shipping Info</h4>

                            <div>
                                <label htmlFor="address_field">Address</label><br />
                                <input
                                    type="text"
                                    id="address_field"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="city_field">City</label><br />
                                <input
                                    type="text"
                                    id="city_field"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone_field">Phone No.</label><br />
                                <input
                                    type="phone"
                                    id="phone_field"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="postal_code_field">Postal Code</label><br />
                                <input
                                    type="number"
                                    id="postal_code_field"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="country_field">Country</label><br />
                                <select
                                    id="country_field"
                                    className="form-control"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required

                                >{countryList.map((country, i) => (

                                    <option key={i} value={country.name}>
                                        {country.name}
                                    </option>
                                ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label htmlFor="state_field">State</label>
                                <input
                                    type="text"
                                    id="state_field"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                            <button type='submit' className='ship-btn'>Continue</button>

                        </form>                    </div>

                    <div className="col-md-4"></div>
                </div>
            </div>
        </div>
    )
}

export default Shipping