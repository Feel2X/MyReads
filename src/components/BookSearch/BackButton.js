// navigation
import { useNavigate } from "react-router-dom"

// images & icons
import { LeftOutlined } from "@ant-design/icons";

// style
import style from "../../assets/styles/BackButton.module.css"

const BackButton = () => {
    const navigate = useNavigate()

    return (
        <div className={style.backButton} onClick={() => navigate("/")}>
            <LeftOutlined className={style.backIcon} />
        </div>
    )
}

export default BackButton