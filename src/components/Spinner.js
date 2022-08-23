import PropTypes from "prop-types"

// ant design
import { Spin } from "antd";

// style
import "antd/dist/antd.min.css"
import style from "../assets/styles/Spinner.module.css"

const Spinner = ({ size="large" }) => {
    return (
        <div className={style.container}>
            <Spin size={size} />
        </div>
    )
}

Spinner.propTypes = {
    size: PropTypes.oneOf(["small", "middle", "large"])
}

export default Spinner