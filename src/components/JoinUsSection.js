import React, {useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import '../assets/styles/JoinUs.css';
import ITClubRegistration from "./ITClubRegistration";

function JoinUsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const modalAnimation = {

        hidden: { opacity: 0 },

        visible: { opacity: 1 },

    };


    return (
        <section className="join-us">
            <h2>Join the IT club</h2>
            <p>Become a member and connect with like-minded IT enthusiasts!</p>
            <button className="join-button" onClick={toggleModal}>Sign Up</button>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalAnimation}
                    >
                        <ITClubRegistration onClose={toggleModal} />
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

export default JoinUsSection;