import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import axios from 'axios';



const fadeInMessage = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Dot bounce animation
const bounce = keyframes`
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% { 
    transform: translateY(-6px);
  }
`;

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

// New Typing Indicator Styles
const TypingIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 10px;
  width: fit-content;
`;

const TypingDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #90909090;
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
  animation-delay: ${props => props.delay}s;
`;

const ModernText = styled.div`
  animation: ${fadeInMessage} 0.5s ease-out forwards;
  opacity: 0;
`;



// New Typing Indicator Component
const TypingIndicator = () => (
  <TypingIndicatorWrapper>
    <TypingDot delay={0} />
    <TypingDot delay={0.2} />
    <TypingDot delay={0.4} />
  </TypingIndicatorWrapper>
);

/*const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;*/

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: `Hello there! Welcome to **Luminary** 🤖 - your personal academic assistant here at Amman Al-Ahliyya University!  
      I'm here to help you with any questions or guidance you might need. Proudly crafted with ❤️ by the IT Club members!`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [requestsToday, setRequestsToday] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const MAX_REQUESTS_PER_DAY = 50;
  const MIN_REQUEST_INTERVAL = 30 * 1000; // 30 seconds (2 RPM)
  const MAX_TOKENS_PER_MINUTE = 32000;



  // Estimate tokens (approximation, assuming 4 characters per token)
  const estimateTokens = (text) => {
    return text.length / 4; // Approximation
  };


  const resetRequestLimits = process.env.REACT_APP_RESET_REQUEST_LIMIT === 'true';

  const sendMessage = async (message) => {
    const currentTime = new Date().getTime();

    // Reset the request limits for deployment (testing purposes)
    if (resetRequestLimits) {
      setRequestsToday(0);
      setLastRequestTime(0);
      console.log('Request limits reset for deployment.');
    }

    // 1. Check if requests are within the daily limit
    if (requestsToday >= MAX_REQUESTS_PER_DAY) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Daily request limit reached. Please try again tomorrow.",
          sender: 'system',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      return; // Exit early if the daily limit is exceeded
    }

    // 2. Check if the time interval between requests is respected (2 RPM)
    if (currentTime - lastRequestTime < MIN_REQUEST_INTERVAL) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Please wait before sending another request.",
          sender: 'system',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      return; // Exit early if the interval hasn't passed
    }

    // Update request tracking
    setLastRequestTime(currentTime);
    setRequestsToday(requestsToday + 1);

    // 3. Estimate input tokens
    const inputTokens = estimateTokens(message);
    const remainingTokens = MAX_TOKENS_PER_MINUTE - inputTokens;

    // 4. Dynamically set maxOutputTokens based on the remaining tokens
    const dynamicMaxOutputTokens = Math.min(remainingTokens, 8192); // Max 8192 tokens for output

    // Add user message to chat
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [
      ...prev,
      { text: message, sender: 'user', timestamp },
    ]);

    // Set thinking state
    setIsThinking(true);

    try {
      // Proxy server URL
      const proxyURL = 'https://chatbot-proxy-moody03s-projects.vercel.app/?vercelToolbarCode=D_WeU-J9cyva464';

      // Validate message before sending
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      // Axios request with timeout and error handling
      const response = await axios.post(proxyURL, { message }, { headers: { 'Content-Type': 'application/json' } });
      

      // Validate response
      if (!response.data || !response.data.response) {
        throw new Error('Invalid response from server');
      }

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        {
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);

    } catch (error) {
      // Comprehensive error handling
      console.error('Error fetching AI response:', error);

      let errorMessage = "I'm sorry, something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = error.response.data.error ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response received from the server. Please check your connection.";
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please try again.";
        }
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          sender: 'system',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);

    } finally {
      // Always reset thinking state
      setIsThinking(false);
    }
  };


  useEffect(() => {
    // Reset requests count every 24 hours (or you can implement a more sophisticated method)
    const resetRequests = setInterval(() => {
      setRequestsToday(0);
    }, 24 * 60 * 60 * 1000); // Reset every 24 hours

    return () => clearInterval(resetRequests);
  }, []);

  return (
    <ChatWrapper>
      <ChatHeader>
        Luminary
        <button style={{ float: 'right', color: 'white' }} onClick={onClose}>
          ✖
        </button>
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <ModernText key={index}>
            <ChatMessage
              sender={msg.sender}
              text={msg.text}
              timestamp={msg.timestamp}
            />
          </ModernText>
        ))}
        {isThinking && <TypingIndicator />}
      </ChatBody>
      <ChatInput onSend={sendMessage} />
    </ChatWrapper>
  );
};

export default ChatBot;



