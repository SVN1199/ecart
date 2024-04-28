import React, { Fragment, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { toast } from 'react-toastify'
import { clearError } from '../../slices/userSlice'
import { clearUserDeleted } from '../../slices/userSlice'
import { deleteUser, getUsers } from '../../actions/userActions'

const UserList = () => {

    const { users = [], loading = true, error, isUserDeleted } = useSelector(state => state.userState)

    const dispatch = useDispatch();

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className="btn productListBtnEdit"> <i className="fa fa-pencil"></i></Link>
                        <Button onClick={e => deleteHandler(e, user._id)} className="productListBtn">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })

        return data;
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id))
    }

    useEffect(() => {
        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isUserDeleted) {
            toast('User Deleted Succesfully!', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearUserDeleted())
            })
            return;
        }

        dispatch(getUsers)
    }, [dispatch, error, isUserDeleted])


    return (
        <div className="container">
            <div className="row productListComp">
                <div className="row">
                    <div className="col-12 col-md-12">
                        <Sidebar />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12">
                        <h1 className="my-4">Product List</h1>
                        <Fragment>

                            {loading ? <Loader /> :
                                <MDBDataTable
                                    data={setUsers()}
                                    bordered
                                    striped
                                    hover
                                    className="px-3"
                                />
                            }
                        </Fragment>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserList