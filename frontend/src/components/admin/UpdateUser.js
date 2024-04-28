import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { clearError, clearUserUpdated } from '../../slices/userSlice';
import { getUser, updateUser } from '../../actions/userActions';

const UpdateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const { id: userId } = useParams();

    const { loading, isUserUpdated, error, user } = useSelector(state => state.userState)
    const { user: authUser } = useSelector(state => state.authState)

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        dispatch(updateUser(userId, formData))
    }

    useEffect(() => {
        if (isUserUpdated) {
            toast('User Updated Succesfully!', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearUserUpdated())
            })
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

        dispatch(getUser(userId))
    }, [isUserUpdated, error, dispatch])


    useEffect(() => {
        if (user._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user])


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
                            <h5 className="mb-2 text-center">Update User <hr /></h5>
                            <div className="form-group">
                                <label for="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="price_field">Email</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="form-group">
                                <label for="description_field">Description</label>
                                <select disabled={user._id === authUser._id} value={role} onChange={e => setRole(e.target.value)} className="form-control" id="category_field">
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <br />
                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    )
}

export default UpdateUser