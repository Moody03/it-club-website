import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from '../service/firebase';
import { FaLaptopCode, FaShieldAlt, FaBrain } from 'react-icons/fa'; // Importing icons
import '../assets/styles/ProjectsSection.css';

function ProjectsSection() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Create a reference to the "projects" collection
        const projectsCollectionRef = collection(firestore, 'projects');

        // Set up real-time listener for the "projects" collection
        const unsubscribe = onSnapshot(projectsCollectionRef, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
        });

        // Clean up the listener on component unmount
        return unsubscribe;
    }, []);

    return (
        <section className='projects'>
            <h2>Student Projects</h2>
            <div className="project-icons">
                <FaLaptopCode size={40} />
                <FaShieldAlt size={40} />
                <FaBrain size={40} />
            </div>
            {projects.map(project => (
                <div key={project.id} className='project-card'>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        View Details
                    </a>
                    {project.liveTestLink && (
                        <a href={project.liveTestLink} target="_blank" rel="noopener noreferrer" className="live-test-link">
                            Live Test
                        </a>
                    )}
                </div>
            ))}
        </section>
    );
}

export default ProjectsSection;