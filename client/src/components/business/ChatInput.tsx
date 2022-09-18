import React from 'react';
import styles from '../../scss/components/chat_input.module.scss'
import scrollable from '../../scss/components/scrollable.module.scss'

const ChatInput = React.forwardRef<HTMLTextAreaElement>((props, ref) => {
    return (
        <textarea className={[styles.input, scrollable.scrollable].join(" ")} style={{color: '#000'}} placeholder='Message...' ref={ref}></textarea>
    );
});

export default ChatInput;