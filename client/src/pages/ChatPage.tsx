import React, {createRef, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import styles from '../scss/pages/chat_page.module.scss'
import scrollable from '../scss/components/scrollable.module.scss'
import ChatItem from "../components/business/ChatItem";
import {io, Socket} from "socket.io-client";
import {useAppDispatch} from "../hooks/UseAppDispatch";
import {useAppSelector} from "../hooks/UseAppSelector";
import Cookie from "../modules/Cookie";
import constants from "../constants";
import {loadData, updateMessages, updateParticipants} from "../store/actions/chatsActions";
import {Action} from "@reduxjs/toolkit";
import Loader from "../components/design/Loader";
import ParticipantItem from "../components/business/ParticipantItem";
import {chatSlice} from "../store/slices/chatSlice";
import turn from '../assets/menu.png'
import ChatInput from "../components/business/ChatInput";


const ChatPage = () => {
    const params = useParams()
    const dispatch = useAppDispatch()
    const selector = useAppSelector(state => state.chatReducer)
    const [connection, setConnection] = useState<Socket | null>(null)
    const input = createRef<HTMLTextAreaElement>()
    const [hasJoined, setJoined] = useState(false)
    const [isExpanded, setExpanded] = useState(false)
    const [code, setCode] = useState('')
    const [pressedKeys, setPressedKeys] = useState(new Set<string>())
    const [error, setError] = useState('')

    useEffect(() => {
        setConnection(io("http://localhost:8000", {
            autoConnect: false
        }))

        setCode(params.slug!)
    }, [])

    useEffect(() => {
        const id = Cookie.getCookie(constants.COOKIE.ID) ?? ''

        connection?.connect()

        connection?.on(constants.EVENTS.CLIENT.CONNECT, () => {
            connection?.emit(constants.EVENTS.SERVER.JOIN, code, id)
        })

        connection?.on(constants.EVENTS.CLIENT.JOINED, (data) => {
            const userId = data['userId']
            const flag = data['flag']
            const error = data['error']
            console.log(data)
            if (userId === id) {
                if (error) {
                    setError(error)
                    connection?.disconnect()
                } else {
                    if (flag) {
                        setJoined(true)
                    } else {
                        dispatch(chatSlice.actions.onUserPending())
                    }
                    setError('')
                }
            }
        })

        return () => {
            dispatch(chatSlice.actions.onLeavingChat())
            connection?.disconnect()
        }
    }, [connection])

    const sendMessage = () => {
        if (input.current?.value && Cookie.getCookie(constants.COOKIE.ID)) {
            console.log(input.current.value.includes('\n'))
            connection?.emit(constants.EVENTS.SERVER.SEND_MESSAGE, Cookie.getCookie(constants.COOKIE.ID), code, input.current.value)
            input.current.value = ''
        }
    }

    const handleShiftEnterPressAndSend = (e: KeyboardEvent) => {
        pressedKeys.add(e.key)
        if (pressedKeys.has("Shift") && pressedKeys.has("Enter")) {
        } else if (pressedKeys.has("Enter")) {
            sendMessage()
            e.preventDefault()
        }
        console.log(pressedKeys)
    }
    const removeKey = (e: KeyboardEvent) => {
        pressedKeys.delete(e.key)
    }

    useEffect(() => {
        const id = Cookie.getCookie(constants.COOKIE.ID) ?? ''
        dispatch(loadData(code, id) as unknown as Action)

        connection?.on(constants.EVENTS.CLIENT.NEW_JOIN, () => {
            console.log('new join')
            dispatch(updateParticipants(code) as unknown as Action)
        })

        connection?.on(constants.EVENTS.CLIENT.DISCONNECTED, () => {
            console.log('someone disconnected')
            dispatch(updateParticipants(code) as unknown as Action)
        })

        connection?.on(constants.EVENTS.CLIENT.NEW_MESSAGE, () => {
            console.log('new message')
            dispatch(updateMessages(code) as unknown as Action)
        })

        input.current?.addEventListener('change', changeHandler)
    }, [hasJoined])

    const changeHandler = () => {
        window.removeEventListener('keydown', handleShiftEnterPressAndSend)
        window.removeEventListener('keyup', removeKey)

        window.addEventListener('keydown', handleShiftEnterPressAndSend)
        window.addEventListener('keyup', removeKey)
    }

    const acceptParticipant = (code: string, id: string) => {
        if (selector.adminId === Cookie.getCookie(constants.COOKIE.ID)) {
            return () => {
                connection?.emit(constants.EVENTS.SERVER.ACCEPT_USER, code, id)
            }
        }
    };

    return (
        <>
            {
                error ?
                    <h1>{error}</h1> :
                    (
                        connection && !selector.isCurrentUserPending ?
                            <div className={styles.chat}>
                                <div className={[styles.chat_participants, isExpanded && styles.expanded].join(" ")}>
                                    <div className={styles.chat_participants__turn + " " + styles.turn}
                                         onClick={() => setExpanded(state => !state)}>
                                        <img src={turn} alt="turn"/>
                                    </div>
                                    <div
                                        className={[styles.chat_participants__container, scrollable.scrollable, styles.container].join(" ")}>
                                        <div className={styles.title}><p>Participants</p>
                                            <p>{selector.participants.filter(it => !it.isPending).length}</p></div>
                                        {
                                            selector.participants.filter(it => !it.isPending).map(it => {
                                                return (
                                                    <ParticipantItem
                                                        participant={it}
                                                        key={it.id}
                                                    />
                                                )
                                            })
                                        }
                                        {
                                            selector.adminId === Cookie.getCookie(constants.COOKIE.ID) &&
                                            (
                                                <>
                                                    <div className={styles.title}><p>Pending</p>
                                                        <p>{selector.participants.filter(it => it.isPending).length}</p>
                                                    </div>
                                                    {selector.participants.filter(it => it.isPending).map(it => {
                                                        return (
                                                            <ParticipantItem
                                                                participant={it}
                                                                key={it.id}
                                                                acceptIfPendingAndAdmin={acceptParticipant(code, it.id)}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className={styles.chat_participants__overall_participants}>
                                        <div/>
                                        <p>{selector.participants.filter(it => !it.isPending).length}/{selector.restriction}</p>
                                    </div>
                                </div>
                                <div className={styles.chat_content}>
                                    <div className={styles.chat_content__messages + " " + scrollable.scrollable}>
                                        <div className={styles.chat_content__messages__container}>
                                            {selector.messages.map(it => {
                                                return <ChatItem
                                                    key={it.messageId}
                                                    userName={it.userName}
                                                    messageText={it.messageText}
                                                    time={+it.time}
                                                    isUserMessage={Cookie.getCookie(constants.COOKIE.ID) == it.userId}
                                                    messageId={it.messageId}
                                                    userId={it.userId}
                                                />
                                            })
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.chat_content__input}>
                                        <ChatInput onChange={changeHandler} ref={input}/>
                                        <button onClick={() => sendMessage()}/>
                                    </div>
                                </div>
                            </div>
                            :
                            <Loader/>
                    )
            }
        </>
    );
};

export default ChatPage;