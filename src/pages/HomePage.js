import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import EventsSection from '../components/EventsSection';
import ProjectsSection from '../components/ProjectsSection';
import JoinUsSection from '../components/JoinUsSection';
import NewsSection from '../components/NewsSection';
import '../assets/styles/HomePage.css';
import FAQIcon from '../components/AI_Message/FAQIcon';
import ChatBot from '../components/AI_Message/ChatBot';
import Footer from '../components/Footer';

function HomePage() {
    const [chatOpen, setChatOpen] = useState(false);

    const handleFAQClick = () => {
        setChatOpen(true);  // This should open the chat
    };
    return (
        <div className='home-page'>
            <HeroSection />
            <EventsSection />
            <ProjectsSection />
            <NewsSection />
            <JoinUsSection />

            <>
                {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
                <FAQIcon onClick={handleFAQClick} />
            </>


            <Footer />
           
        </div>
    );
}

export default HomePage;