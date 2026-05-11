/* =============================================
   script.js — Portfolio JavaScript
   ============================================= */

// ── 1. SMOOTH SCROLLING NAVIGATION ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile menu on link click
        document.getElementById('mobileMenu').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');
    });
});


// ── 2. HAMBURGER MENU TOGGLE ─────────────────────────────────────────────────
document.querySelector('.hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
});


// ── 3. SCROLL INDICATOR BAR ──────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollIndicator').style.width = scrollPercent + '%';
});


// ── 4. FADE-IN ON SCROLL (Intersection Observer) ─────────────────────────────
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// ── 5. NAVBAR SCROLL EFFECT ──────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background      = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter  = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.05)';
    }
});


// ── 6. THREE.JS ROBOT ANIMATION ──────────────────────────────────────────────
function initThreeJS() {
    const canvas   = document.getElementById('hero-canvas');
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

const textureLoader = new THREE.TextureLoader();

const githubTexture = textureLoader.load('github.png');
const linkedinTexture = textureLoader.load('linkedin.png');

// Materials for each side of body
const bodyMaterials = [
    new THREE.MeshPhongMaterial({ map: githubTexture }), // Right
    new THREE.MeshPhongMaterial({ map: linkedinTexture }), // Left
    new THREE.MeshPhongMaterial({ color: 0x00d4ff }), // Top
    new THREE.MeshPhongMaterial({ color: 0x00d4ff }), // Bottom
    new THREE.MeshPhongMaterial({ color: 0x00d4ff }), // Front
    new THREE.MeshPhongMaterial({ color: 0x00d4ff })  // Back
];

// Robot body
const bodyGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.8);

const body = new THREE.Mesh(bodyGeometry, bodyMaterials);

scene.add(body);


    // Robot head
    const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
    const head         = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y    = 1.2;
    scene.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial  = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const leftEye      = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1.35, 0.65);
    const rightEye     = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1.35, 0.65);
    scene.add(leftEye);
    scene.add(rightEye);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
    const armMaterial  = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
    const leftArm      = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1, 0.3, 0);
    leftArm.rotation.z = 0.3;
    const rightArm     = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1, 0.3, 0);
    rightArm.rotation.z = -0.3;
    scene.add(leftArm);
    scene.add(rightArm);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const pointLight   = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount    = 200;
    const posArray          = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0x00d4ff });
    const particlesMesh     = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 4;
    body.position.x = 0;
    head.position.x = 0;

    leftArm.position.x = -1;
    rightArm.position.x = 1;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth  / 2) * 0.0005;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
    });

        // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.4, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });

    // Left Leg
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.35, -1.4, 0);
    leftLeg.rotation.z = 0.1;

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.35, -1.4, 0);
    rightLeg.rotation.z = -0.1;

    scene.add(leftLeg);
    scene.add(rightLeg);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        body.rotation.y   += 0.01 + mouseX;
        head.rotation.y   += 0.015 + mouseX * 0.5;
        leftArm.rotation.z  =  0.3 + Math.sin(Date.now() * 0.005) * 0.2;
        rightArm.rotation.z = -0.3 - Math.sin(Date.now() * 0.005) * 0.2;
        leftLeg.rotation.z  =  0.1 + Math.sin(Date.now() * 0.005) * 0.1;
        rightLeg.rotation.z = -0.1 - Math.sin(Date.now() * 0.005) * 0.1;

        const time         = Date.now() * 0.005;
        body.position.y    = Math.sin(time) * 0.1;
        head.position.y    = 1.2 + Math.sin(time * 1.2) * 0.05;

        particlesMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    }
    animate();

    // Responsive resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}


// ── 7. CONTACT FORM SUBMISSION ───────────────────────────────────────────────
// The contact form now submits directly to FormSubmit.co, which will forward submissions to your Gmail.


// ── 8. TYPING ANIMATION ──────────────────────────────────────────────────────
const roleText     = "Data Analyst";
let charIndex      = 0;
const typingElement = document.querySelector('.typing-animation h2');

function typeWriter() {
    if (charIndex < roleText.length) {
        typingElement.textContent = roleText.slice(0, charIndex + 1) + '|';
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        typingElement.textContent = roleText;
    }
}


// ── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    initThreeJS();
    setTimeout(typeWriter, 1000);
});
