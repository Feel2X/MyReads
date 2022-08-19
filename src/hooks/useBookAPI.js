import { useState } from "react"

// backend
import * as BooksAPI from "../api/BooksAPI"

/*TODO:
    [x] implement shelved book state handling
    [x] implement update book shelf state handling
    [-] implement search results state handling
*/

const useBooksAPI = () => {
    const [booksFetched, setBooksFetched] = useState(false)
    const [registeredBooks, setRegisteredBooks] = useState([])
    const [sortedBookIds, setSortedBookIds] = useState({})

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
        console.log(`updating book ${bookId} to shelf ${shelf}`)
        const res = await BooksAPI.update(bookId, shelf)
        return res
    }

    return {
        booksFetched,
        registeredBooks,
        sortedBookIds,
        fetchRegisteredBooks,
        updateBookCategory
    }
}

export default useBooksAPI
