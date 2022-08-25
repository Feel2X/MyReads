import { useEffect } from "react";

// ant design
import { Col, Result, Row } from "antd"

// custom components
import BookDisplay from "../BookDisplay";
import PageHeader from "../PageHeader"
import SearchBar from "./SearchBar"
import Spinner from "../Spinner";

// custom hooks
import useBookAPI from "../../hooks/useBooksAPI"

// images & icons
import { QuestionCircleOutlined } from "@ant-design/icons"
import SearchStatusDisplay from "./SearchStatusDisplay";

const BookSearch = () => {
    const {
        booksFetched,
        searching,
        registeredBooks,
        fetchRegisteredBooks,
        searchResultBooks,
        lastQuery,
        noSearchResults,
        searchBooks
    } = useBookAPI()

    useEffect(() => {
        fetchRegisteredBooks()
    }, [])

    return (
        <div style={{ overflowX: "hidden" }}>
            <PageHeader />
            { !booksFetched ?
                <Spinner />
                :
                <>
                    <SearchBar searchBooks={ searchBooks } />
                    <SearchStatusDisplay
                        searching={ searching }
                        numResults={ Object.keys(searchResultBooks).length }
                        query={ lastQuery.current }
                    />
                    {
                        noSearchResults ?
                            <Result
                                icon={ <QuestionCircleOutlined style={{ color: "orange" }} /> }
                                title="No matches found"
                                subTitle="Please check and update your query."
                            />
                            :
                            <>
                                <Row justify="start" gutter={[28, 52]} >
                                    {
                                        Object.keys(searchResultBooks).map((key, index) => {
                                            return (
                                                <Col key={key}
                                                     xxl={{ span: 3, offset: 1}}
                                                     xl={{ span: 4, offset: 1}}
                                                     md={{ span: 4, offset: 1 }}
                                                     xs={{ span: 11, offset: 1 }}
                                                >
                                                    <BookDisplay
                                                        registeredBooks={ registeredBooks }
                                                        bookId={ key }
                                                        bookInfo={ searchResultBooks[key] }
                                                        renderAddOverlay={ true }
                                                    />
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </>
                    }
                </>
            }
        </div>
    )
}

export default BookSearch