/* ========================================
   PREMIUM 3D PORTFOLIO - SCRIPT.JS
   ENHANCED VERSION
   ======================================== */

// ========================================
// TYPED.JS - TEXT ANIMATION
// ========================================
const typed = new Typed('.text', {
    strings: ['Web Developer', 'BTS SIO Student', 'Frontend Developer', 'UI/UX Enthusiast'],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 2000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// THEME TOGGLE (DARK/LIGHT MODE) - IMPROVED
// ========================================
const themeToggle = document.getElementById('theme-toggle');
let isLightMode = false;

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
    isLightMode = true;
}

themeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    
    if (isLightMode) {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="bx bx-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// ========================================
// COLOR PICKER WIDGET - IN HEADER
// ========================================
function createColorPicker() {
    const colorPickerHTML = `
        <div class="color-picker-widget">
            <button class="color-picker-toggle">🎨</button>
            <div class="color-picker-panel">
                <div class="color-picker-title">Choose Your Color</div>
                <div class="color-options">
                    <div class="color-option color-cyan active" data-primary="#0ef" data-secondary="#6764b7" data-accent="#ff2d75"></div>
                    <div class="color-option color-purple" data-primary="#9c27b0" data-secondary="#764ba2" data-accent="#667eea"></div>
                    <div class="color-option color-pink" data-primary="#ff2d75" data-secondary="#f093fb" data-accent="#f5576c"></div>
                    <div class="color-option color-green" data-primary="#00e676" data-secondary="#00c853" data-accent="#b2ff59"></div>
                    <div class="color-option color-orange" data-primary="#ffab00" data-secondary="#ff6f00" data-accent="#ffd54f"></div>
                    <div class="color-option color-red" data-primary="#f44336" data-secondary="#d32f2f" data-accent="#ff5252"></div>
                    <div class="color-option color-blue" data-primary="#42a5f5" data-secondary="#1e88e5" data-accent="#82b1ff"></div>
                    <div class="color-option color-gold" data-primary="#ffd700" data-secondary="#ffb300" data-accent="#ffed4e"></div>
                    <div class="color-option color-mint" data-primary="#69f0ae" data-secondary="#00e676" data-accent="#b9f6ca"></div>
                </div>
            </div>
        </div>
    `;
    
    // Insert into header container
    const container = document.getElementById('color-picker-container');
    if (container) {
        container.innerHTML = colorPickerHTML;
    } else {
        // Fallback: insert at end of body if container not found
        document.body.insertAdjacentHTML('beforeend', colorPickerHTML);
    }
    
    const toggle = document.querySelector('.color-picker-toggle');
    const panel = document.querySelector('.color-picker-panel');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Toggle panel
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.color-picker-widget')) {
            panel.classList.remove('active');
        }
    });
    
    // Load saved color
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
        applyColor(savedColor, localStorage.getItem('secondaryColor'), localStorage.getItem('accentColor'));
    }
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const primary = this.dataset.primary;
            const secondary = this.dataset.secondary;
            const accent = this.dataset.accent;
            
            applyColor(primary, secondary, accent);
            
            // Save to localStorage
            localStorage.setItem('primaryColor', primary);
            localStorage.setItem('secondaryColor', secondary);
            localStorage.setItem('accentColor', accent);
        });
    });
}

function applyColor(primary, secondary, accent) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--gradient-glow', 
        `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`);
}

createColorPicker();

// ========================================
// FLOATING LABELS AROUND PHOTO
// ========================================
function createFloatingLabels() {
    const labels = ['Code', 'Web', 'App', 'UI', 'SQL', 'Dev'];
    
    const homeImg = document.querySelector('.home-img');
    if (homeImg) {
        labels.forEach((label, index) => {
            const labelElement = document.createElement('div');
            labelElement.classList.add('floating-label');
            labelElement.textContent = label;
            labelElement.style.animationDelay = `${index * 0.5}s`;
            homeImg.appendChild(labelElement);
        });
    }
}

createFloatingLabels();

// ========================================
// FLOATING PARTICLES BACKGROUND
// ========================================
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('floating-particles');
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(14, 240, 255, 0.8), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

createParticles();

