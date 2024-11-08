import React from 'react';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import '../assets/styles/AboutPage.css';

function AboutPage() {
    const teamMembers = [
        {
            name: 'Mohammad Abukhass',
            role: 'President',
            linkedin: 'https://linkedin.com/in/mohammadabukhass',
            github: 'https://github.com/Mo0od03',
            portfolio: 'https://johndoe.com',
            icon: 'fa-laptop-code'
        },
        {
            name: 'Jane Smith',
            role: 'UI/UX Designer',
            linkedin: 'https://linkedin.com/in/janesmith',
            github: 'https://github.com/janesmith',
            portfolio: 'https://janesmith.com',
            icon: 'fa-paint-brush'
        },
        {
            name: 'Jane Smith',
            role: 'UI/UX Designer',
            linkedin: 'https://linkedin.com/in/janesmith',
            github: 'https://github.com/janesmith',
            portfolio: 'https://janesmith.com',
            icon: 'fa-paint-brush'
        },
        {
            name: 'Jane Smith',
            role: 'UI/UX Designer',
            linkedin: 'https://linkedin.com/in/janesmith',
            github: 'https://github.com/janesmith',
            portfolio: 'https://janesmith.com',
            icon: 'fa-paint-brush'
        },
        // Add more team members as needed
    ];

    return (
        <section className="about">
            <h1>About Us</h1>
            <p>Learn about our mission, history, and values at the IT Club.</p>
            <h2>Our Team</h2>

            <div className="team-members">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member">
                        <div className="team-icon">
                            <i className={`fa ${member.icon}`}></i>
                        </div>
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>

                        <div className="team-socials">
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin size={25} />
                                </a>
                            )}
                            {member.github && (
                                <a href={member.github} target="_blank" rel="noopener noreferrer">
                                    <FaGithub size={25} />
                                </a>
                            )}
                            {member.portfolio && (
                                <a href={member.portfolio} target="_blank" rel="noopener noreferrer">
                                    <FaGlobe size={25} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AboutPage;
