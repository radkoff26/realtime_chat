import React, {useCallback, useLayoutEffect, useState} from 'react';
import styles from '../../scss/components/hint.module.scss'

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
        <div className={styles.hint} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}>
            <div className={styles.hint_sign} ref={ref}>?</div>
            {isShown && <div className={styles.hint_text}>{text}</div>}
        </div>
    );
};

export default Hint;
