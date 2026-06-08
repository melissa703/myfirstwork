// =============================================
// CORS.JS — Flux RSS Cybersécurité
// Corrigé : IDs alignés avec index.html
// =============================================
// ===================== FLUX RSS — Cybersécurité & Développement Web =====================
(function () {
    // Sources RSS spécialisées cybersécurité web/dev
    // Toutes passées via rss2json (API publique, pas de problème CORS)
    const RSS_FEEDS = [
        {
            name: "PortSwigger",
            url: "https://api.rss2json.com/v1/api.json?rss_url=https://portswigger.net/daily-swig/rss"
        },
        {
            name: "The Hacker News",
            url: "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews"
        },
        {
            name: "Schneier on Security",
            url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.schneier.com/feed/atom"
        },
        {
            name: "OWASP Blog",
            url: "https://api.rss2json.com/v1/api.json?rss_url=https://owasp.org/blog/feed.xml"
        }
    ];

    // Mots-clés liés au dev web pour filtrer les articles les plus pertinents
    const KEYWORDS = [
        "web", "application", "api", "sql", "xss", "injection", "php",
        "javascript", "react", "node", "vulnerability", "owasp", "cve",
        "authentication", "oauth", "jwt", "csrf", "faille", "sécurité"
    ];

    let articles = [];
    let currentIndex = 0;
    let scrollInterval = null;
    let isPaused = false;

    const viewport = document.getElementById('rssViewport');
    const refreshBtn = document.getElementById('refreshBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    if (!viewport) return;

    // Filtre les articles par mots-clés pour garder uniquement les pertinents
    function isRelevant(item) {
        const text = (item.title + ' ' + (item.description || '')).toLowerCase();
        return KEYWORDS.some(kw => text.includes(kw));
    }

    async function fetchFeed(feed) {
        try {
            const res = await fetch(feed.url);
            const data = await res.json();
            if (data.status === 'ok' && data.items) {
                return data.items.slice(0, 10).map(item => ({
                    title: item.title,
                    link: item.link,
                    date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('fr-FR') : '',
                    source: feed.name
                }));
            }
        } catch (e) {
            console.warn('Flux RSS non disponible :', feed.name);
        }
        return [];
    }

    async function loadAllFeeds() {
        viewport.innerHTML = '<span style="opacity:0.5">Chargement des flux...</span>';
        const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
        // Mélange les articles de toutes les sources
        articles = results.flat().filter(isRelevant);

        // Si pas assez d'articles filtrés, on prend tout
        if (articles.length < 5) {
            articles = results.flat();
        }

        if (articles.length === 0) {
            viewport.innerHTML = '<span style="opacity:0.5">Aucun article disponible pour le moment.</span>';
            return;
        }

        currentIndex = 0;
        renderArticle();
        startScroll();
    }

    function renderArticle() {
        if (articles.length === 0) return;
        const a = articles[currentIndex % articles.length];
        viewport.innerHTML = `
            <span class="rss-source-badge">${a.source}</span>
            <a href="${a.link}" target="_blank" rel="noopener" class="rss-article-link">
                🔐 ${a.title}
            </a>
            ${a.date ? `<span class="rss-date">${a.date}</span>` : ''}
        `;
    }

    function startScroll() {
        clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            if (!isPaused) {
                currentIndex = (currentIndex + 1) % articles.length;
                renderArticle();
            }
        }, 5000); // change d'article toutes les 5 secondes
    }

    // Bouton refresh
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            clearInterval(scrollInterval);
            loadAllFeeds();
        });
    }

    // Bouton pause/play
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? '▶' : '⏸';
            pauseBtn.title = isPaused ? 'Reprendre' : 'Pause';
        });
    }

    // Lancement initial
    loadAllFeeds();
})();

// Auto-refresh toutes les 5 minutes
setInterval(() => { if (!isPaused) fetchRSSFeeds(); }, 300000);

console.log('%c📡 RSS Flux cybersécurité initialisé', 'color: #6366f1; font-weight: bold;');