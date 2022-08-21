import React, {useState} from 'react';
import '../../scss/components/hint.scss'

const Hint = ({text}: {text: string}) => {
    const [isShown, setShown] = useState(false)

    const mouseOverHandler = () => {
        setShown(true)
    }

    const mouseOutHandler = () => {
        setShown(false)
    }

    return (
        <div className='hint' onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}>
            <div className="hint_sign">?</div>
            {isShown && <div className="hint_text">{text}</div>}
        </div>
    );
};

export default Hint;
