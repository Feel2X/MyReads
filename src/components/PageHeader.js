import { useNavigate } from "react-router-dom";
// custom styles
import styles from "../assets/styles/Header.module.css";
// images & icons
import logo from "../assets/icons/books.png";
// ant design
import { Layout } from "antd"
import "antd/dist/antd.min.css"

const { Header } = Layout

const PageHeader = () => {
    const navigate = useNavigate()

    return (
        <Header>
            <div className={styles.container} onClick={() => navigate("/")}>
                <img className={styles.icon} src={logo} alt="image of books stacked on top of each other" />
                <p className={styles.title}>MyReads</p>
            </div>
        </Header>
    )
}

export default PageHeader