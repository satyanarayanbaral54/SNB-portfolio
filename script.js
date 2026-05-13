/* =============================================
   script.js - Portfolio JavaScript
   ============================================= */

// 1. Smooth scrolling navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.getElementById('mobileMenu')?.classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('active');
    });
});


// 2. Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
});


// 3. Scroll indicator and navbar effect
const scrollIndicator = document.getElementById('scrollIndicator');
let scrollFramePending = false;


// 4. Fade-in on scroll
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


// 5. THEME TOGGLE AND NAVBAR SCROLL EFFECT
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
let heroParticlesMaterial = null;

function updateThemeButton() {
    const isLightMode = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
}

function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const isLightMode = document.body.classList.contains('light-mode');

    if (window.scrollY > 100) {
        navbar.style.background = isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = isLightMode ? 'rgba(255, 255, 255, 0.82)' : 'rgba(255, 255, 255, 0.05)';
    }
}

function updateHeroParticlesColor() {
    if (!heroParticlesMaterial) {
        return;
    }

    const isLightMode = document.body.classList.contains('light-mode');
    heroParticlesMaterial.color.set(isLightMode ? 0x111827 : 0x00d4ff);
}

function updateScrollEffects() {
    const scrollTop = window.scrollY;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

    if (scrollIndicator) {
        scrollIndicator.style.width = `${scrollPercent}%`;
    }

    updateNavbarBackground();
    scrollFramePending = false;
}

function requestScrollUpdate() {
    if (scrollFramePending) {
        return;
    }

    scrollFramePending = true;
    requestAnimationFrame(updateScrollEffects);
}

if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

updateThemeButton();
updateScrollEffects();

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeButton();
    updateNavbarBackground();
    updateHeroParticlesColor();
});

window.addEventListener('scroll', requestScrollUpdate, { passive: true });


// 6. Three.js robot animation
function initThreeJS() {
    const canvas   = document.getElementById('hero-canvas');
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const robotGroup = new THREE.Group();

    scene.add(robotGroup);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    function fitHeroScene() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        const isMobile = window.innerWidth <= 768;

        camera.aspect = width / height;
        camera.position.z = isMobile ? 4.4 : 4;
        camera.updateProjectionMatrix();

        robotGroup.scale.setScalar(isMobile ? 1.05 : 1);
        robotGroup.position.set(0, isMobile ? 0.12 : 0, 0);
        renderer.setSize(width, height, false);
    }

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

robotGroup.add(body);


    // Robot head
    const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
    const head         = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y    = 1.2;
    robotGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial  = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const leftEye      = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1.35, 0.65);
    const rightEye     = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1.35, 0.65);
    robotGroup.add(leftEye);
    robotGroup.add(rightEye);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
    const armMaterial  = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
    const leftArm      = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1, 0.3, 0);
    leftArm.rotation.z = 0.3;
    const rightArm     = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1, 0.3, 0);
    rightArm.rotation.z = -0.3;
    robotGroup.add(leftArm);
    robotGroup.add(rightArm);

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
    heroParticlesMaterial = particlesMaterial;
    updateHeroParticlesColor();
    const particlesMesh     = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 4;
    body.position.x = 0;
    head.position.x = 0;

    leftArm.position.x = -1;
    rightArm.position.x = 1;

    // Mouse interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX - window.innerWidth / 2) * 0.00045;
        targetMouseY = (event.clientY - window.innerHeight / 2) * 0.00035;
    }, { passive: true });

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

    robotGroup.add(leftLeg);
    robotGroup.add(rightLeg);

    fitHeroScene();

    // Animation loop
    function animate(now = 0) {
        requestAnimationFrame(animate);

        smoothMouseX += (targetMouseX - smoothMouseX) * 0.08;
        smoothMouseY += (targetMouseY - smoothMouseY) * 0.08;

        const time = now * 0.005;
        robotGroup.rotation.y = smoothMouseX;
        robotGroup.rotation.x = smoothMouseY * 0.25;
        body.rotation.y   += 0.008;
        head.rotation.y    = smoothMouseX * 0.7;
        leftArm.rotation.z  =  0.3 + Math.sin(time) * 0.2;
        rightArm.rotation.z = -0.3 - Math.sin(time) * 0.2;
        leftLeg.rotation.z  =  0.1 + Math.sin(time) * 0.1;
        rightLeg.rotation.z = -0.1 - Math.sin(time) * 0.1;

        body.position.y    = Math.sin(time) * 0.1;
        head.position.y    = 1.2 + Math.sin(time * 1.2) * 0.05;

        particlesMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    }
    animate();

    // Responsive resize
    let resizeFramePending = false;
    window.addEventListener('resize', () => {
        if (resizeFramePending) {
            return;
        }

        resizeFramePending = true;
        requestAnimationFrame(() => {
            fitHeroScene();
            resizeFramePending = false;
        });
    }, { passive: true });
}


// 7. Contact form submission
// The contact form now submits directly to FormSubmit.co, which will forward submissions to your Gmail.


// 8. Typing animation
const roleText     = "Data Analyst";
let charIndex      = 0;
const typingElement = document.querySelector('.typing-animation h2');

function typeWriter() {
    if (!typingElement) {
        return;
    }

    if (charIndex < roleText.length) {
        typingElement.textContent = roleText.slice(0, charIndex + 1) + '|';
        charIndex++;
        setTimeout(typeWriter, 100);
    } else {
        typingElement.textContent = roleText;
    }
}


// Init
// 9. DESKTOP FOOTER DOCK
function initDesktopSocialDock() {
    const dock = document.querySelector('.social-dock');

    if (!dock) {
        return;
    }

    const items = Array.from(dock.querySelectorAll('.social-dock__item'));
    const canUseDock = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    let activeItem = null;
    let pendingMouseEvent = null;
    let dockFramePending = false;

    function resetDock() {
        activeItem = null;
        items.forEach((item) => {
            item.classList.remove('is-dock-hot');
            item.style.setProperty('--dock-scale', '1');
            item.style.setProperty('--dock-y', '0px');
        });
    }

    function applyDockUpdate(event) {
        if (!canUseDock.matches) {
            resetDock();
            return;
        }

        const mouseX = event.clientX;
        let nearestItem = null;
        let nearestDistance = Infinity;

        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - centerX);
            const influence = Math.max(0, 1 - distance / 150);
            const scale = 1 + influence * 0.34;
            const lift = influence * 32;

            item.style.setProperty('--dock-scale', scale.toFixed(3));
            item.style.setProperty('--dock-y', `${(lift * -1).toFixed(1)}px`);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestItem = item;
            }
        });

        if (nearestItem && activeItem !== nearestItem) {
            items.forEach((item) => item.classList.remove('is-dock-hot'));
            nearestItem.classList.add('is-dock-hot');
            activeItem = nearestItem;
        }
    }

    function updateDock(event) {
        pendingMouseEvent = event;

        if (dockFramePending) {
            return;
        }

        dockFramePending = true;
        requestAnimationFrame(() => {
            applyDockUpdate(pendingMouseEvent);
            dockFramePending = false;
        });
    }

    dock.addEventListener('mousemove', updateDock, { passive: true });
    dock.addEventListener('mouseleave', resetDock);
    dock.addEventListener('blur', resetDock, true);

    window.addEventListener('resize', () => {
        if (!canUseDock.matches) {
            resetDock();
        }
    });
}

window.addEventListener('load', () => {
    if (window.THREE) {
        initThreeJS();
    }

    initDesktopSocialDock();
    setTimeout(typeWriter, 1000);
});
