// =============================================
// VEILLE-TICKER.JS — Flux cybersécurité (remplace cors.js)
// - IDs alignés avec index.html : ticker-content / ticker-pause / ticker-refresh
// - Aucun innerHTML : titres et liens construits avec le DOM (protection XSS)
// - Liens validés (http/https uniquement)
// - Pas de faux articles : si les flux échouent, on l'indique honnêtement
// =============================================
(function () {
    'use strict';

    const track = document.getElementById('ticker-content');
    if (!track) return;
    const pauseBtn = document.getElementById('ticker-pause');
    const refreshBtn = document.getElementById('ticker-refresh');

    // À REMPLACER par les URL exactes de TES flux Feedly (OWASP, PortSwigger Research, CERT-FR…).
    // The Daily Swig (PortSwigger) a fermé : ne plus l'utiliser.
    const FEEDS = [
        { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
        { name: 'OWASP', url: 'https://owasp.org/blog/feed.xml' },
        { name: 'Schneier', url: 'https://www.schneier.com/feed/atom' }
    ];
    // Sites affichés si aucun flux ne répond
    const SOURCE_SITES = [
        { name: 'CERT-FR', url: 'https://www.cert.ssi.gouv.fr/' },
        { name: 'OWASP', url: 'https://owasp.org/' },
        { name: 'PortSwigger', url: 'https://portswigger.net/web-security' }
    ];
    const API = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const MAX_PER_FEED = 10;
    const REFRESH_MS = 15 * 60 * 1000;

    // Mots entiers (évite que « api » matche « capital »)
    const KEYWORDS = ['web', 'api', 'sql', 'xss', 'csrf', 'injection', 'php', 'javascript',
        'react', 'node', 'vulnerability', 'owasp', 'cve', 'authentication', 'oauth', 'jwt', 'token'];
    const RELEVANT = new RegExp('\\b(' + KEYWORDS.join('|') + ')\\b', 'i');

    let loading = false;

    function safeUrl(value) {
        try {
            const u = new URL(value);
            return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
        } catch (e) { return null; }
    }

    async function fetchFeed(feed) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        try {
            const res = await fetch(API + encodeURIComponent(feed.url), { signal: ctrl.signal });
            if (!res.ok) return [];
            const data = await res.json();
            if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
            return data.items.slice(0, MAX_PER_FEED).map(it => ({
                title: String(it.title || '').trim(),
                link: safeUrl(it.link),
                date: it.pubDate ? new Date(it.pubDate.replace(' ', 'T') + 'Z') : null,
                source: feed.name
            })).filter(a => a.title.length > 15 && a.link);
        } catch (e) {
            console.warn('Flux indisponible :', feed.name);
            return [];
        } finally {
            clearTimeout(timer);
        }
    }

    function buildItem(a) {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        const dot = document.createElement('span');
        dot.className = 'ticker-dot';
        dot.setAttribute('aria-hidden', 'true');
        const src = document.createElement('span');
        src.className = 'ticker-source';
        src.textContent = a.source;
        const link = document.createElement('a');
        link.href = a.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = a.title;
        item.append(dot, src, link);
        if (a.date && !isNaN(a.date)) {
            const d = document.createElement('span');
            d.className = 'ticker-date';
            d.textContent = a.date.toLocaleDateString('fr-FR');
            item.append(d);
        }
        return item;
    }

    function showMessage(text, withSources) {
        track.replaceChildren();
        track.style.animation = 'none';
        const box = document.createElement('div');
        box.className = 'ticker-empty';
        box.textContent = text;
        if (withSources) {
            box.append(' ');
            SOURCE_SITES.forEach((s, i) => {
                const a = document.createElement('a');
                a.href = s.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = s.name;
                box.append(a, i < SOURCE_SITES.length - 1 ? ' · ' : '');
            });
        }
        track.append(box);
    }

    async function load() {
        if (loading) return;
        loading = true;
        showMessage('Chargement des actualités…', false);
        const results = (await Promise.all(FEEDS.map(fetchFeed))).flat();
        let articles = results.filter(a => RELEVANT.test(a.title));
        if (articles.length < 5) articles = results;
        articles.sort((x, y) => (y.date || 0) - (x.date || 0));

        if (!articles.length) {
            showMessage('Flux indisponibles pour le moment. Mes sources :', true);
        } else {
            track.style.animation = '';
            track.replaceChildren();
            const items = articles.map(buildItem);
            track.append(...items);
            // 2e copie pour la boucle sans coupure (le CSS anime jusqu'à -50 %)
            items.forEach(el => {
                const copy = el.cloneNode(true);
                copy.setAttribute('aria-hidden', 'true');
                copy.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'));
                track.append(copy);
            });
        }
        loading = false;
    }

    if (pauseBtn) {
        pauseBtn.setAttribute('aria-label', 'Mettre en pause le défilement');
        pauseBtn.setAttribute('aria-pressed', 'false');
        pauseBtn.addEventListener('click', () => {
            const paused = track.classList.toggle('paused');
            pauseBtn.textContent = paused ? '▶' : '⏸';
            pauseBtn.setAttribute('aria-pressed', String(paused));
            pauseBtn.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre en pause le défilement');
        });
    }
    if (refreshBtn) {
        refreshBtn.setAttribute('aria-label', 'Rafraîchir les actualités');
        refreshBtn.addEventListener('click', load);
    }

    setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
    load();
})();