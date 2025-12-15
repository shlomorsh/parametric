import * as THREE from 'three';

// ============================================
// ========== PRELOADER ==========
// ============================================
const preloader = document.getElementById('preloader');
const preloaderProgress = document.querySelector('.preloader-progress');

let loadProgress = 0;
const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15;
    if (loadProgress > 100) loadProgress = 100;
    preloaderProgress.style.width = loadProgress + '%';

    if (loadProgress === 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 300);
    }
}, 100);

// ============================================
// ========== SCROLL PROGRESS BAR ==========
// ============================================
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// ============================================
// ========== BACK TO TOP BUTTON ==========
// ============================================
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// ========== CUSTOM CURSOR ==========
// ============================================
const cursor = document.querySelector('.custom-cursor');
const magneticBtns = document.querySelectorAll('.magnetic-btn');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            duration: 0.3,
            x: x * 0.3,
            y: y * 0.3,
            ease: "power2.out"
        });

        cursor.classList.add('hover');
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: "elastic.out(1, 0.3)"
        });

        cursor.classList.remove('hover');
    });
});

// ============================================
// ========== LENIS SMOOTH SCROLL ==========
// ============================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ============================================
// ========== GSAP SCROLL ANIMATIONS ==========
// ============================================
gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.reveal-text');

revealElements.forEach(element => {
    gsap.fromTo(element,
        { y: 50, opacity: 0, scale: 0.95 },
        {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power4.out"
        }
    );
});

// ============================================
// ========== STATISTICS COUNTER ==========
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);

    ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out"
            });
        },
        once: true
    });
});

// ============================================
// ========== TESTIMONIALS CAROUSEL ==========
// ============================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonial-dots .dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i]?.classList.remove('active');
    });

    testimonialCards[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    let next = currentTestimonial + 1;
    if (next >= testimonialCards.length) next = 0;
    showTestimonial(next);
}

// Auto-rotate
testimonialInterval = setInterval(nextTestimonial, 5000);

// Dot clicks
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        showTestimonial(index);
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });
});

// ============================================
// ========== FAQ ACCORDION ==========
// ============================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question?.addEventListener('click', () => {
        // Close others
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('open');
            }
        });

        // Toggle current
        item.classList.toggle('open');
    });
});

// ============================================
// ========== THREE.JS FLOW FIELD ==========
// ============================================
class FlowField {
    constructor() {
        this.container = document.getElementById('parametric-canvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050510, 0.001);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 50;
        this.camera.position.y = 10;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();

        this.initParticles();
        this.animate();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    initParticles() {
        this.count = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        const colors = new Float32Array(this.count * 3);
        const sizes = new Float32Array(this.count);

        for (let i = 0; i < this.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color();
            color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, this.material);
        this.scene.add(this.particles);

        this.data = [];
        for (let i = 0; i < this.count; i++) {
            this.data.push({
                x: positions[i * 3],
                y: positions[i * 3 + 1],
                z: positions[i * 3 + 2],
                vx: 0,
                vy: 0,
                vz: 0,
                life: Math.random()
            })
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        const positions = this.particles.geometry.attributes.position.array;

        const targetX = this.mouse.x * 20;
        const targetY = this.mouse.y * 20;

        for (let i = 0; i < this.count; i++) {
            const d = this.data[i];

            // Slow, elegant flow
            const noise = Math.sin(d.x * 0.02 + time * 0.15) + Math.cos(d.z * 0.02 + time * 0.08);

            d.vx += (Math.cos(noise) * 0.03) + (targetX - d.x) * 0.00003;
            d.vy += (Math.sin(noise) * 0.03) + (targetY - d.y) * 0.00003;
            d.vz += Math.sin(time + d.x * 0.1) * 0.015;

            d.vx *= 0.96;
            d.vy *= 0.96;
            d.vz *= 0.96;

            d.x += d.vx;
            d.y += d.vy;
            d.z += d.vz;

            if (d.x > 75) d.x = -75;
            if (d.x < -75) d.x = 75;
            if (d.y > 30) d.y = -30;
            if (d.y < -30) d.y = 30;
            if (d.z > 50) d.z = -50;
            if (d.z < -50) d.z = 50;

            positions[i * 3] = d.x;
            positions[i * 3 + 1] = d.y;
            positions[i * 3 + 2] = d.z;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.rotation.y = time * 0.015;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
new FlowField();