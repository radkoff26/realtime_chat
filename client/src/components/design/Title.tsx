import React from 'react';
import styles from  '../../scss/components/title.module.scss'

const Title = ({text}: {text: string}) => {
    return (
        <h1 className={styles.title}>{text}</h1>
    );
};

export default Title;
