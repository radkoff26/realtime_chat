import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import styles from '../../scss/components/button.module.scss'
import isUserAuthorized from "../../modules/IsUserAuthorized";

const ButtonLink = ({text, to}: {text: string, to: string}) => {
    const navigate = useNavigate()

    const onClick = (e: React.MouseEvent) => {
        if (!isUserAuthorized()) {
            e.preventDefault()
            navigate('/auth')
            return
        }
    }

    return (
        <Link to={to} onClick={onClick} className={styles.button + " " + styles.buttonDefault}>{text}</Link>
    );
};

export default ButtonLink;
