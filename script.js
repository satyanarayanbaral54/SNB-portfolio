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

if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

updateThemeButton();
updateNavbarBackground();

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeButton();
    updateNavbarBackground();
    updateHeroParticlesColor();
});

window.addEventListener('scroll', updateNavbarBackground);


// ── 6. THREE.JS ROBOT ANIMATION ──────────────────────────────────────────────
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

    robotGroup.add(leftLeg);
    robotGroup.add(rightLeg);

    fitHeroScene();

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
        fitHeroScene();
    });
}


// ── 7. CONTACT FORM SUBMISSION ───────────────────────────────────────────────
// The contact form now submits directly to FormSubmit.co, which will forward submissions to your Gmail.


// ── 8. TYPING ANIMATION ──────────────────────────────────────────────────────
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


// ── INIT ─────────────────────────────────────────────────────────────────────
// 9. MOBILE SOCIAL HALF-WHEEL
function initSocialWheel() {
    const wheel = document.querySelector('.social-wheel');

    if (!wheel) {
        return;
    }

    const items = Array.from(wheel.querySelectorAll('.social-wheel__item'));
    const spinButton = wheel.querySelector('.social-wheel__spin');
    const baseAngles = [-78, -47, -16, 16, 47, 78];
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let rotation = 0;
    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let startRotation = 0;
    let spinFrame = null;
    let selectedIndex = Math.floor(items.length / 2);

    function getRadius() {
        return Math.max(112, Math.min(158, wheel.offsetWidth * 0.41));
    }

    function normalizeAngle(angle) {
        return ((angle % 360) + 360) % 360;
    }

    function angleDistance(a, b) {
        const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
        return Math.min(diff, 360 - diff);
    }

    function updateSelectedItem() {
        let bestIndex = 0;
        let bestDistance = Infinity;

        items.forEach((item, index) => {
            item.classList.remove('is-selected');
            const distance = angleDistance(baseAngles[index] + rotation, 0);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = index;
            }
        });

        selectedIndex = bestIndex;
        items[selectedIndex].classList.add('is-selected');
    }

    function renderWheel() {
        if (!mobileQuery.matches) {
            items.forEach((item) => {
                item.style.transform = '';
                item.classList.remove('is-selected', 'is-spinning');
            });
            wheel.classList.remove('is-spinning');
            return;
        }

        const radius = getRadius();

        items.forEach((item, index) => {
            const angle = baseAngles[index] + rotation;
            item.style.transform = `translate(-50%, 50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`;
        });

        updateSelectedItem();
    }

    function stopSpin() {
        if (spinFrame) {
            cancelAnimationFrame(spinFrame);
            spinFrame = null;
        }

        items.forEach((item) => item.classList.remove('is-spinning'));
        wheel.classList.remove('is-spinning');
    }

    function spinWheel() {
        if (!mobileQuery.matches) {
            return;
        }

        stopSpin();
        const targetIndex = Math.floor(Math.random() * items.length);
        const fullTurns = 3 + Math.floor(Math.random() * 2);
        const desiredRotation = -baseAngles[targetIndex];
        const alignmentDelta = normalizeAngle(desiredRotation - rotation);
        const targetRotation = rotation + (fullTurns * 360) + alignmentDelta;
        const startRotationValue = rotation;
        const startTime = performance.now();
        const duration = 1550;

        wheel.classList.add('is-spinning');
        items.forEach((item) => item.classList.add('is-spinning'));

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            rotation = startRotationValue + (targetRotation - startRotationValue) * eased;
            renderWheel();

            if (progress < 1) {
                spinFrame = requestAnimationFrame(animate);
            } else {
                rotation = targetRotation % 360;
                stopSpin();
                renderWheel();
            }
        }

        spinFrame = requestAnimationFrame(animate);
    }

    function handlePointerDown(event) {
        if (!mobileQuery.matches || event.target === spinButton) {
            return;
        }

        stopSpin();
        isDragging = true;
        didDrag = false;
        startX = event.clientX;
        startRotation = rotation;
        wheel.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
        if (!isDragging) {
            return;
        }

        const deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 6) {
            didDrag = true;
        }

        rotation = startRotation + deltaX * 0.42;
        renderWheel();
    }

    function handlePointerUp(event) {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        wheel.releasePointerCapture(event.pointerId);

        if (didDrag) {
            setTimeout(() => {
                didDrag = false;
            }, 0);
        }
    }

    items.forEach((item) => {
        item.addEventListener('click', (event) => {
            if (didDrag || wheel.classList.contains('is-spinning')) {
                event.preventDefault();
            }
        });
    });

    wheel.addEventListener('pointerdown', handlePointerDown);
    wheel.addEventListener('pointermove', handlePointerMove);
    wheel.addEventListener('pointerup', handlePointerUp);
    wheel.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('resize', renderWheel);

    if (spinButton) {
        spinButton.addEventListener('click', spinWheel);
    }

    renderWheel();
}

window.addEventListener('load', () => {
    initThreeJS();
    initSocialWheel();
    setTimeout(typeWriter, 1000);
});
