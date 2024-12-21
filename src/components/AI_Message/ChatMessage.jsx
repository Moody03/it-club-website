import React from 'react';
import styled from 'styled-components';

const MessageWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: ${(props) => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.div`
  background: ${(props) =>
    props.sender === 'user' 
      ? 'linear-gradient(135deg, #6e8efb, #a777e3)' 
      : '#f1f0f0'};
  color: ${(props) => (props.sender === 'user' ? '#fff' : '#000')};
  padding: 12px 16px;
  border-radius: ${(props) =>
    props.sender === 'user' 
      ? '15px 15px 0 15px' 
      : '15px 15px 15px 0'};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  max-width: 75%;
  word-break: break-word;
  position: relative;
`;

const Timestamp = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${(props) => (props.sender === 'user' ? '#e0e0e0' : '#888')};
  margin-top: 4px;
  text-align: ${(props) => (props.sender === 'user' ? 'right' : 'left')};
`;

const ChatMessage = ({ sender, text, timestamp }) => (
  <MessageWrapper sender={sender}>
    <MessageContent sender={sender}>
      {text}
      <Timestamp sender={sender}>{timestamp}</Timestamp>
    </MessageContent>
  </MessageWrapper>
);

export default ChatMessage;
