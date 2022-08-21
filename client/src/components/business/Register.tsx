import React from 'react';
import DefaultButton from "../design/DefaultButton";

const Register = () => {
    return (
        <>
            <input className='username' type="text" placeholder='Username'/>
            <input className='login' type="text" placeholder='Login'/>
            <input className='password' type="password" placeholder='Password'/>
            <input className='password' type="password" placeholder='Repeat Password'/>
            <DefaultButton text='Register' clickCallback={() => ({})}/>
        </>
    );
};

export default Register;
