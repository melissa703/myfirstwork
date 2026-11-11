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
    // Service de secours : renvoie le flux brut (XML), lu ensuite par le navigateur
    const PROXY = 'https://api.allorigins.win/raw?url=';
    // Sources de référence (vraies pages) : défilent si AUCUN flux en direct ne répond
    const REFERENCE = [
        { source: 'W3C',           title: 'Web Authentication (WebAuthn) Level 2',   link: 'https://www.w3.org/TR/webauthn-2/' },
        { source: 'OWASP',         title: 'Authentication Cheat Sheet',              link: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
        { source: 'OWASP',         title: 'API Security Top 10',                     link: 'https://owasp.org/API-Security/' },
        { source: 'PortSwigger',   title: 'Laboratoires OAuth et JWT',               link: 'https://portswigger.net/web-security' },
        { source: 'CERT-FR',       title: 'Alertes et avis de sécurité',             link: 'https://www.cert.ssi.gouv.fr/' },
        { source: 'FIDO Alliance', title: 'Passkeys : présentation',                 link: 'https://fidoalliance.org/passkeys/' }
    ];
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

    async function fetchWithTimeout(url) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        try { return await fetch(url, { signal: ctrl.signal }); }
        finally { clearTimeout(timer); }
    }

    function clean(items, feed) {
        return items.filter(a => a.title.length > 15 && a.link).slice(0, MAX_PER_FEED)
            .map(a => Object.assign(a, { source: feed.name }));
    }

    // Moyen 1 : rss2json (renvoie du JSON)
    async function viaRss2json(feed) {
        const res = await fetchWithTimeout(API + encodeURIComponent(feed.url));
        if (!res.ok) return [];
        const data = await res.json();
        if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
        return clean(data.items.map(it => ({
            title: String(it.title || '').trim(),
            link: safeUrl(it.link),
            date: it.pubDate ? new Date(it.pubDate.replace(' ', 'T') + 'Z') : null
        })), feed);
    }

    // Moyen 2 (secours) : flux XML brut lu avec DOMParser (RSS et Atom)
    async function viaProxy(feed) {
        const res = await fetchWithTimeout(PROXY + encodeURIComponent(feed.url));
        if (!res.ok) return [];
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        if (doc.querySelector('parsererror')) return [];
        const text = (el, tag) => { const n = el.getElementsByTagName(tag)[0]; return n ? n.textContent.trim() : ''; };
        const items = Array.from(doc.querySelectorAll('item, entry')).map(el => {
            let link = text(el, 'link');
            if (!link) {                                   // Atom : <link href="...">
                const l = el.querySelector('link[rel="alternate"], link');
                link = l ? l.getAttribute('href') : '';
            }
            const d = text(el, 'pubDate') || text(el, 'published') || text(el, 'updated') || text(el, 'dc:date');
            const date = d ? new Date(d) : null;
            return { title: text(el, 'title'), link: safeUrl(link), date: date && !isNaN(date) ? date : null };
        });
        return clean(items, feed);
    }

    async function fetchFeed(feed) {
        for (const method of [viaRss2json, viaProxy]) {
            try {
                const out = await method(feed);
                if (out.length) return out;
            } catch (e) { /* on essaie le moyen suivant */ }
        }
        console.warn('Flux indisponible :', feed.name);
        return [];
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
            d.textContent = a.date.toLocaleDateString((window.I18N && window.I18N.lang() === 'en') ? 'en-GB' : 'fr-FR');
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

    // Affiche une liste qui défile en boucle (2e copie pour la boucle sans coupure : le CSS anime jusqu'à -50 %)
    function render(items) {
        track.style.animation = '';
        track.replaceChildren();
        track.append(...items);
        items.forEach(el => {
            const copy = el.cloneNode(true);
            copy.setAttribute('aria-hidden', 'true');
            copy.querySelectorAll('a').forEach(a => a.setAttribute('tabindex', '-1'));
            track.append(copy);
        });
    }

    // Aucun flux en direct : on fait défiler les sources de référence plutôt qu'un message figé
    function renderReference() {
        const lead = document.createElement('div');
        lead.className = 'ticker-item';
        const msg = document.createElement('span');
        msg.className = 'ticker-source';
        msg.textContent = 'Flux indisponibles pour le moment. Mes sources :';
        lead.append(msg);
        render([lead, ...REFERENCE.map(buildItem)]);
    }

    let lastArticles = null;

    async function load() {
        if (loading) return;
        loading = true;
        showMessage('Chargement des actualités…', false);
        const results = (await Promise.all(FEEDS.map(fetchFeed))).flat();
        let articles = results.filter(a => RELEVANT.test(a.title));
        if (articles.length < 5) articles = results;
        articles.sort((x, y) => (y.date || 0) - (x.date || 0));

        if (!articles.length) {
            lastArticles = null;
            renderReference();
        } else {
            lastArticles = articles;
            render(articles.map(buildItem));
        }
        loading = false;
    }

    // Les dates s'affichent selon la langue : on redessine quand elle change
    document.addEventListener('langchange', () => { if (lastArticles) render(lastArticles.map(buildItem)); });

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