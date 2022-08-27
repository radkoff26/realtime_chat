import React, {useCallback, useLayoutEffect, useState} from 'react';
import '../../scss/components/hint.scss'

const Hint = ({text}: {text: string}) => {
    const [isShown, setShown] = useState(false)
    const [element, setElement] = useState<HTMLDivElement | null>(null)

    const ref = useCallback((element: HTMLDivElement) => {
        if (element !== null) {
            setElement(element)
        }
    }, [])

    useLayoutEffect(() => {
        if (element) {
            const resize = () => {
                element.style.height = element.getBoundingClientRect().width + 'px'
            }

            window.addEventListener('resize', resize)

            return () => {
                window.removeEventListener('resize', resize)
            }
        }
    })

    const mouseOverHandler = () => {
        setShown(true)
    }

    const mouseOutHandler = () => {
        setShown(false)
    }

    return (
        <div className='hint' onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}>
            <div className="hint_sign" ref={ref}>?</div>
            {isShown && <div className="hint_text">{text}</div>}
        </div>
    );
};

export default Hint;
