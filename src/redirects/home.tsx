import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import '../css/welcome.css';
import sunTexture from './textures/sun.jpg';
import planetTexture from './textures/planet.jpg';
import planetTexture2 from './textures/planet2.jpg';
import planetTexture3 from './textures/planet3.jpg';

function Home() {

    const [showArrow, setShowArrow] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showPlanet1Popup, setShowPlanet1Popup] = useState(false);
    const [showPlanet2Popup, setShowPlanet2Popup] = useState(false);
    const [showPlanet3Popup, setShowPlanet3Popup] = useState(false);

    function checkIntersections(raycaster, mouse, camera, planets) {
        raycaster.setFromCamera(mouse, camera);
    
        const intersects = raycaster.intersectObjects(planets, true);
    
        if (intersects.length > 0) {
            planets.forEach(planet => {
                planet.userData.isHovered = intersects.some(intersect => intersect.object === planet);
            });
            return true
        } else {
            planets.forEach(planet => (planet.userData.isHovered = false));
            return false;
        }
        
    }

    // function centerMouse(event) {
    //     const viewportWidth = window.innerWidth;
    //     const viewportHeight = window.innerHeight;

    //     // Calculate the center coordinates of the viewport
    //     const viewportCenterX = viewportWidth / 2;
    //     const viewportCenterY = viewportHeight / 2;

    //     // Calculate the offset needed to center the mouse cursor
    //     const offsetX = viewportCenterX - event.clientX;
    //     const offsetY = viewportCenterY - event.clientY;

    //     // Adjust the mouse event coordinates by applying the offset
    //     const centeredX = event.clientX + offsetX;
    //     const centeredY = event.clientY + offsetY;

    //     // Create a new MouseEvent with adjusted coordinates
    //     const centeredMouseEvent = new MouseEvent(event.type, {
    //         clientX: centeredX,
    //         clientY: centeredY,
    //         // Include other properties from the original event as needed
    //     });

    //     // Dispatch the adjusted MouseEvent
    //     document.dispatchEvent(centeredMouseEvent);
    // }
    

    useEffect(() => {
        // Three.js scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0e0f16');
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGL1Renderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        const textureLoader = new THREE.TextureLoader();

        // Sun setup
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const suntext = textureLoader.load(sunTexture); // Fix variable name
        const sunMaterial = new THREE.MeshBasicMaterial({ map: suntext });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Planets setup

        const planettext = textureLoader.load(planetTexture);
        const planettext2 = textureLoader.load(planetTexture2);
        const planettext3 = textureLoader.load(planetTexture3);

        const amPlanetGeometry = new THREE.SphereGeometry(1.6, 32, 32);
        const cmPlanetGeometry = new THREE.SphereGeometry(2, 32, 32);
        const projPlanetGeometry = new THREE.SphereGeometry(2.4, 32, 32);

        const amPlanetMaterial = new THREE.MeshBasicMaterial({ map: planettext });
        const cmPlanetMaterial = new THREE.MeshBasicMaterial({ map: planettext2 });
        const projPlanetMaterial = new THREE.MeshBasicMaterial({ map: planettext3 });

        const orbitRadii = [6, 15, 25]; // Define an array of orbit radii for each planet

        const amOrbitRadius = orbitRadii[0];
        const cmOrbitRadius = orbitRadii[1];
        const projOrbitRadius = orbitRadii[2];

        // Add AM planet
        const amPlanet = new THREE.Mesh(amPlanetGeometry, amPlanetMaterial);
        const amAngle = (1 / 3) * Math.PI * 2;
        const amOrbitX = Math.cos(amAngle) * amOrbitRadius;
        const amOrbitZ = Math.sin(amAngle) * amOrbitRadius;
        amPlanet.position.set(amOrbitX, 0, amOrbitZ);
        amPlanet.userData = { isHovered: false };
        scene.add(amPlanet);

        // Add CM planet
        const cmPlanet = new THREE.Mesh(cmPlanetGeometry, cmPlanetMaterial);
        const cmAngle = (2 / 3) * Math.PI * 2;
        const cmOrbitX = Math.cos(cmAngle) * cmOrbitRadius;
        const cmOrbitZ = Math.sin(cmAngle) * cmOrbitRadius;
        cmPlanet.position.set(cmOrbitX, 0, cmOrbitZ);
        cmPlanet.userData = { isHovered: false };
        scene.add(cmPlanet);

        // Add Project Planet
        const projPlanet = new THREE.Mesh(projPlanetGeometry, projPlanetMaterial);
        const projAngle = (3 / 3) * Math.PI * 2;
        const projOrbitX = Math.cos(projAngle) * projOrbitRadius;
        const projOrbitZ = Math.sin(projAngle) * projOrbitRadius;
        projPlanet.position.set(projOrbitX, 0, projOrbitZ);
        projPlanet.userData = { isHovered: false };
        scene.add(projPlanet);

        // Set camera position to be above the scene
        camera.position.set(0, 50, 0);
        camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the scene

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const newCameraY = Math.max(15, 50 - scrollPosition * 0.2); // Adjust the scroll effect as needed
            const newCameraZ = Math.min(200, scrollPosition * 0.1); // Adjust the scroll effect as needed
            camera.position.set(0, newCameraY, newCameraZ);
            camera.lookAt(new THREE.Vector3(0, 0, 0)); // Keep looking at the center of the scene
            renderer.render(scene, camera); // Render scene with updated camera position

            setShowArrow(true);

            // Show the popup when scrolling to the bottom
            if (scrollPosition === (document.documentElement.scrollHeight - document.documentElement.clientHeight)) {
                setShowPopup(true);
            } else {
                setShowPopup(false);
            }
        };
        

        window.addEventListener('scroll', handleScroll);

        const planets = [amPlanet, cmPlanet, projPlanet];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handlePlanetMouseOver = () => {
            setShowPopup(true);
        };
        
        const handlePlanetMouseOut = () => {
            setShowPopup(false);
        };        

        amPlanet.addEventListener('mouseover', handlePlanetMouseOver);
        amPlanet.addEventListener('mouseout', handlePlanetMouseOut);
        cmPlanet.addEventListener('mouseover', handlePlanetMouseOver);
        cmPlanet.addEventListener('mouseout', handlePlanetMouseOut);
        projPlanet.addEventListener('mouseover', handlePlanetMouseOver);
        projPlanet.addEventListener('mouseout', handlePlanetMouseOut);

        
        window.addEventListener('mousemove', onMouseMove, false);

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        
            // Check if the mouse intersects with any planet
            const intersects = raycaster.intersectObjects(planets);
        
            // Track the currently hovered planet
            let hoveredPlanet: THREE.Mesh | null = null;
        
            if (intersects.length > 0) {
                hoveredPlanet = intersects[0].object as THREE.Mesh;
            }
        
            // Update camera position based on the hovered planet
            if (hoveredPlanet) {
                // Position the camera at the hovered planet
                const { x, y, z } = hoveredPlanet.position;
                camera.position.set(x, y, z + 4); // Adjust the offset to position the camera slightly away from the planet
                camera.lookAt(hoveredPlanet.position);
        
                // Show popup for the hovered planet
                setShowPlanet1Popup(hoveredPlanet === amPlanet);
                setShowPlanet2Popup(hoveredPlanet === cmPlanet);
                setShowPlanet3Popup(hoveredPlanet === projPlanet);
            } else {
                // Reset camera position if not hovering over any planet
                const scrollPosition = window.scrollY;
                const newCameraY = Math.max(15, 50 - scrollPosition * 0.2); // Adjust the scroll effect as needed
                const newCameraZ = Math.min(200, scrollPosition * 0.1); // Adjust the scroll effect as needed
                camera.position.set(0, newCameraY, newCameraZ);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
        
                // Hide all popups
                setShowPlanet1Popup(false);
                setShowPlanet2Popup(false);
                setShowPlanet3Popup(false);
            }
        }
        
        
        
        
        

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
        
            sun.rotation.y += 0.0001;
            sun.rotation.x += 0.0001;
        
            checkIntersections(raycaster, mouse, camera, planets);
        
            // Animate AM planet
            const amAngle = Date.now() * 0.0005; // Adjust the speed of rotation
            const amOrbitX = Math.cos(amAngle) * amOrbitRadius;
            const amOrbitZ = Math.sin(amAngle) * amOrbitRadius;
        
            // Animate CM planet
            const cmAngle = Date.now() * 0.0005 * 0.5; // Adjust the speed of rotation
            const cmOrbitX = Math.cos(cmAngle) * cmOrbitRadius;
            const cmOrbitZ = Math.sin(cmAngle) * cmOrbitRadius;
        
            // Animate Project planet
            const projAngle = Date.now() * 0.0005 * 0.25; // Adjust the speed of rotation
            const projOrbitX = Math.cos(projAngle) * projOrbitRadius;
            const projOrbitZ = Math.sin(projAngle) * projOrbitRadius;
        
            // Rotate planets and position camera unless one is hovered
            planets.forEach(planet => {
                if (!planet.userData.isHovered) {
                    planet.rotation.x += 0.008;
                    planet.rotation.y += 0.008;
                    if (planet === amPlanet) {
                        amPlanet.position.set(amOrbitX, 0, amOrbitZ);
                    } else if (planet === cmPlanet) {
                        cmPlanet.position.set(cmOrbitX, 0, cmOrbitZ);
                    } else {
                        projPlanet.position.set(projOrbitX, 0, projOrbitZ);
                    }

                    if (planet === amPlanet) {
                        setShowPlanet1Popup(false);
                    } else if (planet === cmPlanet) {
                        setShowPlanet2Popup(false);
                    } else {
                        setShowPlanet3Popup(false);
                    }
                } else {
                    // Position the camera at the hovered planet
                    const { x, y, z } = planet.position;
                    camera.position.set(x, y, z + 4); // Adjust the offset to position the camera slightly away from the planet
                    camera.lookAt(planet.position);
                    
                    if (planet === amPlanet) {
                        setShowPlanet1Popup(true);
                    } else if (planet === cmPlanet) {
                        setShowPlanet2Popup(true);
                    } else {
                        setShowPlanet3Popup(true);
                    }
                }
            });
        
            renderer.render(scene, camera);
        }
        animate();        

        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            // Clean up Three.js resources
            renderer.domElement.remove();
            renderer.dispose();
            scene.remove(sun);
            sunGeometry.dispose();
            sunMaterial.dispose();
        
            // Dispose geometry and materials of each planet
            amPlanetGeometry.dispose();
            amPlanetMaterial.dispose();
            cmPlanetGeometry.dispose();
            cmPlanetMaterial.dispose();
            projPlanetGeometry.dispose();
            projPlanetMaterial.dispose();

            amPlanet.removeEventListener('mouseover', handlePlanetMouseOver);
            amPlanet.removeEventListener('mouseout', handlePlanetMouseOut);
            cmPlanet.removeEventListener('mouseover', handlePlanetMouseOver);
            cmPlanet.removeEventListener('mouseout', handlePlanetMouseOut);
            projPlanet.removeEventListener('mouseover', handlePlanetMouseOver);
            projPlanet.removeEventListener('mouseout', handlePlanetMouseOut);
            window.removeEventListener('scroll', handleScroll);

        };
    }, []);

    return (
        <div>
            <div className='heading'>
                <h1>Welcome</h1>
            </div>
            {showArrow && (
                <div className='down-arrow'></div>
                
            )}
            {showPopup && (
                <div className='popup'>
                    Hover over a planet!
                </div>
            )}
            {showPlanet1Popup && (
                <div className='planet-popup'>
                    <h1>Teleport to Contact Me</h1>
                    <a href="/contact-me">
                        <div className='planet-btn planet-btn-animate'>GO</div>
                    </a>
                </div>
            )}
            {showPlanet2Popup && (
                <div className='planet-popup'>
                    <h1>Teleport to About Me </h1>
                    <a href="/about-me">
                        <div className='planet-btn planet-btn-animate'>GO</div>
                    </a>
                </div>
            )}
            {showPlanet3Popup && (
                <div className='planet-popup'>
                    <h1>Teleport to Projects </h1>
                    <a href="/projects">
                        <div className='planet-btn planet-btn-animate'>GO</div>
                    </a>
                </div>
            )}

            
        </div>
    );
}

export default Home;
