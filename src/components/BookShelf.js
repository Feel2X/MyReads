// custom components
import PageHeader from "./PageHeader"

// ant design
import { Layout } from "antd"
import "antd/dist/antd.min.css"

const { Content } = Layout

const BookShelf = () => {
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