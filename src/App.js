// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MoviesSeriesPage from './pages/MoviesSeriesPage';
import './assets/styles/App.css';
import ContestPage from './components/ContestPage';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/contest/:contestId" element={<ContestPage />} />
                <Route path="/movies" element={<MoviesSeriesPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
        </Router>
    );
}

export default App;