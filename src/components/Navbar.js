import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaDatabase, FaNetworkWired, FaTrophy, FaFilm, FaBars, FaTimes } from 'react-icons/fa';
import '../assets/styles/Navbar.css';
import ITClubImage from '../assets/images/ITClub.png';

function Navbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [prevScrollY, setPrevScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [scrollDistance, setScrollDistance] = useState(0);

    // Enhance scroll handler with debouncing and smoother transitions
    // Enhanced scroll handler with debouncing and smoother transitions
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - prevScrollY);

        // Determine scroll direction
        const direction = currentScrollY > prevScrollY ? 'down' : 'up';

        // Update scroll distance counter
        setScrollDistance(prev => {
            if (direction !== scrollDirection) {
                return 0; // Reset counter when direction changes
            }
            return prev + scrollDifference;
        });

        // Only update scroll direction if there's significant movement
        if (scrollDifference > 5) {
            setScrollDirection(direction);
        }

        // Show/hide navbar based on scroll behavior
        if (direction === 'down' && currentScrollY > 100) {
            // Hide navbar when scrolling down and past threshold
            if (scrollDistance > 50) {
                setShowNavbar(false);
            }
        } else if (direction === 'up') {
            // Show navbar when scrolling up and after minimal movement
            if (scrollDistance > 20) {
                setShowNavbar(true);
            }
        }

        setPrevScrollY(currentScrollY);
    }, [prevScrollY, scrollDirection]);

    // Debounced scroll event listener
    useEffect(() => {
        let timeoutId;

        const debouncedScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                handleScroll();
            }, 10); // Small delay for smoother performance
        };

        window.addEventListener('scroll', debouncedScroll);
        return () => {
            window.removeEventListener('scroll', debouncedScroll);
            clearTimeout(timeoutId);
        };
    }, [handleScroll]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const navbar = document.querySelector('.navbar');
            if (menuOpen && navbar && !navbar.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={`navbar ${showNavbar ? 'show' : 'hide'}`}>
            <div className="navbar-brand">
                <img src={ITClubImage} alt="IT Club" className="navbar-logo" />
                <button
                    className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label='Toggle Menu'
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/about" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaLaptopCode />
                    <span>About</span>
                </Link>
                <Link to="/projects" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaDatabase />
                    <span>Projects</span>
                </Link>
                <Link to="/leaderboard" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaTrophy />
                    <span>Leaderboard</span>
                </Link>
                <Link to="/movies" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaFilm />
                    <span>Movies</span>
                </Link>
                <Link to="/contact" className="navbar-link" onClick={() => setMenuOpen(false)}>
                    <FaNetworkWired />
                    <span>Contact</span>
                </Link>

            </nav>
            <div className="navbar-icons">
                <FaLaptopCode title="Software Development" />
                <FaDatabase title="Database Management" />
                <FaNetworkWired title="Networking" />
                <FaTrophy title="Leaderboard" />
                <FaFilm title="Movies & Series" />
            </div>

            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
        </header>
    );
}

export default Navbar;
