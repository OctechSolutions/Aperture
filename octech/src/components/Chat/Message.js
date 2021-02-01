import React from 'react';
import "./Messsage.css";

function Message({ message, timestamp, user, userImage }) {
    return (
        <div className="message">
            <img src={userImage} alt="" />
            <div className="message_info">
                <h4>
                    {user} timestamp
                    </h4>
                <p>{message?.info?.text}</p>
            </div>
        </div>
    );
}

export default Message;