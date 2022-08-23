import PropTypes from "prop-types"

// ant design
import { Typography } from "antd"

// style
import styles from "../../assets/styles/Book.module.scss"

const { Text } = Typography

const BookDisplay = ({ bookInfo }) => {
    return (
        <div className={styles.BookDisplay}>
            <div className={styles.BookCoverContainer}>
                <img src={bookInfo['imageLinks']['thumbnail']} className={styles.BookCover} />
            </div>
            <div className={styles.BookInfo}>
                <Text>{ bookInfo["title"] }</Text>
                <br />
                <div className={styles.BookAuthor}>
                    <Text type={"secondary"}>{ bookInfo["authors"] ? bookInfo["authors"][0] : "N/A" }</Text>
                </div>
            </div>
        </div>
    )
}

BookDisplay.propTypes = {
    bookInfo: PropTypes.object.isRequired
}

export default BookDisplay