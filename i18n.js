/* ==========================================================
   i18n.js : version française / anglaise du portfolio
   - Le HTML reste en français (langue par défaut).
   - Le dictionnaire EN associe chaque texte français à sa traduction.
   - Le bouton FR / EN bascule sans recharger la page.
   - Un MutationObserver traduit aussi les textes créés par les autres
     scripts (fiches de veille, flux d'actualités, messages du formulaire...).
   - Lien direct en anglais : index.html?lang=en
   ========================================================== */
(function () {
    'use strict';

    var STORE_KEY = 'portfolio-lang';
    var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, IFRAME: 1 };

    /* ---------- Dictionnaire FR -> EN ---------- */
    var EN = {
    "Melissa Bestani | Développeuse Web · BTS SIO SLAM": "Melissa Bestani | Web Developer · BTS SIO SLAM",
    "Aller au contenu": "Skip to content",
    "Accueil": "Home",
    "À propos": "About",
    "Parcours": "Journey",
    "Projets": "Projects",
    "Certifs": "Certs",
    "Veille": "Tech Watch",
    "BTS SIO · Option SLAM · INSTA Paris": "BTS SIO · SLAM option · INSTA Paris",
    "Melissa Bestani, développeuse web BTS SIO SLAM": "Melissa Bestani, web developer, BTS SIO SLAM",
    "// Je suis": "// I am",
    "Quadrilingue · Bac Maths · Prépa · Développeuse full-stack PHP/React disponible en alternance sur Paris.": "Quadrilingual · Maths Baccalaureate · Preparatory classes · Full-stack PHP/React developer available for a work-study placement in Paris.",
    "Voir mes projets": "View my projects",
    "Télécharger CV": "Download CV",
    "de moi": "me",
    "Étudiante en 2e année de BTS SIO option SLAM à l'INSTA Paris. Titulaire d'un baccalauréat scientifique (Mathématiques) et de deux années de classes préparatoires en Algérie.": "Second-year BTS SIO student (SLAM option) at INSTA Paris. Holder of a scientific baccalaureate (Mathematics) and of two years of preparatory classes in Algeria.",
    "Passionnée par le développement full-stack, j'ai conçu": "Passionate about full-stack development, I built",
    ", une plateforme e-commerce de luxe complète avec architecture MVC, API REST, authentification OTP et génération de factures PDF.": ", a complete luxury e-commerce platform with MVC architecture, REST API, OTP authentication and PDF invoice generation.",
    "Me contacter": "Contact me",
    "Projets réalisés": "Projects completed",
    "Langues parlées": "Languages spoken",
    "Technologies maîtrisées": "Technologies mastered",
    "Moyenne générale": "Overall average",
    "Je conçois des expériences web complètes — du design à la base de données.": "I build complete web experiences — from design to database.",
    "Sites et applications full-stack avec PHP, JavaScript, React et MySQL. Architecture MVC, API REST, gestion des données robuste.": "Full-stack websites and applications with PHP, JavaScript, React and MySQL. MVC architecture, REST API, robust data management.",
    "Interfaces modernes, responsives et centrées sur l'utilisateur. Intégration pixel-perfect avec une attention aux détails et à l'accessibilité.": "Modern, responsive, user-centered interfaces. Pixel-perfect integration with attention to detail and accessibility.",
    "Mise en ligne, GitHub Pages, gestion de versions Git. Maintenance et optimisation des performances web.": "Going live, GitHub Pages, Git version control. Maintenance and web performance optimization.",
    "Mon": "My",
    "Sept. – Déc. 2026": "Sept. – Dec. 2026",
    "Stage · Développement front-end": "Internship · Front-end development",
    "Conception de l'interface d'une application de gestion de flotte et de livreurs (WeWeb) : design premium, intégration des écrans et bonnes pratiques de sécurité.": "Design of the interface for a fleet and delivery-driver management application (WeWeb): premium design, screen integration and security best practices.",
    "BTS SIO · Option SLAM": "BTS SIO · SLAM option",
    "Formation en développement d'applications web et logicielles. PHP, MySQL, JavaScript, React, architecture MVC.": "Training in web and software application development. PHP, MySQL, JavaScript, React, MVC architecture.",
    "Jan – Mars 2026": "Jan – Mar 2026",
    "Stage · Développement Web": "Internship · Web development",
    "Développement d'une boutique e-commerce complète. Intégration front-end, back-end PHP/MySQL, gestion des commandes.": "Development of a complete e-commerce shop. Front-end integration, PHP/MySQL back-end, order management.",
    "Projet Lumoura": "Lumoura Project",
    "Projet personnel full-stack": "Personal full-stack project",
    "Plateforme e-commerce de parfums de luxe : architecture MVC, API REST, authentification OTP, génération PDF, interface admin complète.": "Luxury perfume e-commerce platform: MVC architecture, REST API, OTP authentication, PDF generation, complete admin interface.",
    "Classes Préparatoires · Sciences": "Preparatory classes · Sciences",
    "Algérie": "Algeria",
    "Deux années de classes préparatoires en sciences de l'ingénieur. Baccalauréat Mathématiques mention.": "Two years of preparatory classes in engineering sciences. Mathematics baccalaureate with honors.",
    "Mes": "My",
    "Tous": "All",
    "Bloc 2 · Développement": "Block 2 · Development",
    "Bloc 3 · Cybersécurité": "Block 3 · Cybersecurity",
    "Voir les captures": "View screenshots",
    "API REST": "REST API",
    "Lumoura · E-commerce Luxe": "Lumoura · Luxury E-commerce",
    "Plateforme e-commerce complète de parfums haut de gamme. Authentification OTP, panier, suivi de commandes, factures PDF, autocomplétion d'adresse, interface administrateur.": "Complete high-end perfume e-commerce platform. OTP authentication, shopping cart, order tracking, PDF invoices, address autocompletion, administrator interface.",
    "Auth OTP": "OTP auth",
    "Panier & commandes": "Cart & orders",
    "Factures PDF": "PDF invoices",
    "API adresse": "Address API",
    "PDO sécurisé": "Secure PDO",
    "Interface admin": "Admin interface",
    "Voir le projet": "View project",
    "Voir le case study": "View case study",
    "Connexion →": "Login →",
    "Espace SAV →": "After-sales area →",
    "En cours": "In progress",
    "Lumoura SAV · Client lourd": "Lumoura SAV · Desktop client",
    "Problématique :": "Problem:",
    "permettre aux clients de la boutique Lumoura de déclarer et suivre leurs réclamations après achat, de façon sécurisée.": "let customers of the Lumoura shop report and track their after-sales complaints securely.",
    "Briques :": "Building blocks:",
    "C# / WinForms, SQLite (Microsoft.Data.Sqlite), architecture en couches (interface, services d'authentification et de tickets, accès aux données).": "C# / WinForms, SQLite (Microsoft.Data.Sqlite), layered architecture (interface, authentication and ticket services, data access).",
    "Réalisé :": "Done:",
    "schéma de base (6 tables sav_*), connexion et inscription avec blocage après échecs, liste « Mes réclamations » filtrable par statut.": "database schema (6 sav_* tables), login and registration with lockout after failed attempts, \"My complaints\" list filterable by status.",
    "En cours :": "In progress:",
    "création et traitement des tickets.": "ticket creation and processing.",
    "Bloc 2 · Conception et développement d'applications": "Block 2 · Application design and development",
    "Voir la capture": "View screenshot",
    "MultiConvertisseur": "MultiConverter",
    "Application bureautique développée en C# permettant d'effectuer plusieurs types de conversions à travers une interface graphique intuitive. Ce projet a renforcé mes compétences en programmation orientée objet, gestion des événements et développement d'applications Windows.": "Desktop application developed in C# that performs several types of conversions through an intuitive graphical interface. This project strengthened my skills in object-oriented programming, event handling and Windows application development.",
    "Interface GUI": "GUI interface",
    "Événements": "Events",
    "Jouer ici →": "Play here →",
    "Jeu des allumettes": "Matchstick game",
    "Jeu web en JavaScript natif, sans serveur ni framework : deux joueurs, joueur contre machine aléatoire, ou contre une IA stratégique. Plusieurs écrans (accueil, configuration, plateau, fin de partie, règles), code séparé en modules (logique de jeu, IA, interface, sons).": "Web game in native JavaScript, with no server or framework: two players, player versus random machine, or versus a strategic AI. Several screens (home, setup, board, end of game, rules), code split into modules (game logic, AI, interface, sounds).",
    "3 modes de jeu": "3 game modes",
    "IA stratégique": "Strategic AI",
    "JS modulaire": "Modular JS",
    "Jouer ici": "Play here",
    "Démo →": "Demo →",
    "Application de gestion de tâches permettant l'ajout, la suppression et le suivi des tâches avec sauvegarde locale.": "Task management application to add, delete and track tasks, with local saving.",
    "Ce site →": "This site →",
    "Portfolio Personnel": "Personal Portfolio",
    "Portfolio professionnel responsive intégrant animations, mode sombre/clair, filtres dynamiques, curseur personnalisé et présentation détaillée des projets réalisés.": "Responsive professional portfolio featuring animations, dark/light mode, dynamic filters, a custom cursor and a detailed presentation of the projects completed.",
    "Les technologies que je maîtrise": "The technologies I master",
    "CV professionnel — disponible en consultation ou téléchargement": "Professional CV — available to view or download",
    "Consulter": "View",
    "Télécharger": "Download",
    "Certifications obtenues au cours de ma formation": "Certifications earned during my studies",
    "Maîtrise des fondements et du cadre conceptuel de l'intelligence artificielle.": "Mastery of the foundations and conceptual framework of artificial intelligence.",
    "Voir": "View",
    "Introduction à l'utilisation de Claude Cowork pour automatiser des tâches avec l'IA.": "Introduction to using Claude Cowork to automate tasks with AI.",
    "Initiation à Claude Code pour l'assistance au développement logiciel par l'IA.": "Introduction to Claude Code for AI-assisted software development.",
    "Certification fondamentale à l'utilisation de Claude, l'assistant IA d'Anthropic.": "Foundational certification in using Claude, Anthropic's AI assistant.",
    "Compétences": "Skills",
    "Compétences techniques": "Technical skills",
    "Compétences transversales": "Soft skills",
    "Créativité": "Creativity",
    "Résolution de problèmes": "Problem solving",
    "Travail en équipe": "Teamwork",
    "Technologique": "Watch",
    "Je suis activement l'actualité cybersécurité web et applicative via": "I actively follow web and application cybersecurity news via",
    "depuis Mai 2026.": "since May 2026.",
    "Sujet de veille · BTS SIO": "Watch topic · BTS SIO",
    "La sécurisation des API REST avec OAuth 2.0 et les jetons JWT : comment garantir l'authentification et l'autorisation fine des échanges de données sans exposer les identifiants des utilisateurs ?": "Securing REST APIs with OAuth 2.0 and JWT tokens: how can we guarantee authentication and fine-grained authorization of data exchanges without exposing users' credentials?",
    "Flux OAuth 2.0 / 2.1": "OAuth 2.0 / 2.1 flow",
    "Authorization Code avec PKCE : le client n'a jamais accès au mot de passe, seulement à un jeton limité.": "Authorization Code with PKCE: the client never has access to the password, only to a limited token.",
    "Jetons JWT": "JWT tokens",
    "Structure, signature, durée de vie courte et révocation : ce qui rend un jeton fiable.": "Structure, signature, short lifetime and revocation: what makes a token trustworthy.",
    "Vulnérabilités": "Vulnerabilities",
    "Broken Authentication (OWASP API2), fuite de jetons, CSRF et XSS.": "Broken Authentication (OWASP API2), token leakage, CSRF and XSS.",
    "Focus API2 : Broken Authentication": "Focus on API2: Broken Authentication",
    "Lire la source →": "Read the source →",
    "Laboratoires OAuth et JWT": "OAuth and JWT labs",
    "Alertes et avis de sécurité": "Security alerts and advisories",
    "Collecte et tri des flux RSS": "Collecting and sorting RSS feeds",
    "Ouvrir mon Feedly →": "Open my Feedly →",
    "Ma méthodologie de veille": "My watch methodology",
    "Collecte :": "Collection:",
    "Google Alerts m'envoie chaque jour les actualités sur OAuth 2.0 et JWT, et Feedly regroupe mes flux RSS (OWASP, PortSwigger, CERT-FR).": "Google Alerts sends me the daily news on OAuth 2.0 and JWT, and Feedly gathers my RSS feeds (OWASP, PortSwigger, CERT-FR).",
    "Tri :": "Sorting:",
    "je garde les sources officielles et récentes, je recoupe avec une seconde source et j'écarte les articles purement commerciaux.": "I keep official and recent sources, cross-check with a second source and discard purely commercial articles.",
    "Analyse :": "Analysis:",
    "je note l'essentiel dans une fiche de synthèse et je relie chaque information à mon sujet (PKCE, durée de vie des jetons, OWASP API2).": "I note the essentials in a summary sheet and link each piece of information to my topic (PKCE, token lifetime, OWASP API2).",
    "Exploitation :": "Application:",
    "j'applique ces bonnes pratiques dans mes projets, par exemple l'authentification sécurisée de Lumoura et de Lumoura SAV.": "I apply these best practices in my projects, for example the secure authentication of Lumoura and Lumoura SAV.",
    "📧 Preuve Google Alerts": "📧 Google Alerts proof",
    "Capture d'écran de ma boîte Gmail montrant les alertes cybersécurité web quotidiennes reçues via Google Alerts.": "Screenshot of my Gmail inbox showing the daily web cybersecurity alerts received via Google Alerts.",
    "📡 CYBER NEWS LIVE": "📡 LIVE CYBER NEWS",
    "Me": "Get in",
    "Contacter": "Touch",
    "N'hésitez pas à me contacter pour une alternance ou un projet.": "Feel free to contact me for a work-study placement or a project.",
    "Envoyer": "Send",
    "Téléphone / WhatsApp": "Phone / WhatsApp",
    "Le problème": "The problem",
    "Créer une plateforme e-commerce de parfums de luxe complète et fonctionnelle, avec gestion des utilisateurs, des commandes et une interface d'administration robuste — le tout sans framework back-end, en PHP pur avec architecture MVC.": "Create a complete, working luxury perfume e-commerce platform, with user management, orders and a robust administration interface — all without a back-end framework, in pure PHP with MVC architecture.",
    "La solution": "The solution",
    "Architecture MVC maison avec routeur personnalisé, authentification sécurisée par OTP email, API REST pour l'autocomplétion d'adresse (API Adresse gouv.fr), génération de factures PDF avec mPDF, et un dashboard admin complet pour gérer produits et commandes.": "Custom MVC architecture with a custom router, secure authentication via email OTP, REST API for address autocompletion (French government Address API), PDF invoice generation with mPDF, and a complete admin dashboard to manage products and orders.",
    "Technologies utilisées": "Technologies used",
    "Architecture MVC": "MVC architecture",
    "OTP Email": "Email OTP",
    "Difficultés rencontrées": "Challenges encountered",
    "Implémenter le système OTP avec expiration et renouvellement sécurisé": "Implementing the OTP system with expiry and secure renewal",
    "Gérer les sessions et la sécurité des requêtes SQL avec PDO": "Managing sessions and SQL query security with PDO",
    "Intégrer mPDF pour générer des factures PDF dynamiques formatées": "Integrating mPDF to generate dynamic, formatted PDF invoices",
    "Concevoir un routeur MVC sans framework depuis zéro": "Building an MVC router from scratch without a framework",
    "Résultat final": "Final result",
    "Plateforme e-commerce 100% fonctionnelle avec catalogue produits, panier, système de commandes complet, espace client, génération de factures PDF téléchargeables et interface admin pour gérer l'ensemble du site. Projet phare du BTS SIO SLAM.": "100% functional e-commerce platform with product catalog, cart, complete order system, customer area, downloadable PDF invoice generation and an admin interface to manage the whole site. Flagship project of the BTS SIO SLAM.",
    "MultiConvertisseur · Capture": "MultiConverter · Screenshot",
    "Lumoura SAV · Captures de l'application": "Lumoura SAV · Application screenshots",
    "Connexion": "Login",
    "Espace SAV": "After-sales area",
    "Application Windows (C# / WinForms) : ces captures montrent l'interface, elle ne s'exécute pas dans le navigateur.": "Windows application (C# / WinForms): these screenshots show the interface; it does not run in the browser.",
    "Jeu des allumettes · Jouable ici": "Matchstick game · Playable here",
    "Lumoura · Captures du site": "Lumoura · Website screenshots",
    "Conçu & développé par": "Designed & developed by",
    "· BTS SIO SLAM 2026": "· BTS SIO SLAM 2026",
    "Disponible en alternance": "Available for work-study",
    "Choisir la couleur": "Choose a color",
    "Palette de couleurs": "Color palette",
    "Haut de page": "Back to top",
    "Envoi en cours...": "Sending...",
    "Message envoyé !": "Message sent!",
    "Erreur — réessaie": "Error — please try again",
    "Le service d'envoi est indisponible. Écris-moi directement par e-mail.": "The sending service is unavailable. Please email me directly.",
    "Veuillez remplir tous les champs.": "Please fill in all fields.",
    "Veuillez entrer une adresse email valide.": "Please enter a valid email address.",
    "Certification :": "Certification:",
    "Bienvenue dans la": "Welcome to the",
    "Tu as trouvé le code secret !": "You found the secret code!",
    "Sortir de la Matrix": "Exit the Matrix",
    "Lumoura SAV : liste des réclamations": "Lumoura SAV: complaints list",
    "Chargement des actualités…": "Loading the news…",
    "Flux indisponibles pour le moment. Mes sources :": "Feeds are unavailable for now. My sources:",
    "Mettre en pause le défilement": "Pause scrolling",
    "Reprendre le défilement": "Resume scrolling",
    "Rafraîchir les actualités": "Refresh the news",
    "Standard officiel": "Official standard",
    "Bonnes pratiques": "Best practices",
    "Organisme du standard": "Standards body",
    "Définit l'API du navigateur pour créer et utiliser des clés publiques liées à un site.": "Defines the browser API for creating and using public keys tied to a website.",
    "Le serveur ne stocke qu'une clé publique, et la clé n'est valable que pour son domaine d'origine.": "The server only stores a public key, and the key is only valid for its origin domain.",
    "Recommandations de l'OWASP pour concevoir une authentification robuste.": "OWASP recommendations for designing robust authentication.",
    "Liste les bonnes pratiques à vérifier dans mon propre code d'authentification.": "Lists the best practices to check in my own authentication code.",
    "Passkeys : présentation": "Passkeys: overview",
    "Explique ce que sont les passkeys et comment elles se synchronisent entre appareils.": "Explains what passkeys are and how they sync across devices.",
    "Une passkey peut se synchroniser entre appareils, ce qui évite de perdre son accès.": "A passkey can sync across devices, which avoids losing access.",
    "Ce que j'en retiens :": "What I take from it:",
    "Lire la source": "Read the source",
    "Changer le thème": "Change theme",
    "Changer le thème clair/sombre": "Switch between light and dark theme",
    "Ouvrir le menu": "Open menu",
    "Lumoura accueil": "Lumoura home page",
    "Application Lumoura SAV : liste des réclamations": "Lumoura SAV application: complaints list",
    "MultiConvertisseur : fenêtre du convertisseur universel": "MultiConverter: universal converter window",
    "Jeu des allumettes : plateau de jeu": "Matchstick game: game board",
    "To-Do List : liste de tâches": "To-Do List: task list",
    "Portfolio personnel : page d'accueil": "Personal portfolio: home page",
    "Visionneuse de certification": "Certification viewer",
    "Actualités cybersécurité": "Cybersecurity news",
    "Rafraîchir": "Refresh",
    "Votre nom": "Your name",
    "Votre email": "Your email",
    "Votre message": "Your message",
    "Case study Lumoura": "Lumoura case study",
    "Fermer": "Close",
    "Lumoura SAV · Captures": "Lumoura SAV · Screenshots",
    "Lumoura SAV : écran de connexion": "Lumoura SAV: login screen",
    "Captures Lumoura": "Lumoura screenshots",
    "Melissa Bestani, développeuse web, BTS SIO SLAM": "Melissa Bestani, web developer, BTS SIO SLAM",
    /* --- Tableau de synthèse E4 --- */
    "Gérer le patrimoine informatique": "Manage the IT assets",
    "Patrimoine": "Assets",
    "Répondre aux incidents et aux demandes d’assistance et d’évolution": "Respond to incidents and to support and change requests",
    "Incidents et évolutions": "Incidents and changes",
    "Développer la présence en ligne de l’organisation": "Develop the organisation’s online presence",
    "Présence en ligne": "Online presence",
    "Travailler en mode projet": "Work in project mode",
    "Mode projet": "Project mode",
    "Mettre à disposition des utilisateurs un service informatique": "Provide users with an IT service",
    "Service aux utilisateurs": "User service",
    "Organiser son développement professionnel": "Organise your professional development",
    "Développement pro": "Professional development",
    "Réalisations en cours de formation": "Work done during training",
    "Novembre 2026": "November 2026",
    "JavaScript modulaire : moteur de jeu, IA de décision, interface multilingue FR/EN et effets sonores.": "Modular JavaScript: game engine, decision AI, multilingual FR/EN interface and sound effects.",
    "Octobre 2026": "October 2026",
    "TP PHP, MySQL et Smarty : séparation de la logique et de la présentation, création, affichage et commentaires d’articles.": "PHP, MySQL and Smarty lab: logic and presentation kept separate, creating, displaying and commenting articles.",
    "Avril – mai 2026": "April – May 2026",
    "Application Windows en C# .NET (Windows Forms) : conversions multiples, programmation orientée objet et gestion des événements.": "Windows application in C# .NET (Windows Forms): multiple conversions, object-oriented programming and event handling.",
    "Janvier – mars 2026": "January – March 2026",
    "Boutique full-stack en PHP (MVC maison) : MySQL, authentification OTP par e-mail, API Adresse, factures PDF avec mPDF, administration.": "Full-stack shop in plain PHP (custom MVC): MySQL, e-mail OTP authentication, Address API, PDF invoices with mPDF, admin area.",
    "Novembre – décembre 2025": "November – December 2025",
    "Portfolio responsive en HTML, CSS et JavaScript : animations, mode sombre/clair, filtres dynamiques, mise en ligne via GitHub Pages.": "Responsive portfolio in HTML, CSS and JavaScript: animations, dark/light mode, dynamic filters, published with GitHub Pages.",
    "Novembre 2025": "November 2025",
    "Application web de gestion de tâches en JavaScript : ajout, suppression et suivi, sauvegarde locale, mise en ligne via GitHub Pages.": "Task-management web app in JavaScript: add, delete and track tasks, local storage, published with GitHub Pages.",
    "Réalisations en milieu professionnel en cours de seconde année": "Work placements during the second year",
    "Septembre – décembre 2026": "September – December 2026",
    "Front-end d’une application de gestion de flotte et de livreurs sous WeWeb (assisté par IA), avec Supabase en back-end : conception des écrans, intégration, bonnes pratiques de sécurité, travail en équipe.": "Front-end of a fleet and delivery-driver management app built with WeWeb (AI-assisted) on a Supabase back end: screen design, integration, security best practices, teamwork.",
    "Voir sur GitHub": "View on GitHub",
    "Télécharger le tableau officiel (PDF)": "Download the official table (PDF)",
    "Stage": "Placement",
    "Réalisation": "Project",
    "Tableau E4": "E4 table",
    "Épreuve E4 · BTS SIO option SLAM. Compétences du bloc 1 mobilisées dans chacune de mes réalisations.": "E4 exam · BTS SIO, SLAM option. Block 1 skills used in each of my projects.",
    "Tableau de synthèse des réalisations professionnelles, avec les compétences mobilisées pour chaque réalisation.": "Summary table of professional work, showing the skills used in each project.",
    "Tableau de synthèse des réalisations": "Summary table of projects",
    "Les coches indiquent les compétences mobilisées.": "Ticks show the skills used.",
    "Jeu des allumettes": "Matchstick game",
    "Système de blog": "Blog system",
    "MultiConvertisseur · application C#": "MultiConverter · C# application",
    "Lumoura · e-commerce de parfums de luxe": "Lumoura · luxury perfume e-commerce",
    "Portfolio personnel": "Personal portfolio"
};

    /* ---------- Métadonnées de la page ---------- */
    var PAGE_EN = {
        title: 'Melissa Bestani | Web Developer · BTS SIO SLAM',
        metas: {
            'meta[name="description"]': "Melissa Bestani's portfolio – BTS SIO SLAM, web developer, PHP, React, MySQL.",
            'meta[property="og:title"]': 'Melissa Bestani | Web Developer · BTS SIO SLAM',
            'meta[property="og:description"]': 'Full-stack web developer (PHP, MySQL, JavaScript), BTS SIO SLAM student, available for a work-study placement in Paris. Discover my projects.',
            'meta[property="og:image:alt"]': 'Melissa Bestani, web developer, BTS SIO SLAM',
            'meta[name="twitter:title"]': 'Melissa Bestani | Web Developer · BTS SIO SLAM',
            'meta[name="twitter:description"]': 'Full-stack web developer, BTS SIO SLAM, available for a work-study placement in Paris.'
        }
    };
    var pageFR = null;   /* valeurs françaises d'origine, lues au démarrage */

    var lang = 'fr';
    var busy = false;
    var origText = new WeakMap();   /* noeud texte -> texte français d'origine */
    var origAttr = new WeakMap();   /* élément -> { attribut: valeur française } */

    function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

    function skipNode(node) {
        var el = node.nodeType === 3 ? node.parentElement : node;
        if (!el) return true;
        if (SKIP_TAGS[el.tagName]) return true;
        if (el.closest && (el.closest('#typed-text') || el.closest('[data-no-i18n]'))) return true;
        return false;
    }

    /* ---------- Traduction d'un noeud texte ---------- */
    function translateText(node) {
        if (skipNode(node)) return;
        if (lang === 'fr') {
            var o = origText.get(node);
            if (o !== undefined && node.nodeValue !== o) node.nodeValue = o;
            return;
        }
        var raw = node.nodeValue;
        var key = norm(raw);
        if (!key) return;
        var par = node.parentElement;
        var en = (par && par.hasAttribute('data-en')) ? par.getAttribute('data-en') : EN[key];
        if (en === undefined) return;
        var m = raw.match(/^(\s*)[\s\S]*?(\s*)$/);
        if (!origText.has(node)) origText.set(node, raw);
        var next = m[1] + en + m[2];
        if (node.nodeValue !== next) node.nodeValue = next;
    }

    /* ---------- Traduction des attributs d'un élément ---------- */
    function translateAttrs(el) {
        if (!el || el.nodeType !== 1 || skipNode(el)) return;
        /* Lien qui change de fichier selon la langue (ex. CV en anglais) */
        if (el.hasAttribute('data-href-en')) {
            var st = origAttr.get(el);
            if (!st) { st = {}; origAttr.set(el, st); }
            if (st.href === undefined) st.href = el.getAttribute('href');
            var want = lang === 'en' ? el.getAttribute('data-href-en') : st.href;
            if (el.getAttribute('href') !== want) el.setAttribute('href', want);
        }
        ATTRS.forEach(function (a) {
            if (!el.hasAttribute(a)) return;
            var store = origAttr.get(el);
            if (lang === 'fr') {
                if (store && store[a] !== undefined && el.getAttribute(a) !== store[a]) el.setAttribute(a, store[a]);
                return;
            }
            var en = EN[norm(el.getAttribute(a))];
            if (en === undefined) return;
            if (!store) { store = {}; origAttr.set(el, store); }
            if (store[a] === undefined) store[a] = el.getAttribute(a);
            if (el.getAttribute(a) !== en) el.setAttribute(a, en);
        });
    }

    function walk(root) {
        if (root.nodeType === 3) { translateText(root); return; }
        if (root.nodeType !== 1) return;
        translateAttrs(root);
        root.querySelectorAll('*').forEach(translateAttrs);
        var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var n, nodes = [];
        while ((n = tw.nextNode())) nodes.push(n);
        nodes.forEach(translateText);
    }

    function applyPage() {
        if (!pageFR) {
            pageFR = { title: document.title, metas: {} };
            Object.keys(PAGE_EN.metas).forEach(function (sel) {
                var el = document.querySelector(sel);
                if (el) pageFR.metas[sel] = el.getAttribute('content');
            });
        }
        var src = lang === 'en' ? PAGE_EN : pageFR;
        document.title = src.title;
        Object.keys(PAGE_EN.metas).forEach(function (sel) {
            var el = document.querySelector(sel);
            if (el && src.metas[sel] !== undefined) el.setAttribute('content', src.metas[sel]);
        });
    }

    function applyAll() {
        busy = true;
        walk(document.body);
        applyPage();
        busy = false;
        if (observer) observer.takeRecords();
    }

    /* ---------- Contenu ajouté plus tard par les autres scripts ---------- */
    var observer = null;
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(function (muts) {
            if (busy || lang === 'fr') return;
            busy = true;
            muts.forEach(function (m) {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(function (n) { walk(n); });
                } else if (m.type === 'attributes') {
                    translateAttrs(m.target);
                }
            });
            busy = false;
            observer.takeRecords();
        });
    }

    /* ---------- Bouton FR / EN ---------- */
    function updateButton() {
        var btn = document.getElementById('lang-toggle');
        if (!btn) return;
        var next = lang === 'fr' ? 'EN' : 'FR';
        btn.textContent = next;
        btn.setAttribute('lang', next.toLowerCase());
        var label = lang === 'fr' ? 'Switch to English' : 'Passer en français';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    }

    function setLang(l, save) {
        lang = (l === 'en') ? 'en' : 'fr';
        document.documentElement.lang = lang;
        if (save !== false) { try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* stockage indisponible */ } }
        applyAll();
        updateButton();
        document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }

    /* Texte traduit à la demande (alertes, messages créés par script) */
    function t(fr) {
        if (lang !== 'en') return fr;
        var en = EN[norm(fr)];
        return en === undefined ? fr : en;
    }

    window.I18N = { t: t, lang: function () { return lang; }, set: setLang };

    /* ---------- Démarrage ---------- */
    function start() {
        var wanted = null;
        try { wanted = new URLSearchParams(location.search).get('lang'); } catch (e) { /* ancien navigateur */ }
        if (wanted !== 'en' && wanted !== 'fr') {
            try { wanted = localStorage.getItem(STORE_KEY); } catch (e) { wanted = null; }
        }
        var btn = document.getElementById('lang-toggle');
        if (btn) btn.addEventListener('click', function () { setLang(lang === 'fr' ? 'en' : 'fr'); });
        if (observer) {
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });
        }
        applyPage();                       /* mémorise le titre/méta français */
        updateButton();
        if (wanted === 'en') setLang('en', false);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();