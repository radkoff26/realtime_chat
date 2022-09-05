import React from 'react';
import {useParams} from "react-router-dom";

const ChatPage = () => {
    const params = useParams()

    return (
        <div>
            {params.slug}
        </div>
    );
};

export default ChatPage;