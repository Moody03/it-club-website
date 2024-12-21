// src/components/ThemeToggle.js
import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import '../assets/styles/theme.css';

function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.body.classList.toggle('dark-theme', !isDark);
    };

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <FaSun title="Light Mode" /> : <FaMoon title="Dark Mode" />}
        </button>
    );
}

export default ThemeToggle;
