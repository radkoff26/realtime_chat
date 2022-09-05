import React from 'react';
import {Link} from "react-router-dom";
import styles from '../../scss/components/button.module.scss'

const ButtonLink = ({text, to}: {text: string, to: string}) => {
    return (
        <Link to={to} className={styles.button + " " + styles.buttonDefault}>{text}</Link>
    );
};

export default ButtonLink;
