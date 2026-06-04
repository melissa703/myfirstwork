/* ========================================
   SCRIPT.JS — VERSION CORRIGÉE
   Corrections : color picker, parallax,
   hamburger menu, scroll progress, active nav
   ======================================== */

// ========================================
// TYPED.JS
// ========================================
// Typed — s'adapte au nouveau hero (.hero-typed) ou à l'ancien (.text)
if (document.querySelector('.hero-typed')) {
    new Typed('.hero-typed', {
        strings: ['Web Developer', 'BTS SIO SLAM', 'Frontend Developer', 'UI/UX Enthusiast'],
        typeSpeed: 80, backSpeed: 60, backDelay: 2000,
        loop: true, showCursor: true, cursorChar: '|'
    });
} else if (document.querySelector('.text')) {
    new Typed('.text', {
        strings: ['Web Developer', 'BTS SIO Student', 'Frontend Developer', 'UI/UX Enthusiast'],
        typeSpeed: 80, backSpeed: 60, backDelay: 2000,
        loop: true, showCursor: true, cursorChar: '|'
    });
}

// ========================================
// SCROLL PROGRESS BAR
// ========================================
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ========================================
// HAMBURGER MENU MOBILE
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('mobile-open');
        menuToggle.classList.toggle('open', isOpen);
    });

    // Fermer le menu au clic sur un lien
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('mobile-open');
            menuToggle.classList.remove('open');
        });
    });
}

// ========================================
// SMOOTH SCROLL
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
// THEME TOGGLE (dark / light)
// ========================================
const themeToggle = document.getElementById('theme-toggle');
let isLightMode = localStorage.getItem('theme') === 'light';

function applyTheme() {
    if (isLightMode) {
        document.body.classList.add('light-theme');
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="bx bx-sun"></i>';
    }
}

applyTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isLightMode = !isLightMode;
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        applyTheme();
    });
}

// ========================================
// COLOR PICKER — CORRIGÉ
// Le widget est injecté dans le body
// et stylisé via color-picker-addon.css
// ========================================
function createColorPicker() {
    // Supprimer l'ancien widget s'il existe
    const existing = document.querySelector('.color-picker-widget');
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.className = 'color-picker-widget';
    widget.innerHTML = `
        <button class="color-picker-toggle" title="Choisir la couleur">🎨</button>
        <div class="color-picker-panel">
            <div class="color-picker-title">Palette de couleurs</div>
            <div class="color-options">
                <div class="color-option color-indigo active"  data-primary="#6366f1" data-secondary="#8b5cf6" data-gradient="135deg, #667eea 0%, #764ba2 100%"></div>
                <div class="color-option color-cyan"           data-primary="#06b6d4" data-secondary="#0891b2" data-gradient="135deg, #06b6d4 0%, #0284c7 100%"></div>
                <div class="color-option color-pink"           data-primary="#ec4899" data-secondary="#db2777" data-gradient="135deg, #f093fb 0%, #f5576c 100%"></div>
                <div class="color-option color-green"          data-primary="#22c55e" data-secondary="#16a34a" data-gradient="135deg, #22c55e 0%, #16a34a 100%"></div>
                <div class="color-option color-orange"         data-primary="#f97316" data-secondary="#ea580c" data-gradient="135deg, #f97316 0%, #dc2626 100%"></div>
                <div class="color-option color-red"            data-primary="#ef4444" data-secondary="#dc2626" data-gradient="135deg, #f44336 0%, #d32f2f 100%"></div>
                <div class="color-option color-blue"           data-primary="#3b82f6" data-secondary="#2563eb" data-gradient="135deg, #3b82f6 0%, #1d4ed8 100%"></div>
                <div class="color-option color-gold"           data-primary="#eab308" data-secondary="#ca8a04" data-gradient="135deg, #ffd700 0%, #f59e0b 100%"></div>
                <div class="color-option color-mint"           data-primary="#10b981" data-secondary="#059669" data-gradient="135deg, #69f0ae 0%, #00e676 100%"></div>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const toggle = widget.querySelector('.color-picker-toggle');
    const panel  = widget.querySelector('.color-picker-panel');
    const options = widget.querySelectorAll('.color-option');

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.color-picker-widget')) {
            panel.classList.remove('active');
        }
    });

    // Restaurer la couleur sauvegardée
    const saved = localStorage.getItem('portfolioGradient');
    if (saved) applyGradient(JSON.parse(saved));

    options.forEach(opt => {
        opt.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('active'));
            this.classList.add('active');

            const config = {
                primary: this.dataset.primary,
                secondary: this.dataset.secondary,
                gradient: this.dataset.gradient,
            };
            applyGradient(config);
            localStorage.setItem('portfolioGradient', JSON.stringify(config));
        });
    });
}

function applyGradient(config) {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--secondary', config.secondary);
    root.style.setProperty('--gradient', `linear-gradient(${config.gradient})`);
    root.style.setProperty('--gradient-2', `linear-gradient(${config.gradient})`);
}

createColorPicker();

// ========================================
// SCROLL REVEAL
// ========================================
function revealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-box, .project-card, .skill-bar-item, .circle-item, .timeline-card, .certif-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });
}

// ========================================
// SKILL BARS ANIMATION
// ========================================
function animateSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = targetWidth; }, 50);
                });
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-fill').forEach(bar => observer.observe(bar));
}

// ========================================
// ACTIVE NAV ON SCROLL
// ========================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    let current = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ========================================
// 3D TILT SUR LES CARDS
// ========================================
function add3DTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========================================
// MAGNETIC BUTTONS
// ========================================
function magneticButtons() {
    document.querySelectorAll('.btn-box, .btn-cv, .btn-contact').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
            const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ========================================
// SCROLL TO TOP
// ========================================
function createScrollTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="bx bx-up-arrow-alt"></i>';
    btn.id = 'scroll-top-btn';
    btn.title = 'Haut de page';
    btn.style.cssText = `
        position:fixed; bottom:3rem; left:3rem;
        width:5rem; height:5rem;
        background:var(--gradient);
        border:none; border-radius:50%;
        color:white; font-size:2.4rem;
        cursor:pointer; opacity:0; visibility:hidden;
        transition:all 0.4s ease; z-index:9999;
        box-shadow:0 8px 25px rgba(99,102,241,0.4);
        display:flex; align-items:center; justify-content:center;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        const show = window.scrollY > 500;
        btn.style.opacity      = show ? '1' : '0';
        btn.style.visibility   = show ? 'visible' : 'hidden';
    });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.15) translateY(-4px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
}

