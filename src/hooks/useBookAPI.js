import { useState } from "react"

// backend
import * as BooksAPI from "../api/BooksAPI"

/*TODO:
    [x] implement shelved book state handling
    [-] implement update book shelf state handling
    [-] implement search results state handling
*/

const useBooksAPI = () => {
    const [shelvedBooks, setShelvedBooks] = useState([])

    const fetchShelvedBooks = async () => {
        console.log("fetching books...")
        const books = await BooksAPI.getAll()
        setShelvedBooks(books)
    }

    return { shelvedBooks, fetchShelvedBooks }
}

export default useBooksAPI