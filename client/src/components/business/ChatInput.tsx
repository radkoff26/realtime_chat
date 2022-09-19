import React from 'react';
import styles from '../../scss/components/chat_input.module.scss'
import scrollable from '../../scss/components/scrollable.module.scss'

interface ChatInputProps {
    onChange: () => void
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>((props, ref) => {
    return (
        <textarea className={[styles.input, scrollable.scrollable].join(" ")} onChange={props.onChange} placeholder='Message...' ref={ref}></textarea>
    );
});

export default ChatInput;