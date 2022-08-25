// navigation
import { useNavigate } from "react-router-dom"

// images & icons
import { PlusOutlined } from "@ant-design/icons";

// style
import style from "../../assets/styles/AddButton.module.css"

const AddButton = () => {
    const navigate = useNavigate()
    return (
        <div className={style.addButton} onClick={() => navigate("/add")}>
            <PlusOutlined className={style.plusIcon} />
        </div>
    )
}

export default AddButton