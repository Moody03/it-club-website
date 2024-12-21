import React, { useEffect, useState } from "react";

function YouTubePlayer({ videoId, onClose }) {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        // Load the YouTube Iframe API script dynamically
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);

        // Initialize the player once the script is loaded
        window.onYouTubeIframeAPIReady = () => {
            const ytPlayer = new window.YT.Player("player", {
                videoId: videoId, // Pass YouTube Video ID
                playerVars: {
                    autoplay: 1, // Auto-play the video
                    controls: 1, // Show player controls
                    modestbranding: 1, // Minimal YouTube branding
                    rel: 0, // Prevent showing related videos at the end
                },
            });
            setPlayer(ytPlayer);
        };

        // Cleanup: Remove the script and player when the component unmounts
        return () => {
            if (player) {
                player.destroy();
            }
            document.body.removeChild(script);
        };
    }, [videoId, player]);

    return (
        <div className="overlay">
            <div className="video-container">
                <div id="player"></div>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default YouTubePlayer;
