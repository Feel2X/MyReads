import { useState, useRef } from "react"

// backend
import * as BooksAPI from "../api/BooksAPI"

const useBooksAPI = () => {
    const [booksFetched, setBooksFetched] = useState(false)
    const [registeredBooks, setRegisteredBooks] = useState([])
    const [sortedBookIds, setSortedBookIds] = useState({})
    const [searchResultBooks, setSearchResultBooks] = useState([])
    const [sortedResultBookIds, setSortedResultBookIds] = useState({})
    const [noSearchResults, setNoSearchResults] = useState(false)
    let lastQuery = useRef("")

    const mapBooksToDict = books => Object.assign({}, ...books.map(book => ({[book.id]: book})))

    const fetchRegisteredBooks = async () => {
        setBooksFetched(false)
        console.log("fetching registered books...")
        const books = await BooksAPI.getAll()
        console.log(books)
        setRegisteredBooks(mapBooksToDict(books))
        setSortedBookIds({
            currentlyReading: books.filter(book => book.shelf === "currentlyReading").map(book => book.id),
            wantToRead: books.filter(book => book.shelf === "wantToRead").map(book => book.id),
            read: books.filter(book => book.shelf === "read").map(book => book.id),
        })
        setBooksFetched(true)
    }

    const updateBookCategory = async (bookId, shelf) => {
        console.log(`updating book "${bookId}" to shelf "${shelf}"`)
        const res = await BooksAPI.update(bookId, shelf)
    }

    const searchBooks = async (query) => {
        if (query !== lastQuery.current) {
            console.log(`requesting book search for "${query}"`)
            const books = await BooksAPI.search(query, 20)
            console.log(books)
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
        registeredBooks,
        sortedBookIds,
        searchResultBooks,
        sortedResultBookIds,
        noSearchResults,
        fetchRegisteredBooks,
        updateBookCategory,
        searchBooks
    }
}

export default useBooksAPI