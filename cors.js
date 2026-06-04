// =============================================
// CORS.JS — Flux RSS Cybersécurité
// Corrigé : IDs alignés avec index.html
// =============================================

const RSS_FEEDS = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://www.darkreading.com/rss.xml',
    'https://threatpost.com/feed/',
];

let isPaused = false;
let scrollOffset = 0;
let animFrame = null;
let allItems = [];

// =============================================
// FETCH RSS
// =============================================
async function fetchRSSFeeds() {
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';

        const feedPromises = RSS_FEEDS.map(async (feedUrl) => {
            try {
                const response = await fetch(proxyUrl + encodeURIComponent(feedUrl));
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');
                const items = xml.querySelectorAll('item');
                const articles = [];

                items.forEach((item, index) => {
                    if (index < 5) {
                        const title = item.querySelector('title')?.textContent?.trim() || '';
                        const link = item.querySelector('link')?.textContent?.trim() || '#';
                        const pubDate = item.querySelector('pubDate')?.textContent || '';
                        if (title) articles.push({ title, link, date: formatDate(pubDate) });
                    }
                });
                return articles;
            } catch {
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        allItems = results.flat();

        if (allItems.length === 0) throw new Error('No items');
        renderTicker(allItems);

    } catch {
        renderTicker(getFallbackNews());
    }
}

// =============================================
// FALLBACK
// =============================================
function getFallbackNews() {
    return [
        { title: 'Violation de données massive : des millions d\'utilisateurs affectés', link: '#', date: "Aujourd'hui" },
        { title: 'Nouveau zero-day découvert dans un logiciel populaire', link: '#', date: 'Il y a 2h' },
        { title: 'Ransomware cible le secteur hospitalier en Europe', link: '#', date: 'Il y a 5h' },
        { title: 'Mise à jour critique de sécurité pour Windows', link: '#', date: 'Hier' },
        { title: 'Campagne de phishing exploite les contenus générés par IA', link: '#', date: 'Hier' },
        { title: 'Bonnes pratiques de sécurité des bases de données 2026', link: '#', date: 'Il y a 2j' },
        { title: 'L\'injection SQL reste parmi les vulnérabilités web les plus critiques', link: '#', date: 'Il y a 3j' },
        { title: 'Nouveau framework de cybersécurité publié par l\'ANSSI', link: '#', date: 'Il y a 1 sem' },
        { title: 'Les menaces cloud en forte hausse au premier trimestre 2026', link: '#', date: 'Il y a 1 sem' },
        { title: 'Détection des menaces par IA : résultats prometteurs', link: '#', date: 'Il y a 2 sem' },
    ];
}

// =============================================
// RENDER — défilement vertical dans #rssViewport
// =============================================
function renderTicker(items) {
    const viewport = document.getElementById('rssViewport');
    if (!viewport) return;

    // Construire la liste d'items (doublée pour boucle infinie)
    const doubled = [...items, ...items];
    const html = doubled.map(item => `
        <div class="rss-item">
            <span class="rss-bullet">🔒</span>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="rss-link">
                ${item.title}
            </a>
            ${item.date ? `<span class="rss-date"> · ${item.date}</span>` : ''}
        </div>
    `).join('');

    viewport.innerHTML = `<div class="rss-track">${html}</div>`;

    injectTickerStyles();
    startScroll();
}

// =============================================
// SCROLL ANIMATION (JS — plus fiable que CSS)
// =============================================
function startScroll() {
    const track = document.querySelector('.rss-track');
    if (!track) return;

    cancelAnimationFrame(animFrame);
    scrollOffset = 0;

    const itemHeight = 50; // px par item (voir CSS)
    const totalItems = allItems.length || getFallbackNews().length;
    const halfHeight = totalItems * itemHeight;

    function step() {
        if (!isPaused) {
            scrollOffset += 0.6; // vitesse (px/frame)
            if (scrollOffset >= halfHeight) scrollOffset = 0;
            track.style.transform = `translateY(-${scrollOffset}px)`;
        }
        animFrame = requestAnimationFrame(step);
    }

    animFrame = requestAnimationFrame(step);
}

// =============================================
// STYLES INJECTÉS (n'écrase pas style.css)
// =============================================
function injectTickerStyles() {
    if (document.getElementById('rss-injected-styles')) return;

    const s = document.createElement('style');
    s.id = 'rss-injected-styles';
    s.textContent = `
        #rssViewport {
            height: 50px;
            overflow: hidden;
            position: relative;
        }
        .rss-track {
            display: flex;
            flex-direction: column;
            will-change: transform;
        }
        .rss-item {
            height: 50px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0 0.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .rss-bullet { flex-shrink: 0; font-size: 1.4rem; }
        .rss-link {
            color: var(--light, #f1f5f9);
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 500;
            transition: color 0.2s;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .rss-link:hover { color: #a5b4fc; text-decoration: underline; }
        .rss-date {
            color: var(--gray, #64748b);
            font-size: 1.3rem;
            flex-shrink: 0;
        }
    `;
    document.head.appendChild(s);
}

// =============================================
// FORMAT DATE
// =============================================
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const diffMs = Date.now() - date;
        const mins  = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days  = Math.floor(diffMs / 86400000);

        if (mins  < 60) return `Il y a ${mins} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        if (days  <  7) return `Il y a ${days}j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch { return ''; }
}

// =============================================
// BOUTONS PAUSE / REFRESH
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    fetchRSSFeeds();

    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? '▶' : '⏸';
            pauseBtn.title = isPaused ? 'Reprendre' : 'Pause';
        });
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.style.transition = 'transform 0.6s ease';
            refreshBtn.style.transform = 'rotate(360deg)';
            await fetchRSSFeeds();
            setTimeout(() => { refreshBtn.style.transform = 'rotate(0deg)'; }, 650);
        });
    }
});

// Auto-refresh toutes les 5 minutes
setInterval(() => { if (!isPaused) fetchRSSFeeds(); }, 300000);

console.log('%c📡 RSS Flux cybersécurité initialisé', 'color: #6366f1; font-weight: bold;');