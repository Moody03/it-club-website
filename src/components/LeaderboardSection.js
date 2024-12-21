import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { firestore } from '../service/firebase';
import '../assets/styles/LeaderboardSection.css';
import { useNavigate } from 'react-router-dom';

function LeaderboardSection() {
    const [participants, setParticipants] = useState([]);
    const [contests, setContests] = useState([]); // To hold the contest data
    const [filterType, setFilterType] = useState('name'); // 'name' or 'rank'
    const [filterName, setFilterName] = useState('');
    const [filterRank, setFilterRank] = useState({ min: '', max: '' });
    const [filterContest, setFilterContest] = useState(''); // To filter by specific contest


    // Animation to contest
    const [futureContest, setFutureContest] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isExploding, setIsExploding] = useState(false);

    // Contest Registertaion
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const now = new Date();
        const contestsCollectionRef = collection(firestore, 'contests');

        const unsubscribeContests = onSnapshot(contestsCollectionRef, (snapshot) => {
            const contestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContests(contestsData);

            const upcomingContest = contestsData.find(contest => new Date(contest.date) > now);
            if (upcomingContest) {
                setFutureContest(upcomingContest);
                const contestDate = new Date(upcomingContest.date);
                const timeUntilContest = Math.max(0, Math.floor((contestDate - now) / 1000)); // Time in seconds
                setTimeLeft(timeUntilContest);
            } else {
                setFutureContest(null);
                setTimeLeft(null);
            }
        });

        return () => unsubscribeContests();
    }, []);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        // Set exploding effect when timeLeft is less than or equal to 10 sec
        if (timeLeft <= 10 && !isExploding) {
            setIsExploding(true);
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Handle register
    const handleRegister = async () => {
        if (name && major && futureContest) {
            try {
                const newParticipant = {
                    name,
                    major,
                    contestId: futureContest.id,
                    points: 0, // Initialize points for the participant
                    rank: participants.length + 1, // Assign rank based on total participants
                };
                await addDoc(collection(firestore, 'participants'), newParticipant);
                setIsRegistered(true);
                navigate(`/contest/${futureContest.id}`); // Redirect to contest page after registration
            } catch (error) {
                console.error('Error registering participant: ', error);
            }
        }
    };

    useEffect(() => {
        // Fetch participants data from Firestore
        const participantsCollectionRef = collection(firestore, 'participants');
        const unsubscribeParticipants = onSnapshot(participantsCollectionRef, (snapshot) => {
            const participantsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setParticipants(participantsData);
        });

        // Fetch contests data from Firestore
        const contestsCollectionRef = collection(firestore, 'contests');
        const unsubscribeContests = onSnapshot(contestsCollectionRef, (snapshot) => {
            const contestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContests(contestsData);
        });

        return () => {
            unsubscribeParticipants();
            unsubscribeContests();
        };
    }, []);

    // Sort participants by points in descending order and filter by name, rank, and contest
    const sortedParticipants = participants
        .filter(participant => {
            const matchesName = filterName ? participant.name.toLowerCase().includes(filterName.toLowerCase()) : true;
            const matchesRank = (filterRank.min || filterRank.max)
                ? (parseInt(filterRank.min || 0) <= participant.rank &&
                    (filterRank.max ? participant.rank <= parseInt(filterRank.max) : true))
                : true;
            const matchesContest = filterContest ? participant.contestId === filterContest : true;
            return (filterType === 'name' ? matchesName : matchesRank) && matchesContest;
        })
        .sort((a, b) => b.points - a.points); // Sort by points in descending order

    // Dynamically assign rank based on sorted points
    const rankedParticipants = sortedParticipants.map((participant, index) => ({
        ...participant,
        rank: index + 1, // Assign rank based on position in sorted array
    }));

    const resetFilters = () => {
        setFilterType('name');
        setFilterName('');
        setFilterRank({ min: '', max: '' });
        setFilterContest('');
    };

    return (
        <section className="leaderboard-section">
            <h2>Leaderboard</h2>

            {/* Display countdown if there is an upcoming contest */}
            {futureContest && timeLeft > 0 && (
                <div className={`timer-container ${isExploding ? 'exploding' : ''}`}>
                    {timeLeft > 10 ? (
                        <h2 className="mysterious-timer">
                            Starting in: {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {timeLeft % 60}s
                        </h2>
                    ) : (
                        <h2 className="final-countdown">{timeLeft}s</h2>
                    )}
                </div>
            )}

               {/* Show registration form if time left is greater than 20 seconds */}
               {futureContest && timeLeft > 20 && !isRegistered && (
                <div className="register-container">
                    <h3>Register for the Contest: {futureContest.name}</h3>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Your Major"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                    />
                    <button onClick={handleRegister}>Register</button>
                </div>
            )}

            {/* Filters */}
            <div className="leaderboard-filters">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-type-select"
                >
                    <option value="name">Filter by Name</option>
                    <option value="rank">Filter by Rank</option>
                </select>

                {filterType === 'name' ? (
                    <input
                        type="text"
                        placeholder="Filter by name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                ) : (
                    <div className="rank-range">
                        <input
                            type="number"
                            placeholder="Min rank"
                            value={filterRank.min}
                            onChange={(e) => {
                                const value = Math.max(1, e.target.value);
                                setFilterRank({ ...filterRank, min: value });
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Max rank"
                            value={filterRank.max}
                            onChange={(e) => {
                                const value = Math.max(1, e.target.value);
                                setFilterRank({ ...filterRank, max: value });
                            }}
                        />
                    </div>
                )}

                <div className="leaderboard-filter">
                    <select onChange={(e) => setFilterContest(e.target.value)} value={filterContest}>
                        <option value="">All Contests</option>
                        {contests.map(contest => (
                            <option key={contest.id} value={contest.id}>
                                {contest.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={resetFilters} className="reset-button">
                    Reset Filters
                </button>
            </div>

            {/* Participant List */}
            <div className="leaderboard-list">
                {rankedParticipants.length > 0 ? (
                    rankedParticipants.map((participant) => (
                        <div key={participant.id} className="leaderboard-card">
                            <p className="rank">#{participant.rank}</p>
                            <h3>{participant.name}</h3>
                            <p>{participant.points} Points</p>
                        </div>
                    ))
                ) : (
                    <p>No participants found.</p>
                )}
            </div>
        </section>
    );
}

export default LeaderboardSection;
