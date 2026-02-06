// ============================================
// TYPED.JS ANIMATION
// ============================================
const typed = new Typed('.text', {
    strings: ['Developer', 'BTS SIO Student', 'Web Designer', 'Tech Enthusiast'],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 1500,
    loop: true,
    showCursor: true,
    cursorChar: '|'
});

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Charger le thÃ¨me sauvegardÃ©
const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.classList.replace('bx-sun', 'bx-moon');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeIcon.classList.replace('bx-sun', 'bx-moon');
        localStorage.setItem('portfolio-theme', 'light');
    } else {
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('portfolio-theme', 'dark');
    }
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-active');
        }
    });
}, observerOptions);

// Observer pour les services
document.querySelectorAll('.service-box').forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(40px)';
    box.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(box);
});

// Observer pour les projets
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.6s ease ${index * 0.15}s`;
    observer.observe(card);
});

// Style pour l'animation fade in
const style = document.createElement('style');
style.textContent = `
    .fade-in-active {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// SKILLS ANIMATION
// ============================================
const skillsSection = document.querySelector('.skills-section');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkills();
            skillsAnimated = true;
        }
    });
}, { threshold: 0.25 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

function animateSkills() {
    // Animer les barres de progression
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 150);
    });
    
    // Animer les cercles
    const circles = document.querySelectorAll('.progress-ring');
    circles.forEach((circle, index) => {
        const targetProgress = circle.style.getPropertyValue('--progress');
        circle.style.setProperty('--progress', '0');
        
        setTimeout(() => {
            animateCircularProgress(circle, targetProgress);
        }, index * 200);
    });
}

function animateCircularProgress(element, targetValue) {
    let current = 0;
    const increment = targetValue / 60; // 60 frames pour l'animation
    
    const animation = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(animation);
        }
        element.style.setProperty('--progress', current);
    }, 25);
}

// ============================================
// PARALLAX EFFECT
// ============================================
let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.home-content, .home-img');
    
    if (scrolled < 800) {
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// FORM VALIDATION
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            e.preventDefault();
            showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
            return false;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return false;
        }
        
        // Si tout est OK, on laisse le formulaire se soumettre
        showNotification('Message prÃªt Ã  Ãªtre envoyÃ© !', 'success');
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifs = document.querySelectorAll('.custom-notification');
    existingNotifs.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.textContent = message;
    
    const notifStyles = `
        position: fixed;
        top: 10rem;
        right: 3rem;
        padding: 1.5rem 2.5rem;
        background: ${type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        border-radius: 12px;
        font-size: 1.5rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.4s ease;
    `;
    
    notification.style.cssText = notifStyles;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Animations pour les notifications
const notifAnimations = document.createElement('style');
notifAnimations.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notifAnimations);

// ============================================
// CURSOR EFFECT (Desktop only)
// ============================================
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(102, 126, 234, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.15s ease;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Effet hover sur les Ã©lÃ©ments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .btn-box, .service-box, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'rgba(236, 72, 153, 0.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'rgba(102, 126, 234, 0.6)';
        });
    });
}

// ============================================
// FLOATING PARTICLES BACKGROUND
// ============================================
function createParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 2;
    
    particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        left: ${x}px;
        bottom: -10px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.6;
        animation: floatUp ${duration}s ease-in forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), duration * 1000);
}

// Ajouter l'animation CSS
const particleAnimation = document.createElement('style');
particleAnimation.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleAnimation);

// CrÃ©er une particule toutes les 4 secondes
setInterval(createParticle, 4000);

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(
    '%cðŸ‘‹ Bienvenue sur mon portfolio !',
    'color: #667eea; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cMelissa Bestani - BTS SIO SLAM',
    'color: #764ba2; font-size: 16px; font-weight: 600;'
);
console.log(
    '%cðŸ’¼ N\'hÃ©site pas Ã  me contacter !',
    'color: #ec4899; font-size: 14px;'
);

