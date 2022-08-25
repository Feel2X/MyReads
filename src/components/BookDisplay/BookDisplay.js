import { useEffect, useState } from "react";
import PropTypes from "prop-types"

// ant design
import { Alert, Modal, notification, Radio, Space, Typography } from "antd"

// custom hooks
import useBooksAPI from "../../hooks/useBookAPI"

// images & icons
import { PlusOutlined } from "@ant-design/icons"

// style
import styles from "../../assets/styles/Book.module.scss"

const { Text } = Typography

const BookDisplay = ({ bookInfo, bookId, registeredBooks, renderAddOverlay=false }) => {
    const bookInfos = bookInfo ? bookInfo : registeredBooks[bookId]

    return (
        <div className={styles.BookDisplay}>
            <div className={styles.BookCoverContainer}>
                <img src={bookInfos['imageLinks'] ? bookInfos['imageLinks']['thumbnail'] : null } className={styles.BookCover} />
                { renderAddOverlay &&
                    <AddButtonOverlay bookId={bookId} bookInfo={bookInfos} registeredBooks={registeredBooks} />
                }
            </div>
            <div className={styles.BookInfo}>
                <Text>{ bookInfos["title"] }</Text>
                <br />
                <div className={styles.BookAuthor}>
                    <Text type={"secondary"}>{ bookInfos["authors"] ? bookInfos["authors"][0] : "N/A" }</Text>
                </div>
            </div>
        </div>
    )
}
BookDisplay.propTypes = {
    bookId: PropTypes.string.isRequired,
    registeredBooks: PropTypes.object.isRequired,
    renderAddOverlay: PropTypes.bool
}

const AddButtonOverlay = ({ bookId, bookInfo, registeredBooks }) => {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className={styles.addIconContainer} onClick={() => setModalOpen(true)}>
            <PlusOutlined className={styles.addIcon} />
            <AddModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                bookId={bookId}
                bookInfo={bookInfo}
                registeredBooks={registeredBooks}
            />
        </div>
    )
}

const openSuccessNotification = () => {
    notification["success"]({
        message: "Shelf updated successfully!",
        duration: 2,
        placement: "bottom"
    })
}

const AddModal = ({ modalOpen, setModalOpen, bookInfo, bookId, registeredBooks }) => {
    const [initialCategory, setInitialCategory] = useState(registeredBooks[bookId] ? registeredBooks[bookId].shelf : "None")
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [selectionValid, setSelectionValid] = useState(false)
    const { booksUpdating, updateBookCategory } = useBooksAPI()

    const validateSelection = () => setSelectionValid(selectedCategory !== initialCategory)

    const handleSubmit = e => {
        e.stopPropagation() // required to not propagate the click event to () => setModalOpen(true) of parent
        updateBookCategory(bookId, selectedCategory)
        setInitialCategory(selectedCategory)
        setModalOpen(false)
        openSuccessNotification()
    }
    const handleClose = e => {
        e.stopPropagation() // required to not propagate the click event to () => setModalOpen(true) of parent
        setModalOpen(false)
    }

    useEffect(() => {
        validateSelection()
    }, [selectedCategory])

    return (
        <Modal
            visible={modalOpen}
            title="Add to Bookshelf"
            onOk={handleSubmit}
            confirmLoading={booksUpdating}
            onCancel={handleClose}
            okButtonProps={{ disabled: !selectionValid }}
        >
            { initialCategory !== "None" && <Alert message="This book is already in your bookshelf!" type="info" /> }
            <div className={styles.addModalContent}>
                <BookDisplay bookId={bookId} bookInfo={bookInfo} registeredBooks={registeredBooks} renderAddOverlay={false} />
                <Radio.Group
                    onChange={e => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                    className={styles.radioButtonContainer}
                >
                    <Space direction="vertical">
                        <Radio value={"None"}>None</Radio>
                        <Radio value={"wantToRead"}>Want to Read</Radio>
                        <Radio value={"currentlyReading"}>Currently Reading</Radio>
                        <Radio value={"read"}>Read</Radio>
                    </Space>
                </Radio.Group>
            </div>
        </Modal>
    )
}

export default BookDisplay