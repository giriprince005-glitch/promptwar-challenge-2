import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

/**
 * Individual chat message bubble component.
 * @param {Object} props
 * @param {Object} props.message - Message data
 * @param {string} props.message.role - 'user' or 'assistant'
 * @param {string} props.message.text - Message content
 */
const ChatMessage = ({ message }) => {
  return (
    <div className={`message-wrapper ${message.role}`}>
      <div className="message-avatar" aria-hidden="true">
        {message.role === 'assistant' ? <FaRobot /> : <FaUser />}
      </div>
      <div className="message-bubble">
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
