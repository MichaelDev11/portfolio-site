import React from 'react';
import '../css/about.css';
import headshot from '../objects/headshot2.jpeg';
import pyLogo from '../objects/py-logo.svg'
import cppLogo from '../objects/cpp-logo.svg'
import cLogo from '../objects/c-logo.svg'
import reactLogo from '../objects/react-logo.svg'
import jsLogo from '../objects/javascript-logo.svg'
import cssLogo from '../objects/css-logo.svg'



function AboutMe() {
    return (
        <div>
            <div className='cornered-box'>
                <h1 style={{ color: 'white' }}>About Me</h1>
            </div>
            <div className='about-container'>
                <div className='image-container'>
                    <div className='image-frame'>
                        <img src={headshot} alt="Headshot" />
                    </div>
                </div>
                <div className='text-container'>
                    <div className='text-content-holder'>
                        <div className='text-content'>
                            <div className='text-content'>
                                <p>
                                    Hi! I am Mike, I am currently pursuing a degree in Computer Engineering
                                    with a minor in Physics at the University of South Florida.
                                    Originally interested with electronics, my interests expanded when I discovered programming
                                    in my sophomore year in high school, leading me to choose Computer Engineering.
                                    I have a keen interests towards Robotics, Hardware Engineering, Software Engineering,
                                    and recently Embedded Systems. Beyond academia, I prioritize a balance between academic pursuits
                                    and personal interests by going to the gym, quality time with friends, and even honing my skills with tinkering
                                    with electronics such as Arduino microcontrollers. I'm open to discussing potential collaboration or job opportunities!
                                    Feel free to connect with me through my Contact Me page!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='cornered-box'>
                <h1 style={{ color: 'white' }}>Skills</h1>
            </div>
            <div className='skill-frame'>
                <div className='skill-badge'>
                    <img src={pyLogo} alt='Python'/> 
                </div>
                <div className='skill-badge'>
                    <img src={cppLogo} alt='C++'/>
                </div>
                <div className='skill-badge'>
                    <img src={cLogo} alt='C'/>
                </div>
                <div className='skill-badge'>
                    <img src={reactLogo} alt='React'/> 
                </div>
                <div className='skill-badge'>
                    <img src={jsLogo} alt='Javascript' width="70%"/>
                </div>

                <div className='skill-badge'>
                <img src={cssLogo} alt='CSS' width="70%"/>
                </div>
            </div>
            <div className='skill-text-container'>
                <div className='skill-text'>Python</div>
                <div className='skill-text'>C++</div>
                <div className='skill-text'>C</div>
                <div className='skill-text'>React</div>
                <div className='skill-text'>Javascript</div>
                <div className='skill-text'>CSS</div>
            </div>
        </div>
    );
}

export default AboutMe;
