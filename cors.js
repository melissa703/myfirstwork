// ===================================
// RSS FEED FETCHER - CYBERSECURITY NEWS
// Technology Watch Section
// ===================================

const RSS_FEEDS = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://www.darkreading.com/rss.xml',
    'https://threatpost.com/feed/',
];

let isPaused = false;
let newsItems = [];

// ===================================
// FETCH RSS FEEDS
// ===================================
async function fetchRSSFeeds() {
    const rssContent = document.getElementById('rssContent');
    
    if (!rssContent) return;
    
    try {
        // Utiliser un proxy CORS pour récupérer les flux RSS
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
                    if (index < 5) { // Limite à 5 articles par feed
                        const title = item.querySelector('title')?.textContent || 'No title';
                        const link = item.querySelector('link')?.textContent || '#';
                        const pubDate = item.querySelector('pubDate')?.textContent || '';
                        
                        articles.push({
                            title: title.trim(),
                            link: link.trim(),
                            date: formatDate(pubDate)
                        });
                    }
                });
                
                return articles;
            } catch (error) {
                console.warn(`Failed to fetch ${feedUrl}:`, error);
                return [];
            }
        });
        
        const results = await Promise.all(feedPromises);
        newsItems = results.flat();
        
        if (newsItems.length > 0) {
            displayNews();
        } else {
            // Fallback avec des nouvelles statiques
            displayFallbackNews();
        }
        
    } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        displayFallbackNews();
    }
}

// ===================================
// DISPLAY NEWS ITEMS
// ===================================
function displayNews() {
    const rssContent = document.getElementById('rssContent');
    const rssDuplicate = document.querySelector('.rss-duplicate');
    
    if (!rssContent) return;
    
    const newsHTML = newsItems.map(item => `
        <span>
            <strong>🔒</strong> 
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: none;">
                ${item.title}
            </a>
            ${item.date ? `<em style="color: var(--text-secondary); font-size: 0.85rem;"> • ${item.date}</em>` : ''}
        </span>
    `).join('');
    
    rssContent.innerHTML = newsHTML;
    
    // Dupliquer pour l'effet de défilement infini
    if (rssDuplicate) {
        rssDuplicate.innerHTML = newsHTML;
    }
}

// ===================================
// FALLBACK NEWS (Static)
// ===================================
function displayFallbackNews() {
    const rssContent = document.getElementById('rssContent');
    const rssDuplicate = document.querySelector('.rss-duplicate');
    
    if (!rssContent) return;
    
    const fallbackNews = [
        { title: 'Major Data Breach Affects Millions of Users', date: 'Today' },
        { title: 'New Zero-Day Vulnerability Discovered in Popular Software', date: '2 hours ago' },
        { title: 'Ransomware Attack Targets Healthcare Sector', date: '5 hours ago' },
        { title: 'Critical Security Update Released for Windows', date: 'Yesterday' },
        { title: 'Phishing Campaign Exploits AI-Generated Content', date: 'Yesterday' },
        { title: 'Database Security Best Practices 2026', date: '2 days ago' },
        { title: 'SQL Injection Still Among Top Web Vulnerabilities', date: '3 days ago' },
        { title: 'New Cybersecurity Framework Released', date: '1 week ago' },
        { title: 'Cloud Security Threats on the Rise', date: '1 week ago' },
        { title: 'AI-Powered Threat Detection Improves Security', date: '2 weeks ago' }
    ];
    
    const newsHTML = fallbackNews.map(item => `
        <span>
            <strong>🔒</strong> ${item.title}
            <em style="color: var(--text-secondary); font-size: 0.85rem;"> • ${item.date}</em>
        </span>
    `).join('');
    
    rssContent.innerHTML = newsHTML;
    
    if (rssDuplicate) {
        rssDuplicate.innerHTML = newsHTML;
    }
}

// ===================================
// FORMAT DATE
// ===================================
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins} min ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    } catch (error) {
        return '';
    }
}

// ===================================
// PAUSE/RESUME FUNCTIONALITY
// ===================================
const pauseBtn = document.getElementById('pauseBtn');
const ticker = document.querySelector('.rss-ticker');

if (pauseBtn && ticker) {
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        
        if (isPaused) {
            ticker.classList.add('paused');
            pauseBtn.innerHTML = '▶';
            pauseBtn.title = 'Resume';
        } else {
            ticker.classList.remove('paused');
            pauseBtn.innerHTML = '⏸';
            pauseBtn.title = 'Pause';
        }
    });
}

// ===================================
// REFRESH FUNCTIONALITY
// ===================================
const refreshBtn = document.getElementById('refreshBtn');

if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.6s ease';
        
        await fetchRSSFeeds();
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 600);
    });
}

// ===================================
// HOVER EFFECTS ON NEWS ITEMS
// ===================================
function addNewsHoverEffects() {
    const newsLinks = document.querySelectorAll('.rss-content a');
    
    newsLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--primary-color)';
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--text-primary)';
            this.style.textDecoration = 'none';
        });
    });
}

// ===================================
// AUTO-REFRESH EVERY 5 MINUTES
// ===================================
setInterval(() => {
    if (!isPaused) {
        fetchRSSFeeds();
    }
}, 300000); // 5 minutes

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    fetchRSSFeeds();
    
    // Add hover effects after a short delay to ensure DOM is ready
    setTimeout(() => {
        addNewsHoverEffects();
    }, 1000);
});

// ===================================
// SMOOTH SCROLL SPEED ADJUSTMENT
// ===================================
const rssContentElement = document.querySelector('.rss-content');

if (rssContentElement) {
    rssContentElement.addEventListener('mouseenter', () => {
        rssContentElement.style.animationDuration = '120s'; // Ralentir au survol
    });
    
    rssContentElement.addEventListener('mouseleave', () => {
        rssContentElement.style.animationDuration = '60s'; // Vitesse normale
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c📡 RSS Feed System Initialized', 'color: #0ef; font-size: 14px; font-weight: bold;');
console.log('%c🔒 Monitoring cybersecurity news in real-time', 'color: #6366f1; font-size: 12px;');