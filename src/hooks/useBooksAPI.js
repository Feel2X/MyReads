import { useState, useRef } from "react"

// backend
import * as BooksAPI from "../api/BooksAPI"

const useBooksAPI = () => {
    const [booksFetched, setBooksFetched] = useState(false)
    const [booksUpdating, setBooksUpdating] = useState(false)
    const [searching, setSearching] = useState(false)
    const [registeredBooks, setRegisteredBooks] = useState([])
    const [sortedBookIds, setSortedBookIds] = useState({})
    const [searchResultBooks, setSearchResultBooks] = useState({})
    const [sortedResultBookIds, setSortedResultBookIds] = useState({})
    const [noSearchResults, setNoSearchResults] = useState(false)
    let lastQuery = useRef("")

    const mapBooksToDict = books => Object.assign({}, ...books.map(book => ({[book.id]: book})))

    const fetchRegisteredBooks = async () => {
        setBooksFetched(false)
        const books = await BooksAPI.getAll()
        setRegisteredBooks(mapBooksToDict(books))
        setSortedBookIds({
            currentlyReading: books.filter(book => book.shelf === "currentlyReading").map(book => book.id),
            wantToRead: books.filter(book => book.shelf === "wantToRead").map(book => book.id),
            read: books.filter(book => book.shelf === "read").map(book => book.id),
        })
        setBooksFetched(true)
    }

    const updateBookCategory = async (bookId, shelf) => {
        setBooksUpdating(true)
        const res = await BooksAPI.update(bookId, shelf)
        setBooksUpdating(false)
    }

    const searchBooks = async (query) => {
        if (query !== lastQuery.current) {
            setSearching(true)
            const books = await BooksAPI.search(query, 20)
            setSearching(false)
            if (books?.error) { // if results empty
                setNoSearchResults(true)
                setSearchResultBooks({})
                setSortedResultBookIds({
                    currentlyReading: [],
                    wantToRead: [],
                    read: [],
                })
            } else if (Array.isArray(books)) { // if results not empty
                setNoSearchResults(false)
                setSearchResultBooks(mapBooksToDict(books))
                setSortedResultBookIds({
                    currentlyReading: books.filter(book => book.shelf === "currentlyReading").map(book => book.id),
                    wantToRead: books.filter(book => book.shelf === "wantToRead").map(book => book.id),
                    read: books.filter(book => book.shelf === "read").map(book => book.id),
                })
            } else {
                throw new Error("received an unknown response from the search api")
            }
            lastQuery.current = query
        }
    }

    return {
        booksFetched,
        booksUpdating,
        searching,
        registeredBooks,
        sortedBookIds,
        searchResultBooks,
        lastQuery,
        sortedResultBookIds,
        noSearchResults,
        fetchRegisteredBooks,
        updateBookCategory,
        searchBooks
    }
}

export default useBooksAPI