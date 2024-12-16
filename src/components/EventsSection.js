import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from '../service/firebase';
import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon for events
import YouTubePlayer from "./YouTubePlayer";
import '../assets/styles/EventsSection.css';



function EventsSection() {
    const [events, setEvents] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);

    useEffect(() => {
        // Get the reference to the "events" collection
        const eventsCollectionRef = collection(firestore, "public_events");

        // Set up real-time listener for the "events" collection
        const unsubscribe = onSnapshot(eventsCollectionRef, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => {
                const data = doc.data();
                // Convert Firestore Timestamp to Date object
                const eventDate = data.date ? data.date.toDate() : new Date();
                return { id: doc.id, ...data, date: eventDate };
            });
            setEvents(eventsData);
        });

        // Clean up the listener on unmount
        return unsubscribe;
    }, []);

    const handleLiveClick = (liveUrl) => {
        const videoId = extractVideoId(liveUrl);
        setActiveVideoId(videoId);
    };

    const closeOverlay = () => {
        setActiveVideoId(null);
    };

    const extractVideoId = (url) => {
        const regExp =
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:live\/|watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

     return (
        <section className={`events`}>
            <h2><FaCalendarAlt /> Upcoming Events</h2>
            {events.map(event => (
                <div key={event.id} className="event-card">
                    <h3>{event.name}</h3>
                    <p className="event-date">
                        <FaCalendarAlt /> {event.date.toLocaleDateString()} {/* Format the date */}
                    </p>
                    <p>{event.description}</p>
                    {event.isLive && event.liveUrl && (
                        <button
                            onClick={() => handleLiveClick(event.liveUrl)}
                            className="live-button"
                        >
                            See Live
                        </button>
                    )}
                </div>
            ))}
            <a href="/events" className="view-all-events">View All Events</a>

            {activeVideoId && (
                <YouTubePlayer videoId={activeVideoId} onClose={closeOverlay} />
            )}
        </section>
    );
}

export default EventsSection;