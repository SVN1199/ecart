import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Search = () => {

    const navigate = useNavigate()
    const location = useLocation()


    const [keyword, setKeyword] = useState('')

    const searchHandler = (e) => {
        e.preventDefault()
        navigate(`/search/${keyword}`)
    }

    const clearKeyword = () => {
        setKeyword("")
    }

    useEffect(() => {
        if (location.pathname === '/') {
            clearKeyword()
        }
    }, [location])


    return (
        <form onSubmit={searchHandler}>
            <div className="input-group nav-input mx-auto">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Product Name...."
                    onChange={(e) => { setKeyword(e.target.value) }}
                    value={keyword}
                    aria-label="Enter Product Name...."
                    aria-describedby="basic-addon2" />
                <button
                    className="input-group-text search_icon"
                    id="basic-addon2"
                >
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </form>
    )
}

export default Search