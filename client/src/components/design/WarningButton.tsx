import React from 'react';
import "../../scss/components/button.module.scss";
import styles from "../../scss/components/button.module.scss";

const WarningButton = ({text, clickCallback}: {text: string, clickCallback: () => void}) => {
    return (
        <button className={styles.button + " " + styles.buttonWarning} onClick={clickCallback}>{text}</button>
    );
};

export default WarningButton;