// ========================================
// 3D TILT EFFECT ON CARDS
// ========================================
function add3DTiltEffect(selector) {
    const cards = document.querySelectorAll(selector);
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Apply 3D tilt to service boxes, project cards
add3DTiltEffect('.service-box');
add3DTiltEffect('.project-card');
add3DTiltEffect('.about-text');

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-box, .project-card, .skill-bar-item, .circle-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    reveals.forEach(reveal => {
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(50px)';
        reveal.style.transition = 'all 0.8s ease';
        observer.observe(reveal);
    });
}

revealOnScroll();

// ========================================
// SKILL BARS ANIMATION ON SCROLL
// ========================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '1';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, {
        threshold: 0.20
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

animateSkillBars();

// ========================================
// CIRCULAR SKILL ANIMATION
// ========================================
function animateCircularSkills() {
    const circles = document.querySelectorAll('.progress-ring');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = circle.style.getPropertyValue('--progress');
                circle.style.setProperty('--progress', 0);
                
                setTimeout(() => {
                    circle.style.setProperty('--progress', progress);
                    circle.style.transition = 'all 2s ease';
                }, 100);
            }
        });
    }, {
        threshold: 0.20
    });
    
    circles.forEach(circle => {
        observer.observe(circle);
    });
}

animateCircularSkills();

// ========================================
// CURSOR TRAIL EFFECT
// ========================================
function createCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    
    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, rgba(14, 240, 255, 0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        circles.push(circle);
        document.body.appendChild(circle);
    }
    
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
    
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;
        
        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
            
            const nextCircle = circles[index + 1] || circles[0];
            x += (parseInt(nextCircle.style.left) - x) * 0.3;
            y += (parseInt(nextCircle.style.top) - y) * 0.3;
        });
        
        requestAnimationFrame(animateCircles);
    }
    
    animateCircles();
}

createCursorTrail();

// ========================================
// PARALLAX EFFECT ON SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.home-img, .home-content');
    
    parallaxElements.forEach(element => {
        const speed = element.classList.contains('home-img') ? 0.5 : 0.3;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
function magneticButtons() {
    const buttons = document.querySelectorAll('.btn-box, .btn-cv, .btn-contact');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

magneticButtons();

// ========================================
// IMAGE HOVER 3D EFFECT
// ========================================
const homeImg = document.querySelector('.home-img img');

if (homeImg) {
    homeImg.addEventListener('mousemove', (e) => {
        const rect = homeImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 10;
        const rotateX = (centerY - y) / 10;
        
        homeImg.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    homeImg.addEventListener('mouseleave', () => {
        homeImg.style.transform = 'scale(1) rotateX(0) rotateY(0)';
    });
}

// ========================================
// PROJECT CARD FLIP EFFECT
// ========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-20px) rotateX(5deg) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});

// ========================================
// ACTIVE SECTION HIGHLIGHT IN NAV
// ========================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Add active class style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .navbar a.active {
        color: var(--primary);
    }
    .navbar a.active::before {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

// ========================================
// FORM VALIDATION
// ========================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        if (!name || !email || !message) {
            e.preventDefault();
            alert('Please fill in all fields');
            return false;
        }
        
        if (!email.includes('@')) {
            e.preventDefault();
            alert('Please enter a valid email address');
            return false;
        }
    });
}

// ========================================
// SERVICE BOX READ MORE FUNCTIONALITY
// ========================================
const serviceButtons = document.querySelectorAll('.service-btn .btn');

serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceBox = btn.closest('.service-box');
        const serviceTitle = serviceBox.querySelector('h3').textContent;
        
        alert(`More information about ${serviceTitle} coming soon!`);
    });
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="bx bx-up-arrow-alt"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--gradient-glow);
    border: none;
    border-radius: 50%;
    color: var(--light);
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
    z-index: 9999;
    box-shadow: 0 10px 30px rgba(14, 240, 255, 0.3);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.2) translateY(-5px)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1) translateY(0)';
});

// ========================================
// PAGE LOAD ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🚀 Premium 3D Portfolio loaded successfully!');
console.log('🎨 Color picker activated!');
console.log('🎂 Year counter added!');