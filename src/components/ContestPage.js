import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    collection,
    doc,
    getDoc,
    addDoc,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { firestore } from "../service/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../assets/styles/ContestPage.css"; // Import CSS file for transitions

function ContestPage() {
    const { contestId } = useParams(); // Retrieve contestId from the URL
    const [contest, setContest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userContestData, setUserContestData] = useState(null);
    const [contentVisible, setContentVisible] = useState(false);


    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const contestRef = doc(firestore, 'contests', contestId);
                const contestSnap = await getDoc(contestRef);
                if (contestSnap.exists()) {
                    setContest(contestSnap.data());
                    setQuestions(contestSnap.data().challenges || []);
                } else {
                    console.log('No such contest!');
                }
            } catch (error) {
                console.error('Error fetching contest data: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContestData();
    }, [contestId]);

    useEffect(() => {
        if (currentUser) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        console.log("Is LoggedIn: " + isLoggedIn)
    }, [currentUser]);


    // Check if the user is already registered for this contest
    useEffect(() => {
        const checkRegistration = async () => {
            if (currentUser && contestId) {
                const q = query(
                    collection(firestore, 'participants'),
                    where('userId', '==', currentUser.uid),
                    where('contestId', '==', contestId)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setIsRegistered(true); // User is already registered
                    setUserContestData(querySnapshot.docs[0].data()); // Optional: You can store participant data if needed
                    navigate(`/contest/${contestId}`); // Redirect to contest page
                    setContentVisible(true); // Show content when registered
                }
            }
        };

        checkRegistration();
    }, [contestId, currentUser, navigate]);


    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful");
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Login failed. Please check your credentials.");
        }
    };


    const handleRegister = async () => {
        if (currentUser && name && contest && contestId) {
            try {
                // Check if the user is already registered for the contest
                const q = query(
                    collection(firestore, 'participants'),
                    where('userId', '==', currentUser.uid),
                    where('contestId', '==', contestId)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    alert("You have already registered for this contest.");
                    return;
                }

                // Create the new participant
                const newParticipant = {
                    name: name,
                    contestId: contestId, // Use contest.id here
                    points: 0, // Initialize points to 0
                    userId: currentUser.uid, // Associate participant with the logged-in user
                };

                // Add the participant to the 'participants' collection
                await addDoc(collection(firestore, 'participants'), newParticipant);
                setIsRegistered(true);
                alert("Registration successful");
                setContentVisible(true); // Show content when registered
                navigate(`/contest/${contestId}`); // Navigate to the contest page
            } catch (error) {
                console.error("Error registering participant: ", error);
            }
        } else {
            alert("You must be logged in and provide your name to register.");
        }
    };

    if (isLoading) return <p>Loading contest...</p>;


    return (
        <div className="contest-page">
            {contest ? (
                <>
                    <h1>{contest.name}</h1>
                    <p>{contest.description}</p>

                    {/* Display contest template */}
                    <h3>Contest Template:</h3>
                    <div className="contest-template">
                        <p>{contest.template}</p>
                    </div>

                    {/* Display questions related to the contest */}
                    <h3>Questions:</h3>
                    <div className={`contest-content ${contentVisible ? "visible" : "hidden"}`}>
                        {questions.length > 0 ? (
                            questions.map((question, index) => (
                                <div key={index} className="question">
                                    <h4>{question.title}</h4>
                                    <p>{question.description}</p>
                                    <div className="question-challenges">
                                        {question.challenges && question.challenges.length > 0 ? (
                                            question.challenges.map((challenge, idx) => (
                                                <div key={idx} className="challenge">
                                                    <h5>{challenge.type}</h5>
                                                    <p>{challenge.description}</p>
                                                    {challenge.type === 'editor' && (
                                                        <textarea placeholder="Write your code here..."></textarea>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No challenges available for this question.</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No questions available for this contest.</p>
                        )}
                    </div>

                    {/* Registration Form */}
                    {!isRegistered && isLoggedIn && (
                        <div className="register-form">
                            <h3>Register for the Contest</h3>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button onClick={handleRegister}>Register</button>
                        </div>
                    )}

                    {/* If already registered */}
                    {isRegistered && <p>You have successfully registered for this contest!</p>}
                </>
            ) : (
                <p>Contest not found!</p>
            )}

            {/* Login Form if not logged in */}
            {!isLoggedIn && (
                <div className="login-form">
                    <h3>Login to Register</h3>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    );
}

export default ContestPage;
