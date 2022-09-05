import React from 'react';
import loader from '../../assets/loading.png'
import loaderCss from '../../scss/components/loader.module.scss'

const Loader = () => {
    return (
        <div className={loaderCss.loader}>
            <img src={loader} alt="loader"/>
        </div>
    );
};

export default Loader;