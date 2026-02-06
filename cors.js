(function(){
    // CONFIG
    const RSS_URL = 'https://feeds.feedburner.com/TheHackersNews'; // Flux RSS cybersécurité
    const refreshInterval = 120_000; // rafraîchir toutes les 120s (2 minutes)
    const minDurationPerPixel = 0.025; // secondes par pixel (ajuster vitesse)

    // elements
    const viewport = document.getElementById('rssViewport');
    const refreshBtn = document.getElementById('refreshBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    let animationTimer = null;
    let pollingTimer = null;
    let isPaused = false;

    refreshBtn.addEventListener('click', () => { fetchAndRender(); });
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      updatePauseState();
    });

    function updatePauseState(){
      if(isPaused){
        viewport.style.animationPlayState = 'paused';
        pauseBtn.textContent = '▶️';
        pauseBtn.title = 'Reprendre';
      } else {
        viewport.style.animationPlayState = 'running';
        pauseBtn.textContent = '⏸';
        pauseBtn.title = 'Mettre en pause';
      }
    }

    async function fetchRSS(url){
      // Utiliser un proxy CORS pour éviter les erreurs
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      try {
        const resp = await fetch(proxyUrl, {cache: 'no-store'});
        if(!resp.ok) throw new Error('Échec du fetch RSS: ' + resp.status);
        const text = await resp.text();
        return (new window.DOMParser()).parseFromString(text, "application/xml");
      } catch(err) {
        console.error('Erreur fetch RSS:', err);
        throw err;
      }
    }

    function parseItems(xmlDoc, maxItems = 20){
      // support both RSS (item) and Atom (entry)
      const items = [];
      const rssItems = xmlDoc.querySelectorAll('item, entry');
      for(let i=0; i<rssItems.length && items.length < maxItems; i++){
        const el = rssItems[i];
        let title = el.querySelector('title')?.textContent?.trim() || '';
        let link = el.querySelector('link')?.textContent?.trim() || el.querySelector('link')?.getAttribute('href') || '#';
        if(!link && el.querySelector('link[rel="alternate"]')) link = el.querySelector('link[rel="alternate"]').getAttribute('href');
        items.push({ title, link });
      }
      return items;
    }

    function buildContent(items){
      if(items.length === 0) return '<span class="rss-item">📡 Aucun élément</span>';
      return items.map((it, index) => {
        const safeTitle = escapeHtml(it.title || '(sans titre)');
        const href = it.link || '#';
        const icon = index % 3 === 0 ? '🔐' : (index % 3 === 1 ? '🛡️' : '⚠️');
        return `<span class="rss-item"><a href="${href}" target="_blank" rel="noopener noreferrer">${icon} ${safeTitle}</a></span>`;
      }).join('');
    }

    function escapeHtml(s){
      return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
    }

    function startScrollAnimation(){
      // stop previous animation
      viewport.style.animation = 'none';
      void viewport.offsetWidth; // reflow to restart animation

      // compute widths
      const banner = document.querySelector('.rss-banner');
      const bannerWidth = banner.clientWidth;
      const contentWidth = viewport.scrollWidth;

      // if content shorter than banner, don't scroll; center it.
      if(contentWidth <= bannerWidth){
        viewport.style.transform = 'translateX(0)';
        viewport.style.animation = 'none';
        return;
      }

      // distance to translate: contentWidth (move left by contentWidth + a gap)
      const translateDistance = contentWidth + 30; // px
      // compute duration in seconds from pixel count and ratio
      const durationSec = Math.max(8, translateDistance * minDurationPerPixel); // minimum 8s
      viewport.style.setProperty('--translate-x', `-${translateDistance}px`);

      // set animation dynamically
      viewport.style.animation = `scroll-x ${durationSec}s linear infinite`;
      viewport.style.animationPlayState = isPaused ? 'paused' : 'running';
    }

    async function fetchAndRender(){
      try {
        const xml = await fetchRSS(RSS_URL);
        // check for parsererror
        if(xml.querySelectorAll('parsererror').length){
          throw new Error('Erreur de parsing XML. Le flux renvoie peut-être du HTML ou les CORS bloquent la réponse.');
        }
        const items = parseItems(xml, 30);
        viewport.innerHTML = buildContent(items);
        // restart scroll
        startScrollAnimation();
      } catch (err) {
        console.error(err);
        viewport.innerHTML = '<span class="rss-item">Erreur de chargement du flux RSS</span>';
        startScrollAnimation();
      }
    }

    // start polling
    fetchAndRender();
    pollingTimer = setInterval(fetchAndRender, refreshInterval);

    // reposition animation on resize
    window.addEventListener('resize', () => { startScrollAnimation(); });

    // accessibility: pause on keyboard focus
    viewport.addEventListener('focus', () => { isPaused = true; updatePauseState(); });
    viewport.addEventListener('blur', () => { isPaused = false; updatePauseState(); });

    // Expose for debugging
    window.__rssBanner = { fetchAndRender, startScrollAnimation };
  })();