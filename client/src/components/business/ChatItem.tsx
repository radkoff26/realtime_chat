import React from 'react';
import styles from "../../scss/components/chat_item.module.scss";
import Message from "../../models/Message";

type ChatItemProps = Message & { isUserMessage: boolean }

const replace = (s: string): JSX.Element => {
    s = s.trim()
    let a: string[] = s.split('\n')
    return (<>
        {a.map((it, i) => {
            return <React.Fragment key={i}>{it}<br/></React.Fragment>
        })}
    </>)
}

const ChatItem = (props: ChatItemProps) => {
    return (
        <div className={styles.itemOuter + (props.isUserMessage ? " " + styles.userMessage : "")}>
            <div className={styles.item}>
                <div className={styles.item__top}>
                    <img className={styles.item__top__avatar}
                         src={'https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png'}
                         alt='avatar'/>
                    <div className={styles.item__top__name}>{props.userName}</div>
                </div>
                <div className={styles.item__content}>{replace(props.messageText)}</div>
                <div className={styles.item__time}>{new Date(props.time).toLocaleTimeString()}</div>
            </div>
        </div>
    );
};

export default ChatItem;