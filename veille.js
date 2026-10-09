/* veille.js — fiches de veille */
(() => {
    'use strict';

    /* ===== 1. FICHES DE VEILLE =====
       Ajoute ici chaque article réellement lu : date, source, lien, résumé.
       Les trois premières sont des sources de référence du sujet. */
    const FICHES = [
        {
            titre: 'Web Authentication (WebAuthn) Level 2',
            source: 'W3C', type: 'Standard officiel', date: '',
            resume: "Définit l'API du navigateur pour créer et utiliser des clés publiques liées à un site.",
            retenu: "Le serveur ne stocke qu'une clé publique, et la clé n'est valable que pour son domaine d'origine.",
            url: 'https://www.w3.org/TR/webauthn-2/'
        },
        {
            titre: 'Authentication Cheat Sheet',
            source: 'OWASP', type: 'Bonnes pratiques', date: '',
            resume: "Recommandations de l'OWASP pour concevoir une authentification robuste.",
            retenu: "Liste les bonnes pratiques à vérifier dans mon propre code d'authentification.",
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'
        },
        {
            titre: 'Passkeys : présentation',
            source: 'FIDO Alliance', type: 'Organisme du standard', date: '',
            resume: "Explique ce que sont les passkeys et comment elles se synchronisent entre appareils.",
            retenu: "Une passkey peut se synchroniser entre appareils, ce qui évite de perdre son accès.",
            url: 'https://fidoalliance.org/passkeys/'
        }
    ];

    function renderFiches() {
        const box = document.getElementById('veille-fiches');
        if (!box) return;
        FICHES.forEach(f => {
            const card = document.createElement('article');
            card.className = 'vl-fiche';
            const h = document.createElement('h4'); h.textContent = f.titre;
            const meta = document.createElement('div'); meta.className = 'vl-fiche-meta';
            [f.source, f.type, f.date].filter(Boolean).forEach(t => {
                const s = document.createElement('span'); s.textContent = t; meta.appendChild(s);
            });
            const r = document.createElement('p'); r.textContent = f.resume;
            const k = document.createElement('p');
            const b = document.createElement('b'); b.textContent = 'Ce que j\'en retiens : ';
            k.append(b, f.retenu);
            card.append(h, meta, r, k);
            const href = safeUrl(f.url);
            if (href) {
                const a = document.createElement('a');
                a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
                a.textContent = 'Lire la source';
                card.appendChild(a);
            }
            box.appendChild(card);
        });
    }

    function safeUrl(u) {
        try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null; }
        catch { return null; }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderFiches);
    else renderFiches();
})();