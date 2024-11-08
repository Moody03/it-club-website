import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaDatabase, FaNetworkWired } from 'react-icons/fa';
import '../assets/styles/Navbar.css';

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <h1>IT Club</h1>
            </div>
            <nav className="navbar-links">
                <Link to="/" className="navbar-link">
                    <FaHome /> Home
                </Link>
                <Link to="/about" className="navbar-link">
                    <FaLaptopCode /> About
                </Link>
                <Link to="/projects" className="navbar-link">
                    <FaDatabase /> Projects
                </Link>
                <Link to="/contact" className="navbar-link">
                    <FaNetworkWired /> Contact
                </Link>
            </nav>
            <div className="navbar-icons">
                <FaLaptopCode title="Software Development" />
                <FaDatabase title="Database Management" />
                <FaNetworkWired title="Networking" />
            </div>
        </header>
    );
}

export default Navbar;
