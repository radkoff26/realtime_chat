import React from 'react';
import styles from '../../scss/components/button.module.scss'

const DefaultButton = ({text, clickCallback}: {text: string, clickCallback: () => void}) => {
    const clickHandler = (e: React.MouseEvent) => {
        e.preventDefault()
        clickCallback()
    }

    return (
        <button className={styles.button + " " + styles.buttonDefault} onClick={clickHandler}>{text}</button>
    );
};

export default DefaultButton;
