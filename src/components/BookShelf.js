import { useEffect } from "react"

// custom components
import PageHeader from "./PageHeader"

// hooks
import useBookAPI from "../hooks/useBookAPI";

// ant design
import { Layout } from "antd"
import "antd/dist/antd.min.css"

const { Content } = Layout

const BookShelf = () => {
    const { shelvedBooks, fetchShelvedBooks } = useBookAPI()

    useEffect(() => {
        fetchShelvedBooks()  // fetch all shelved books and update state
    }, [])

    return (
        <Layout>
            <PageHeader />
            <Content>
                BookShelf Content
            </Content>
        </Layout>
    )
}

export default BookShelf