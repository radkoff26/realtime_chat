import React from 'react';
import '../../scss/components/title.scss'

const Title = ({text}: {text: string}) => {
    return (
        <h1 className='title'>{text}</h1>
    );
};

export default Title;
