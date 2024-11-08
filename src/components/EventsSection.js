import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from '../service/firebase';
import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon for events
import '../assets/styles/EventsSection.css';



function EventsSection() {
    const [events, setEvents] = useState([]);

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


    return (
        <section className="events">
            <h2><FaCalendarAlt /> Upcoming Events</h2>
            {events.map(event => (
                <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                        <FaCalendarAlt /> {event.date.toLocaleDateString()} {/* Format the date */}
                    </p>
                    <p>{event.description}</p>
                </div>
            ))}
            <a href="/events" className="view-all-events">View All Events</a>
        </section>
    );
}

export default EventsSection;