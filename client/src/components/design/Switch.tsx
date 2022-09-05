import React, {useState} from 'react';
import styles from '../../scss/components/switch.module.scss'

const Switch = ({label, callback}: {label: string, callback: () => void}) => {
    const [isChosen, setChosen] = useState(false)

    const clickHandler = () => {
        setChosen(isChosen => !isChosen)
        callback()
    }

    return (
        <div className={styles.switch_container}>
            <p>{label}</p>
            <div className={styles.switch + (isChosen ? ' ' + styles.chosen : '')} onClick={clickHandler}>
                <div/>
            </div>
        </div>
    );
};

export default Switch;
