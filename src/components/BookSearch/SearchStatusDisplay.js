// custom components
import Spinner from "../Spinner";

// style
import style from "../../assets/styles/SearchStatusDisplay.module.css"

const SearchStatusDisplay = ({ searching, numResults, query }) => {
    return (
        <div className={style.container}>
            {
                searching ?
                    <Spinner size="middle" />
                    :
                    query.length !== 0 &&
                    <>
                        { JSON.stringify(numResults) } results for "{ query }"
                    </>
            }
        </div>
    )
}

export default SearchStatusDisplay