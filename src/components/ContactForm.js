import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa'; // Import social media icons
import '../assets/styles/ContactForm.css';

function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Contact Page</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
            />
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                required
            />
            <button type="submit">Send Message</button>

            {/* Social Media Icons */}
            <div className="social-icons">
                <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                </a>
                <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer">
                    <FaGlobe />
                </a>
            </div>
        </form>
    );
}

export default ContactForm;
