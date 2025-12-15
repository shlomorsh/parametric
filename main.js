import * as THREE from 'three';

// Parametric Background Animation
class ParametricBackground {
    constructor() {
        this.container = document.getElementById('parametric-canvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x050510, 0.002);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 50;
        this.camera.position.y = 10;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();

        this.initParticles();
        this.addEventListeners();
        this.animate();
    }

    initParticles() {
        const particleCount = 2000; // Optimized count
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Create a wavy grid structure
        let i = 0;
        const range = 100;
        
        for(let x = 0; x < 50; x++) {
            for(let z = 0; z < 40; z++) {
                // Normalized coordinates
                const u = x / 50;
                const v = z / 40;
                
                // Position
                const px = (u - 0.5) * range;
                const pz = (v - 0.5) * range;
                const py = Math.sin(u * Math.PI * 4) * 5 + Math.cos(v * Math.PI * 4) * 5;

                positions[i * 3] = px;
                positions[i * 3 + 1] = py;
                positions[i * 3 + 2] = pz;
                
                sizes[i] = Math.random() * 2;
                i++;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom Shader Material for glowing particles
        // Simplified to PointsMaterial for stability with basic CDN
        this.material = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 0.4,
            transparent: true,
            opacity: 0.8,
            vertexColors: false,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, this.material);
        this.scene.add(this.particles);
        
        // Save initial positions for animation reference
        this.originalPositions = positions.slice();
    }

    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        
        // Smooth mouse movement
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Animate Camera slightly
        this.camera.position.x += (this.mouse.x * 10 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 5 + 10 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        // Animate Particles
        const positions = this.particles.geometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i += 3) {
            // Wave movement based on original positions
            const ox = this.originalPositions[i];
            const oy = this.originalPositions[i+1];
            const oz = this.originalPositions[i+2];

            // Complex wave function
            const waveY = Math.sin(ox * 0.1 + time) * 2 + 
                          Math.cos(oz * 0.1 + time * 0.5) * 2;

            positions[i+1] = oy + waveY;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Global rotation
        this.particles.rotation.y = time * 0.05;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
new ParametricBackground();

// Scroll Animations (Simple version)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .work-item, .team-member, .contact-wrapper').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});