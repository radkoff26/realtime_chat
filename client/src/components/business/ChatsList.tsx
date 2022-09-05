import React from 'react';
import {Chat} from "../../models/Chat";
import {Link} from "react-router-dom";
import styles from '../../scss/components/chat_list.module.scss'

export interface ChatsListProps {
    list: Chat[]
    isLoaded: boolean
    textIfEmpty: string
}

const ChatsList = ({list, isLoaded, textIfEmpty}: ChatsListProps) => {
    return (
        <div className={styles.chat_list}>
            {!isLoaded && (list.length === 0 && <h2>{textIfEmpty}</h2>)}
            {list.map(chat => {
                console.log(chat)
                return (
                    <Link to={'/chat/' + chat.chatCode.toLowerCase()} className={styles.chat_list__item} key={chat.chatCode}>
                        <div className={styles.chat_list__item__name}>{chat.name}</div>
                        <div className={styles.chat_list__item__participants}>{chat.currentNumberOfParticipants}/{chat.participantsRestriction}</div>
                        <div className={styles.chat_list__item__code}>Code: {chat.chatCode.toUpperCase()}</div>
                        <div className={styles.chat_list__item__language}>{chat.language}</div>
                    </Link>
                )
            })}
        </div>
    );
};

export default ChatsList;