import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar.tsx'

import Home from './redirects/home.tsx'
import AboutMe from './redirects/about-me.tsx'
import ContactMe from './redirects/contact-me.tsx'
import Projects from './redirects/projects.tsx'

function App() {
  return (
    <Router>
        <div>
            <Navbar/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/projects" element={<Projects/>}/>
                <Route exact path="/about-me" element={<AboutMe/>}/>
                <Route exact path="/contact-me" element={<ContactMe/>}/>
            </Routes>
        </div>
    </Router>
    
  );
}

export default App;