// ========================================
// FILTRES PROJETS
// ========================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            cards.forEach(card => {
                const tags = card.dataset.tags || '';
                const visible = filter === 'all' || tags.includes(filter);
                card.classList.toggle('hidden', !visible);
            });
        });
    });
}

// ========================================
// FORM VALIDATION
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const name    = contactForm.querySelector('input[name="name"]')?.value;
        const email   = contactForm.querySelector('input[name="email"]')?.value;
        const message = contactForm.querySelector('textarea[name="message"]')?.value;

        if (!name || !email || !message) {
            e.preventDefault();
            alert('Veuillez remplir tous les champs.');
            return;
        }
        if (!email.includes('@')) {
            e.preventDefault();
            alert('Veuillez entrer une adresse email valide.');
        }
    });
}

// ========================================
// INIT ON DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    animateSkillBars();
    add3DTilt('.service-box');
    add3DTilt('.project-card');
    magneticButtons();
    createScrollTop();
    initProjectFilters();
});

// Légère animation d'entrée de page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

console.log('✅ Portfolio chargé — Melissa Bestani');
// ========================================
// CURSEUR PERSONNALISÉ
// ========================================
(function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const trail  = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    let trailX = 0, trailY = 0;
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.13;
        trailY += (mouseY - trailY) * 0.13;
        trail.style.left = trailX + 'px';
        trail.style.top  = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const hoverTargets = 'a, button, .btn-box, .btn-outline, .project-card, .ts-card, .certif-card, .wid-item, .stat-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

// ========================================
// COMPTEUR STATS ANIMÉ
// ========================================
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el      = entry.target;
            const target  = parseInt(el.dataset.target, 10);
            const suffix  = el.dataset.suffix || '';
            const duration = 1400;
            const start   = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease     = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target) + suffix;
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(update);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();

// ========================================
// WHAT I DO — ANIMATION ENTRÉE
// ========================================
(function initWidAnimation() {
    const items = document.querySelectorAll('.wid-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 120);
            }
        });
    }, { threshold: 0.2 });

    items.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Tech stack cards
    const tsCards = document.querySelectorAll('.ts-card');
    const tsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, i * 60);
            }
        });
    }, { threshold: 0.1 });

    tsCards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.95)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        tsObserver.observe(el);
    });
})();

