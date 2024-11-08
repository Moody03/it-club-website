import React from 'react';
import HeroSection from '../components/HeroSection';
import EventsSection from '../components/EventsSection';
import ProjectsSection from '../components/ProjectsSection';
import JoinUsSection from '../components/JoinUsSection';
import NewsSection from '../components/NewsSection';
import '../assets/styles/HomePage.css';

function HomePage() {
    return (
        <div className='home-page'>
            <HeroSection />
            <EventsSection />
            <ProjectsSection />
            <NewsSection />
            <JoinUsSection />
        </div>
    );
}

export default HomePage;