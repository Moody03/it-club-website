import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../service/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication
import { auth } from '../service/firebase'; // Import Firebase Authentication
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, User, Mail, Phone, Check, AlertTriangle, X } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../assets/styles/ITClubRegistration.css';

const ITClubRegistration = ({ onClose }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        email: '',
        phoneNumber: '',
        major: '',
        isMember: null,
        termsAccepted: true,
    });
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const IT_MAJORS = [
        "Computer Science",
        "Software Engineer",
        "Artificial Intelligence",
        "Cyber Security",
    ];

    const validatePasswordStrength = (password) => {
        const lengthCriteria = /.{8,}/;
        const numberCriteria = /[0-9]/;
        const uppercaseCriteria = /[A-Z]/;
        const symbolCriteria = /[!@#$%^&*(),.?":{}|<>]/;


        if (password.length === 0) return '';
        if (!lengthCriteria.test(password)) return 'Password must be at least 8 characters long.';
        if (!numberCriteria.test(password)) return 'Password must contain at least one number.';
        if (!uppercaseCriteria.test(password)) return 'Password must contain at least one uppercase letter.';
        if (!symbolCriteria.test(password)) return 'Password must contain at least one special character.';

        return 'Password is strong!';
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        const strength = validatePasswordStrength(password);
        setPasswordStrength(strength);
    };


    const validateInputs = () => {
        const { studentId, studentName, email, phoneNumber, major, isMember } = formData;
        const emailPattern = /^[^\\s@]+@ammanu\.edu\.jo$/;
        const phonePattern = /^[0-9]{10}$/;

        if (!studentId || !studentName || !email || !phoneNumber || !major || !isMember || !password) {
            return 'All fields are required.';
        }
        if (!emailPattern.test(email)) return 'Invalid email address.';
        if (!phonePattern.test(phoneNumber)) return 'Invalid phone number.';

        return null;
    };


    const handleCaptchaChange = (value) => {
        setCaptchaVerified(!!value);
    };





    const handleSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }
        if (!captchaVerified) {
            setError('Please verify the captcha.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Step 1: Create user in Firebase auth
            await createUserWithEmailAndPassword(auth, formData.email, password);
            // Step 2: Log the user in immediately after successful registration
            await signInWithEmailAndPassword(auth, formData.email, password); // Login user after registration
            await addDoc(collection(firestore, 'registrations'), formData);
            alert('Registration successful!');
            onClose();
        } catch (e) {
            setError('Submission failed. Please try again.');
            console.error('Error submitting form:', e);
        } finally {
            setLoading(false);
        }
    };

    const animationVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };


    return (
        <AnimatePresence>
            <motion.div className='modal-overlay' initial='hidden' animate='visible' exit='hidden'>
                <motion.div className='modal-content' variants={animationVariants}>
                    <button className='close-button' onClick={onClose}><X /></button>
                    <h2>Join the IT Club</h2>
                    {error && <p className='error-message'><AlertTriangle />{error}</p>}
                    <form>
                        <div className='form-row'>
                            <div className='form-group'>
                                <label htmlFor='studentId'>Student Id</label>
                                <input
                                    name='studentId'
                                    type='text'
                                    placeholder='Enter Student ID'
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='studentName'>Full Name</label>
                                <input
                                    name='studentName'
                                    type='text'
                                    placeholder='Enter Full Name'
                                    value={formData.studentName}
                                    onChange={handleInputChange}
                                />
                            </div>

                        </div>
                        <div className='form-row'>
                            <div className='form-group'>
                                <label htmlFor='email'>Email</label>
                                <input
                                    name='email'
                                    type='email'
                                    placeholder='Enter your university email'
                                    value={formData.email}
                                    onChange={handleInputChange} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='phoneNumber'>Phone Number</label>
                                <input
                                    name='phoneNumber'
                                    type='text'
                                    placeholder='Enter Phone Number'
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className='form-row'>

                            <div className='form-group'>
                                <label htmlFor='major'>Major</label>
                                <select
                                    name='major'
                                    value={formData.major}
                                    onChange={handleInputChange}>
                                    <option value="">Select Major</option>
                                    {IT_MAJORS.map((major) => <option key={major} value={major}>{major}</option>)}
                                </select>
                            </div>

                            <div className='form-group'>
                                <label>Member?</label>
                                <div className='radio-group'>
                                    <label><input type='radio' name='isMember' value='yes' onChange={handleInputChange} />Yes</label>
                                    <label><input type='radio' name='isMember' value='no' onChange={handleInputChange} />No</label>
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='password'>Password</label>
                                <input
                                    name='password'
                                    type='password'
                                    placeholder='Enter password'
                                    value={password}
                                    onChange={handlePasswordChange} />
                                <div className={`password-strength ${passwordStrength ? 'visible' : ''}`}>
                                    <p>{passwordStrength}</p>
                                </div>
                            </div>
                        </div>
                        <div className='recaptcha-container'>
                            <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCH_SECERT_SITE} onChange={handleCaptchaChange} />
                        </div>
                        <button
                            className='submit-button'
                            type='button'
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Sign Up'}
                        </button>


                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
export default ITClubRegistration;