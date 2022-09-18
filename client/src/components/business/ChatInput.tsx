import React from 'react';

const ChatInput = React.forwardRef<HTMLTextAreaElement>((props, ref) => {
    return (
        <textarea style={{color: '#000'}} placeholder='Message...' ref={ref}></textarea>
    );
});

export default ChatInput;