import React from 'react';
import {Link} from "react-router-dom";
import '../../scss/components/button.scss'

const ButtonLink = ({text, to}: {text: string, to: string}) => {
    return (
        <Link to={to} className='button button-default'>{text}</Link>
    );
};

export default ButtonLink;
