import React from 'react';
import "../../scss/components/button.scss";

const WarningButton = ({text, clickCallback}: {text: string, clickCallback: () => void}) => {
    return (
        <button className='button button-warning' onClick={clickCallback}>{text}</button>
    );
};

export default WarningButton;
