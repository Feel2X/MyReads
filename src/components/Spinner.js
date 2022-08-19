// ant design
import { Spin } from "antd";

// style
import "antd/dist/antd.min.css"
import style from "../assets/styles/Spinner.module.css"

const Spinner = () => {
    return (
        <div className={style.container}>
            <Spin size="large" />
        </div>
    )
}

export default Spinner