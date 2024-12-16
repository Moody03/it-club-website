// HeroSection.js

import React from 'react';
import { ArrowDown } from 'lucide-react';
import '../assets/styles/HeroSection.css';
import RegisteredCount from './RegisteredCount';

function HeroSection() {

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };
    return (
        <section className='hero'>
            <h1>Welcome to the IT Club of Amman Al-Ahliyya University!</h1>
            <p>Connecting IT minds to innovate, learn, and grow together.</p>
            <button className='cta-button' onClick={scrollToBottom}>
                <ArrowDown className="arrow-icon" size={24} />
                <ArrowDown className="arrow-icon" size={24} />
            </button>

            <RegisteredCount />
        </section>
    );
}

export default HeroSection;