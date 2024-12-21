import React from 'react';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import '../assets/styles/AboutPage.css';

function AboutPage() {
    const teamMembers = [
        {
            name: 'جهاد بعيجات',
            role: 'President',
            linkedin: 'https://www.linkedin.com/in/mohammad-abukhass-1a80b6243/',
            github: 'https://github.com/Moody03',
            portfolio: 'https://github.com/Moody03',
            icon: 'fa-laptop-code'
        },

        {
            name: 'Mohammad Abukhass',
            role: 'Vice President',
            linkedin: 'https://www.linkedin.com/in/mohammad-abukhass-1a80b6243/',
            github: 'https://github.com/Moody03',
            portfolio: 'https://github.com/Moody03',
            icon: 'fa-laptop-code'
        },
        {
            name: 'هبة الخراربة',
            role: 'Secretary',
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
            portfolio: 'https://github.com/',
            icon: 'fa-laptop-code'
        },
        {
            name: 'Mohammad Nadal',
            role: 'Member',
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
            portfolio: 'https://github.com/',
            icon: 'fa-laptop-code'
        },

        {
            name: 'Omar Almalhe',
            role: 'Member',
            linkedin: 'https://www.linkedin.com/in/',
            github: 'https://github.com/',
            portfolio: 'https://github.com/',
            icon: 'fa-laptop-code'
        },

        {
            name: 'حمزة الفاعوري',
            role: 'Member',
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
            portfolio: 'https://github.com/',
            icon: 'fa-laptop-code'
        },
        {
            name: 'Ali Shibli',
            role: 'Member',
            linkedin: 'https://www.linkedin.com/',
            github: 'https://github.com/',
            portfolio: 'https://github.com/',
            icon: 'fa-laptop-code'
        }
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