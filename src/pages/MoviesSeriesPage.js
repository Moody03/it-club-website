import React, { useState, useEffect } from "react";
import '../assets/styles/MoviesPage.css';
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../service/firebase";
import { FaStar, FaPlay, FaInfoCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import * as Vibrant from "node-vibrant/dist/vibrant.js"; // Install this for color extraction
import Modal from "react-modal"; // Import the modal

// Set the app element for accessibility (helps with screen readers)
Modal.setAppElement('#root');

function MoviesSeriesPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [topRated, setTopRated] = useState(null);
    const [colorScheme, setColorScheme] = useState({
        primary: 'rgba(18, 18, 18, 0.95)',
        secondary: 'rgba(25, 25, 25, 0.8)',
        accent: 'rgba(30, 30, 30, 0.6)',
        background: {
            main: '#121212',
            overlay: 'linear-gradient(45deg, #121212, #1a1a1a)'
        },
        textColor: '#ffffff',
        gradient: {
            base: 'linear-gradient(135deg, #121212, #1a1a1a)',
            overlay: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 70%)'
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [previousColorScheme, setPreviousColorScheme] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0); // Current review navigation index



    const updateColorSchemeWithAnimation = async (newColorScheme) => {
        setIsTransitioning(true);
        setPreviousColorScheme(colorScheme);

        // Store the start time
        const startTime = performance.now();
        const duration = 1500; // 1.5 seconds transition

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth transition
            const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const ease = easeInOutCubic(progress);

            // Interpolate between colors
            const interpolateColor = (start, end) => {
                if (!start || !end) return end;
                const startRGB = hexToRgb(start.replace(/rgba?\(|\)/g, '').split(',').map(Number));
                const endRGB = hexToRgb(end.replace(/rgba?\(|\)/g, '').split(',').map(Number));

                if (!startRGB || !endRGB) return end;

                const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ease);
                const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ease);
                const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ease);
                const a = startRGB.a + (endRGB.a - startRGB.a) * ease;

                return `rgba(${r}, ${g}, ${b}, ${a})`;
            };

            // Create interpolated color scheme
            const interpolatedScheme = {
                primary: interpolateColor(colorScheme.primary, newColorScheme.primary),
                secondary: interpolateColor(colorScheme.secondary, newColorScheme.secondary),
                accent: interpolateColor(colorScheme.accent, newColorScheme.accent),
                background: {
                    main: interpolateColor(colorScheme.background.main, newColorScheme.background.main),
                    overlay: interpolateColor(colorScheme.background.overlay, newColorScheme.background.overlay)
                },
                textColor: interpolateColor(colorScheme.textColor, newColorScheme.textColor),
                gradient: {
                    base: newColorScheme.gradient.base,
                    overlay: newColorScheme.gradient.overlay
                }
            };

            setColorScheme(interpolatedScheme);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setColorScheme(newColorScheme);
                setIsTransitioning(false);
            }
        };

        requestAnimationFrame(animate);
    };
    const extractColorFromImage = async (imageUrl) => {
        try {
            // Create a new instance of Vibrant
            const vibrant = new Vibrant(imageUrl, {
                quality: 1,
                worker: false,
                filters: [], // Remove any default filters
                generator: 'default',
                colorCount: 64,
            });

            // Get the color palette
            const palette = await vibrant.getPalette();
            if (!palette) return createFallbackGradient();

            // Extract all available swatches
            const {
                Vibrant: vibrantSwatch,
                DarkVibrant: darkSwatch,
                LightVibrant: lightSwatch,
                Muted: mutedSwatch,
                DarkMuted: darkMutedSwatch,
                LightMuted: lightMutedSwatch
            } = palette;

            // Create an array of valid swatches (not null/undefined)
            const validSwatches = [
                vibrantSwatch,
                darkSwatch,
                lightSwatch,
                mutedSwatch,
                darkMutedSwatch,
                lightMutedSwatch
            ].filter(Boolean);

            if (validSwatches.length === 0) return createFallbackGradient();

            // Get the dominant colors
            const primaryColor = vibrantSwatch || validSwatches[0];
            const secondaryColor = darkSwatch || darkMutedSwatch || validSwatches[1] || primaryColor;
            const accentColor = lightSwatch || lightMutedSwatch || validSwatches[2] || primaryColor;

            // Create a color scheme object
            const colorScheme = {
                primary: adjustColorOpacity(primaryColor.hex, 0.8),
                secondary: adjustColorOpacity(secondaryColor.hex, 0.6),
                accent: adjustColorOpacity(accentColor.hex, 0.4),
                background: createDynamicBackground(primaryColor, secondaryColor, accentColor),
                textColor: calculateTextColor(primaryColor.rgb),
                gradient: createGradient(primaryColor, secondaryColor, accentColor)
            };

            return colorScheme;
        } catch (err) {
            console.error("Error extracting color:", err);
            return createFallbackGradient();
        }
    };
    // Helper functions for color manipulation
    const adjustColorOpacity = (hex, opacity) => {
        const rgb = hexToRgb(hex);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const calculateTextColor = (rgb) => {
        // Calculate relative luminance
        const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    };
    const createDynamicBackground = (primary, secondary, accent) => {
        return {
            main: adjustColorOpacity(primary.hex, 0.15),
            overlay: `linear-gradient(45deg, 
                ${adjustColorOpacity(primary.hex, 0.1)}, 
                ${adjustColorOpacity(secondary.hex, 0.05)}, 
                ${adjustColorOpacity(accent.hex, 0.08)})`
        };
    };

    const createGradient = (primary, secondary, accent) => {
        return {
            base: `linear-gradient(135deg, 
                ${adjustColorOpacity(primary.hex, 0.9)} 0%, 
                ${adjustColorOpacity(secondary.hex, 0.6)} 50%, 
                ${adjustColorOpacity(accent.hex, 0.3)} 100%)`,
            overlay: `radial-gradient(circle at top right, 
                ${adjustColorOpacity(accent.hex, 0.4)}, 
                transparent 70%)`
        };
    };

    const createFallbackGradient = () => ({
        primary: 'rgba(18, 18, 18, 0.95)',
        secondary: 'rgba(25, 25, 25, 0.8)',
        accent: 'rgba(30, 30, 30, 0.6)',
        background: {
            main: '#121212',
            overlay: 'linear-gradient(45deg, #121212, #1a1a1a)'
        },
        textColor: '#ffffff',
        gradient: {
            base: 'linear-gradient(135deg, #121212, #1a1a1a)',
            overlay: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 70%)'
        }
    });


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'movies_and_series'));
                const moviesData = snapshot.docs.map((doc) => ({
                    id: doc.id, ...doc.data(), averageRating: doc.data().averageRating || 0, // Default to 0 if it's undefined or null
                }));
                setMovies(moviesData);
                if (moviesData.length > 0) {
                    const top = moviesData.reduce((prev, curr) =>
                        prev.averageRating > curr.averageRating ? prev : curr
                    );
                    setTopRated(top);

                    // Extract dominant color from top-rated movie poster
                    if (top.imageUrl) {
                        // Pre-load the image
                        const img = new Image();
                        img.crossOrigin = "Anonymous"; // Add this if images are from different domain
                        img.src = top.imageUrl;

                        img.onload = async () => {
                            const backgroundColor = await extractColorFromImage(top.imageUrl);
                            updateColorSchemeWithAnimation(backgroundColor);
                        };

                        img.onerror = () => {
                            console.error("Error loading image");
                            updateColorSchemeWithAnimation(createFallbackGradient());
                        };
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // Handle rating submission
    const handleRateAndReview = async (movieId) => {
        if (userRating < 1 || userRating > 5 || userReview.trim() === "") {
            alert("Please provide a valid rating (1-5) and a review.");
            return;
        }

        const movieRef = doc(firestore, "movies_and_series", movieId);

        try {
            // Fetch the current movie data using getDoc
            const movieSnapshot = await getDoc(movieRef);
            if (!movieSnapshot.exists()) {
                throw new Error("Movie not found");
            }

            const movieData = movieSnapshot.data();

            // Ensure reviews is initialized as an array if it's undefined
            const currentReviews = Array.isArray(movieData.reviews) ? movieData.reviews : [];

            // Determine the next anonymous reviewer name by extracting the last number
            let nextReviewerName = "Anonymous1"; // Default to Anonymous1 if no reviews
            if (currentReviews.length > 0) {
                // Get the last reviewer's name, assuming it's in the format "AnonymousX"
                const lastReviewerName = currentReviews[currentReviews.length - 1].reviewerName;
                const match = lastReviewerName.match(/Anonymous(\d+)$/);

                if (match) {
                    const lastNumber = parseInt(match[1], 10); // Extract the number and convert to integer
                    nextReviewerName = `Anonymous${lastNumber + 1}`; // Increment the number
                }
            }

            // Add the rating to the existing ratings array
            const newRatings = [...movieData.ratings, userRating];

            // Create the new review object
            const newReview = {
                reviewerName: nextReviewerName, // Use the generated reviewer name
                rating: userRating,
                comment: userReview
            };

            // Add the new review to the existing reviews array
            const newReviews = [...currentReviews, newReview];

            // Recalculate the average rating
            const newAverageRating = newRatings.reduce((a, b) => a + b, 0) / newRatings.length;

            // Update the movie document in Firebase, adding to the reviews array and updating ratings and average rating
            await updateDoc(movieRef, {
                ratings: newRatings,
                reviews: newReviews, // Add the new review to the array
                averageRating: newAverageRating,
            });

            alert("Thank you for your rating and review!");

            // Reset the form after submission
            setUserReview('');
            setUserRating(0);  // Reset the rating and review form
            setIsModalOpen(false);  // Close the modal after submission
        } catch (error) {
            console.error("Error submitting rating and review: ", error);
        }
    };


    // Open the modal for the selected movie
    const openModal = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    // Handle review navigation (Next/Previous)
    const handleReviewNavigation = (direction) => {
        if (topRated.reviews && topRated.reviews.length > 0) {
            const totalReviews = topRated.reviews.length;

            // Calculate the new index with wrap-around logic
            let newIndex = currentReviewIndex + direction;

            // Wrap around logic
            if (newIndex < 0) {
                newIndex = totalReviews - 1; // Go to the last review if at the first
            } else if (newIndex >= totalReviews) {
                newIndex = 0; // Go to the first review if at the last
            }

            // Update the current review index
            setCurrentReviewIndex(newIndex);
            console.log("Current Review Index: ", newIndex); // Log for debugging
        }
    };


    // Updated section styling component
    const MoviePageSection = ({ colorScheme, children }) => {
        const sectionStyle = {
            backgroundColor: colorScheme.background.main,
            background: colorScheme.gradient.base,
            transition: isTransitioning ? 'none' : 'all 0.5s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            color: colorScheme.textColor,
        };

        const overlayStyle = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: colorScheme.gradient.overlay,
            pointerEvents: 'none',
            opacity: 0.8,
            transition: isTransitioning ? 'none' : 'opacity 0.5s ease-in-out',
        };

        return (
            <section className="movies-page" style={sectionStyle}>
                <div style={overlayStyle} />
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    transition: isTransitioning ? 'none' : 'all 0.5s ease-in-out'
                }}>
                    {children}
                </div>
            </section>
        );
    };

    return (
        <MoviePageSection colorScheme={colorScheme}>


            <h1 className="page-title">Movies & Series</h1>

            {loading ? (
                <p>Loading movies...</p>
            ) : topRated ? (
                <div className="top-rated">
                    <img
                        src={topRated.imageUrl}
                        alt={topRated.title}
                        className="top-image"
                    />
                    <h2 className="top-title">{topRated.title}</h2>
                    <p className="top-description">{topRated.description}</p>
                    <p className="movie-rating">
                        <FaStar className="rating-icon" />
                        {typeof topRated.averageRating === "number" && !isNaN(topRated.averageRating)
                            ? topRated.averageRating.toFixed(1)
                            : 0} / 5
                    </p>

                    <div className="reviews-container">
                        <h3>Reviews</h3>
                        {topRated.reviews && topRated.reviews.length > 0 ? (
                            <div className="reviews">
                                <div
                                    className="review-text"
                                    style={{ animation: "fade-in 1s" }}
                                    key={currentReviewIndex}
                                >
                                    <p><strong>{topRated.reviews[currentReviewIndex].reviewerName}</strong></p>
                                    <p>Rating: {topRated.reviews[currentReviewIndex].rating} / 5</p>
                                    <p>{topRated.reviews[currentReviewIndex].comment}</p>
                                </div>
                                <div className="review-navigation">
                                    <button onClick={() => handleReviewNavigation(-1)}>
                                        <FaArrowLeft style={{ fontSize: '24px', color: '#fff' }} /> Prev
                                    </button>
                                    <button onClick={() => handleReviewNavigation(1)}>
                                        Next <FaArrowRight style={{ fontSize: '24px', color: '#fff' }} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            ) : null}

            {movies.length > 0 ? (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img
                                src={movie.imageUrl}
                                alt={movie.title}
                                className="movie-image"
                            />
                            <div className="movie-details">
                                <h3 className="movie-title">{movie.title}</h3>
                                <p className="movie-genre">{movie.genre.join(', ')}</p>
                                <p className="movie-rating">
                                    <FaStar className="rating-icon" />
                                    {typeof movie.averageRating === "number" && !isNaN(movie.averageRating)
                                        ? movie.averageRating.toFixed(1)
                                        : 0} / 5
                                </p>
                            </div>
                            <div className="movie-actions">
                                <button onClick={() => openModal(movie)} className="btn-info">
                                    <FaInfoCircle /> More Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No movies found.</p>
            )}
            {/* Modal for More Info */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="More Info"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <button onClick={closeModal} className="modal-close">X</button>
                <h2>{selectedMovie?.title}</h2>
                <p><strong>Description:</strong> {selectedMovie?.description}</p>
                <p><strong>Release Year:</strong> {selectedMovie?.releaseYear}</p>

                {/* Rating & Review Form inside the modal */}
                <div className="rating-review-form">
                    <h4>Rate & Review</h4>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                                key={star}
                                className={`star-icon ${userRating >= star ? 'filled' : ''}`}
                                onClick={() => setUserRating(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Write a review"
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                    />
                    <button onClick={() => handleRateAndReview(selectedMovie?.id)}>
                        Submit Review
                    </button>
                </div>
            </Modal>
        </MoviePageSection>
    );
}


export default MoviesSeriesPage;
