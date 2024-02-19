import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import '@fortawesome/fontawesome-free/css/all.css';
import '../css/contact.css';

function ContactMe() {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const form = useRef<HTMLFormElement>(null); // Initialize with null

    const sendEmail = (e) => {
        e.preventDefault();
    
        if (form.current) {
            emailjs
                .sendForm('gmail_account', 'template_yv8q03h', e.target, 'MZZjQyGtqAHexhCtJ')
                .then(
                    () => {
                        console.log('SUCCESS!');
                        setIsSubmitted(true);
                    },
                    (error) => {
                        console.log('FAILED...', error.text);
                    }
                );
                console.log(e.target);
        }
    };

    return (
        <div>
            <div className='cornered-box'>
                <h1 style={{ color: 'white' }}>Contact Me</h1>
            </div>
            <div className={`contact-container ${isSubmitted ? 'submitted' : ''}`}>
                <div className="form-container">
                    {!isSubmitted ? (
                        <div>
                            <form ref={form} onSubmit={sendEmail}>
                                <div className="social-icons">
                                    <a href="https://www.linkedin.com/in/michael-perkins-569a31258/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                                    <a href="https://github.com/MichaelDev11" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                                </div>
                                <div className='input-group'>
                                    <input
                                        type='text'
                                        placeholder='Your Name'
                                        name="from_name"
                                        required
                                    />
                                </div>
                                <div className='input-group'>
                                    <input
                                        type='email'
                                        placeholder='Your Email'
                                        name="email"
                                        required
                                    />
                                </div>
                                <div className='input-group'>
                                    <textarea
                                        placeholder='Your Message'
                                        name="message"
                                        required
                                    />
                                </div>
                                <button type='submit'>Submit</button>
                            </form>
                            <script type="text/javascript"
                                src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
                            </script>
                            <script type="text/javascript">
                                emailjs.init('MZZjQyGtqAHexhCtJ')
                            </script>
                        </div>
                    ) : null}
                </div>
                <div className="success-popup-container">
                    {isSubmitted && (
                        <div className='success-popup'>
                            <p>Message Sent!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactMe;
