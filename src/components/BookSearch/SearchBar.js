import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"

// style
import style from "../../assets/styles/SearchBar.module.css"
import BackButton from "./BackButton"

const SearchBar = ({ searchBooks }) => {
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => { // implementation of debouncing
        let timer = setTimeout(() => {
            searchBooks(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    return (
        <div className={ style.searchBarContainer }>
            <BackButton />
            <input
                className={ style.searchInput }
                value={ searchTerm }
                onChange={ event => setSearchTerm(event.target.value) }
                placeholder="Search by title, author, or ISBN"
                autoFocus
            />
        </div>
    )
}

SearchBar.propTypes = {
    searchBooks: PropTypes.func.isRequired
}

export default SearchBar