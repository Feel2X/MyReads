import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"

// style
import style from "../../assets/styles/SearchBar.module.css"
import BackButton from "./BackButton"

const SearchBar = ({ searchBooks }) => {
    const [searchTerm, setSearchTerm] = useState("")
    let lastSearchTimestamp = useRef(Date.now())

    useEffect(() => {
        if (searchTerm.length >= 1) {
            // send api requests on input changes only in certain intervals to reduce api calls
            const currentTimestamp = Date.now()
            if (currentTimestamp - lastSearchTimestamp.current >= 1500) {
                searchBooks(searchTerm)
                lastSearchTimestamp.current = currentTimestamp
            }
            // send api request after user stopped typing for a certain duration
            let timer = setTimeout(() => {
                searchBooks(searchTerm)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [searchTerm])

    return (
        <div className={style.searchBarContainer}>
            <BackButton />
            <input
                className={style.searchInput}
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search by title, author, or ISBN"
            />
        </div>
    )
}

SearchBar.propTypes = {
    searchBooks: PropTypes.func.isRequired
}

export default SearchBar