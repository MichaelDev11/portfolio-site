import React, { useState } from 'react';
import '../css/nav.css';

const Navbar = () => {
    const [currentPage, setCurrentPage] = useState(null);

    const handleSelectedPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <nav className="navbar">
            <a href='/' className="navbar-title">Michael Perkins</a>
            <div className="navbar-links">
                <a href="/" className={`navbar-link navbar-animate ${currentPage === '/' ? 'navbar-selected' : ''}`} onClick={() => handleSelectedPage('/')}>Home</a>
                <a href="/projects" className={`navbar-link navbar-animate ${currentPage === '/projects' ? 'navbar-selected' : ''}`} onClick={() => handleSelectedPage('/projects')}>Projects</a>
                <a href="/about-me" className={`navbar-link navbar-animate ${currentPage === '/about-me' ? 'navbar-selected' : ''}`} onClick={() => handleSelectedPage('/about-me')}>About Me</a>
                <a href="/contact-me" className={`navbar-link navbar-animate ${currentPage === '/contact-me' ? 'navbar-selected' : ''}`} onClick={() => handleSelectedPage('/contact-me')}>Contact Me</a>
            </div>
        </nav>
    );
};

export default Navbar;
