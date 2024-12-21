import React from "react";
import { AiOutlineMessage } from 'react-icons/ai';
import styled from 'styled-components';

const IconWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: white;
  z-index: 1000;

  &:hover {
    background-color: #0056b3;
  }
`;

const FAQIcon = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <AiOutlineMessage size={30} />
  </IconWrapper>
);

export default FAQIcon;