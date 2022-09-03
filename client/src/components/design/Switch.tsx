import React, {useState} from 'react';
import '../../scss/components/switch.scss'

const Switch = ({label, callback}: {label: string, callback: () => void}) => {
    const [isChosen, setChosen] = useState(false)

    const clickHandler = () => {
        setChosen(isChosen => !isChosen)
        callback()
    }

    return (
        <div className='switch_container'>
            <p>{label}</p>
            <div className={'switch' + (isChosen ? ' chosen' : '')} onClick={clickHandler}>
                <div/>
            </div>
        </div>
    );
};

export default Switch;
