import * as THREE from 'three';

// Initialize the parametric visualization
class ParametricVisualization {
    constructor() {
        this.container = document.getElementById('parametric-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0f1121, 1);
        this.container.appendChild(this.renderer.domElement);
        
        this.points = [];
        this.geometry = null;
        this.particles = null;
        
        this.init();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    init() {
        // Create 3D parametric grid
        const particleCount = 5000;
        const particleGeometry = new THREE.BufferGeometry();
        const particlesData = [];
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            // Position particles in a parametric form
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            
            // Distribute particles in a spherical shape
            const r = 15 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            
            // Set color gradient (blue to purple to pink)
            const ratio = i / particleCount;
            if (ratio < 0.33) {
                color.setStyle('#3a86ff'); // Blue
            } else if (ratio < 0.66) {
                color.setStyle('#8338ec'); // Purple
            } else {
                color.setStyle('#ff006e'); // Pink
            }
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Store data for animation
            particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                startPosition: new THREE.Vector3(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2]
                )
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        
        this.points = positions;
        this.particlesData = particlesData;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update particle positions for animation
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particlesData.length; i++) {
            const particleData = this.particlesData[i];
            const idx = i * 3;
            
            // Calculate wave motion
            const time = Date.now() * 0.001;
            const offset = Math.sin(time + i * 0.1) * 0.2;
            
            // Update position with wave effect
            positions[idx] = particleData.startPosition.x + offset;
            positions[idx + 1] = particleData.startPosition.y + offset * 0.5;
            positions[idx + 2] = particleData.startPosition.z + offset * 0.3;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire particle system
        this.particles.rotation.y += 0.002;
        this.particles.rotation.x += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize the visualization when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start the parametric visualization
    const visualization = new ParametricVisualization();
    
    // Set up scroll behavior for CTA button
    const ctaButton = document.getElementById('cta-button');
    ctaButton.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add scroll animations
    const sections = document.querySelectorAll('section:not(#hero)');
    
    // Simple scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would normally handle the form submission with AJAX
            alert('Thank you for your message! This is a demo, so no message was actually sent.');
            contactForm.reset();
        });
    }
});