import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from '../service/firebase';
import { FaNewspaper, FaCalendarAlt } from 'react-icons/fa'; // Importing icons
import '../assets/styles/NewsSection.css';


function NewsSection() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        // Reference to the "news" collection
        const newsCollectionRef = collection(firestore, 'news');

        // Real-time listener for the "news" collection
        const unsubscribe = onSnapshot(newsCollectionRef, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(newsData);
        });

        // Clean up listener on component unmount
        return unsubscribe;
    }, []);


    return (
        <section className="news">
            <h2><FaNewspaper /> Latest News</h2>
            {news.map(newsItem => (
                <div key={newsItem.id} className="news-card">
                    <h3><FaCalendarAlt /> {newsItem.title}</h3>
                    <p>{newsItem.date}</p>
                    <p>{newsItem.description}</p>
                    <a href={`/news/${newsItem.id}`}>Read More</a>
                </div>
            ))}
        </section>
    );
}

export default NewsSection;