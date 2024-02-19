import React, { useState } from 'react';
import '../App.css';
import '../css/button.css';
import { projectsData } from '../components/projectdata.tsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Projects() {

    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleLanguageClick = (language) => {
        setSelectedLanguage(language);
    }

    const handleShowAll = () => {
        setSelectedLanguage(null);
    }

    const filteredProjects = selectedLanguage ? projectsData.filter(project => project.language === selectedLanguage) : projectsData;

    return (
        <div>
            <div className='cornered-box'>
                <h1 style={{ color: 'white' }}>Projects</h1>
            </div>
            <div className="align-center">
                <div className="button-container">
                    <div className={`btn btn-gray btn-animate ${selectedLanguage === 'cpp' ? 'btn-selected' : ''}`} onClick={() => handleLanguageClick('cpp')}>C++</div>
                    <div className={`btn btn-gray btn-animate ${selectedLanguage === 'c' ? 'btn-selected' : ''}`} onClick={() => handleLanguageClick('c')}>C</div>
                    <div className={`btn btn-gray btn-animate ${selectedLanguage === 'python' ? 'btn-selected' : ''}`} onClick={() => handleLanguageClick('python')}>Python</div>
                    <div className={`btn btn-gray btn-animate ${selectedLanguage === null ? 'btn-selected' : ''}`} onClick={handleShowAll}>Show All</div>
                </div>
                <p className='text-below'>Filter by language</p>
            </div>
            {filteredProjects.map((project, index) => (
                <div key={index} className='frame'>
                    <div className='project'>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <div className='code-block'>
                            <SyntaxHighlighter language={project.language} style={atomDark}>
                                {project.code.trim()}
                            </SyntaxHighlighter>
                        </div>
                        <div className='video'>
                            <iframe
                                width="50%"
                                height="450vw"
                                src={project.video}
                                title={project.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Projects;
