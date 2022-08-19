import { useEffect } from "react"

// custom components
import PageHeader from "./PageHeader"
import Spinner from "./Spinner";

// hooks
import useBookAPI from "../hooks/useBookAPI";

// ant design
import { Layout } from "antd"
import "antd/dist/antd.min.css"

// dnd kit
import {rectSortingStrategy} from "@dnd-kit/sortable";
import {ShelfSegments} from "./DragAndDropContainers/ShelfSegments";


const { Content } = Layout

const BookShelf = () => {
    const {
        booksFetched,
        registeredBooks,
        sortedBookIds,
        fetchRegisteredBooks,
        updateBookCategory
    } = useBookAPI()

    useEffect(() => {
        fetchRegisteredBooks() // fetch all registered books and update state
    }, [])

    return (
        <>
            <PageHeader />
            { !booksFetched ?
                <Spinner />
                :
                <ShelfSegments
                    registeredBooks={registeredBooks}
                    items={sortedBookIds}
                    updateBookCategory={updateBookCategory}
                    vertical
                    columns={3}
                    strategy={rectSortingStrategy}
                    trashable
                />
            }
        </>

    )
}

export default BookShelf