// ============================================
// PAGE LOAD COMPLETE
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    updateActiveLink(); // Initialiser le lien actif au chargement
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy loading pour les images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
// ============================================
// SCREENSHOT FULLSCREEN TOGGLE
// ============================================
function showScreenshot() {
    const modal = document.getElementById('screenshotModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('fullscreen');
            document.body.style.overflow = 'hidden';
        }, 10);
    }
}

function hideScreenshot() {
    const modal = document.getElementById('screenshotModal');
    if (modal) {
        modal.classList.remove('fullscreen');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
}

// Fermer avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideScreenshot();
    }
});
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && screenshotContainer.classList.contains('fullscreen')) {
            screenshotContainer.classList.remove('fullscreen');
            document.body.style.overflow = '';
        }
    });/* ===== RSS TICKER – Veille cybersécurité & FINANCEMENT / INVESTISSEMENTS 2026 ===== */
function updateRssFeed() {
    const content = document.getElementById('rssContent');
    const duplicate = document.querySelector('.rss-duplicate');
    
    if (!content || !duplicate) return;

    // Actualités réelles février 2026 sur investissements, funding, cyber insurance, stratégie France, etc.
    const news = [
        {
            text: "Seed-Stage Cybersecurity VCs Actually Investing (2026) – Liste des fonds actifs",
            link: "https://www.betaboom.com/magazine/article/seed-stage-cybersecurity-vcs-investing"
        },
        {
            text: "The NASDAQ Cybersecurity ETF Looks Like One of 2026's Best Investments",
            link: "https://cybersecurityventures.com/the-nasdaq-cybersecurity-etf-looks-like-one-of-2026s-best-investments"
        },
        {
            text: "Momentum Builds Toward More Security Startups, Strategic M&A in 2026",
            link: "https://www.secureworld.io/industry-news/cybersecurity-funding-momentum-2026"
        },
        {
            text: "Global Cybersecurity Outlook 2026 – World Economic Forum (rapport complet)",
            link: "https://www.weforum.org/publications/global-cybersecurity-outlook-2026"
        },
        {
            text: "Stratégie nationale de cybersécurité 2026-2030 – France (SGDSN officiel)",
            link: "https://www.sgdsn.gouv.fr/publications/strategie-nationale-de-cybersecurite-2026-2030"
        },
        {
            text: "Cyber Insurance Market Outlook 2026: Resilient Earnings, Tougher Competition",
            link: "https://www.spglobal.com/ratings/en/regulatory/article/cyber-insurance-market-outlook-2026-resilient-earnings-tougher-competition-pockets-of-growth-s101658506"
        },
        {
            text: "7 Predictions For Cyber Risk And Insurance In 2026",
            link: "https://www.wiley.law/article-7-Predictions-For-Cyber-Risk-And-Insurance-In-2026"
        },
        {
            text: "Cyber risk: A look ahead to 2026 – WTW (tendances cyber insurance)",
            link: "https://www.wtwco.com/en-us/insights/2026/02/cyber-risk-a-look-ahead-to-2026"
        }
    ];

    // Construction du HTML avec liens cliquables + séparateurs pour lisibilité
    let html = '   ';
    news.forEach(item => {
        html += `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.text}</a>        •       `;
    });
    html += '   ';

    content.innerHTML = html;
    duplicate.innerHTML = html;  // duplication pour défilement infini sans coupure
}

// Lancement + boutons (refresh + pause)
document.addEventListener('DOMContentLoaded', () => {
    updateRssFeed();

    document.getElementById('refreshBtn')?.addEventListener('click', updateRssFeed);

    const pauseBtn = document.getElementById('pauseBtn');
    const ticker = document.querySelector('.rss-ticker');

    if (pauseBtn && ticker) {
        pauseBtn.addEventListener('click', () => {
            ticker.classList.toggle('paused');
            pauseBtn.innerHTML = ticker.classList.contains('paused') ? '▶' : '⏸';
        });
    }
});