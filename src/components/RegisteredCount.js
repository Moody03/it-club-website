import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../service/firebase";
import { useSpring, animated } from "react-spring";
import '../assets/styles/RegisteredCount.css';

function RegisteredCount() {
    const [registeredCount, setRegisteredCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegisteredCount = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "registrations"));
                setRegisteredCount(querySnapshot.size); // Total documents = total registered users
            } catch (error) {
                console.error("Error fetching registered count:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRegisteredCount();
    }, []);


    // Add to your RegisteredCount component
    useEffect(() => {
        // Create floating particles
        const container = document.querySelector('.registered-count');
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            container.appendChild(particle);
        }

        // Optional: Add interactive hover effect
        const handleMouseMove = (e) => {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            container.style.transform = `
        translateY(-8px)
        rotateX(${y * 10}deg)
        rotateY(${x * 10}deg)
      `;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', () => {
            container.style.transform = '';
        });

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    


    const numberAnimation = useSpring({
        from: { number: 0 },
        to: { number: registeredCount },
        delay: 200,
        config: { duration: 800 },
    });

    return (
        <div className="registered-count">
            {isLoading ? (
                <p>Loading members...</p>
            ) : (
                <animated.p>
                    {numberAnimation.number.to((n) => `Registered Members: ${Math.floor(n)}`)}
                </animated.p>
            )}
        </div>
    );
}

export default RegisteredCount;
