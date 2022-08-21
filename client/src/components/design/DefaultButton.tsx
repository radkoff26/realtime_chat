import React from 'react';
import '../../scss/components/button.scss'

const DefaultButton = ({text, clickCallback}: {text: string, clickCallback: () => void}) => {
    const clickHandler = (e: React.MouseEvent) => {
        e.preventDefault()
        clickCallback()
    }

    return (
        <button className='button button-default' onClick={clickHandler}>{text}</button>
    );
};

export default DefaultButton;
