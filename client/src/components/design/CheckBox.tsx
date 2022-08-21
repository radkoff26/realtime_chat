import React, {useState} from 'react';
import '../../scss/components/checkbox.scss'

const CheckBox = ({label, callback}: {label: string, callback: () => void}) => {
    const [isChosen, setChosen] = useState(false)

    const clickHandler = () => {
        setChosen(isChosen => !isChosen)
        callback()
    }

    return (
        <div className='checkbox_container'>
            <p>{label}</p>
            <div className={'checkbox' + (isChosen ? ' chosen' : '')} onClick={clickHandler}>
                <div/>
            </div>
        </div>
    );
};

export default CheckBox;
