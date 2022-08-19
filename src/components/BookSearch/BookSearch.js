// ant design
import { Result } from "antd"

// custom components
import PageHeader from "../PageHeader"
import SearchBar from "./SearchBar"

// hooks
import useBookAPI from "../../hooks/useBookAPI"

const BookSearch = () => {
    const { searchResultBooks, sortedResultBookIds, noSearchResults, searchBooks } = useBookAPI()

    return (
        <>
            <PageHeader />
            <SearchBar searchBooks={searchBooks} />

            {
                noSearchResults ?
                    <Result status="error" title="No matches found" subTitle="Please check and update your query." />
                    :
                    <ul>
                        {
                            Object.keys(searchResultBooks).map((key, index) => {
                                return <li key={key}>{searchResultBooks[key].title}</li>
                            })
                        }
                    </ul>
            }
        </>
    )
}

export default BookSearch