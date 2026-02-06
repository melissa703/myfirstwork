(function(){
    // CONFIG
    const RSS_URL = 'https://www.zdnet.fr/rss/';   // Flux ZDNet France – tech & cybersécurité
    const refreshInterval = 120_000; // 2 minutes
    const minDurationPerPixel = 0.025;

    const viewport = document.getElementById('rssViewport');
    const refreshBtn = document.getElementById('refreshBtn');
    const pauseBtn = document.getElementById('pauseBtn');

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
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      try {
        const resp = await fetch(proxyUrl, {cache: 'no-store'});
        if(!resp.ok) throw new Error('Échec fetch RSS: ' + resp.status);
        const text = await resp.text();
        return (new window.DOMParser()).parseFromString(text, "application/xml");
      } catch(err) {
        console.error('Erreur fetch RSS:', err);
        throw err;
      }
    }

    function parseItems(xmlDoc, maxItems = 20){
      const items = [];
      const rssItems = xmlDoc.querySelectorAll('item, entry');
      for(let i=0; i<rssItems.length && items.length < maxItems; i++){
        const el = rssItems[i];
        let title = el.querySelector('title')?.textContent?.trim() || '';
        let link = el.querySelector('link')?.textContent?.trim() || 
                   el.querySelector('link')?.getAttribute('href') || '#';
        if(!link && el.querySelector('link[rel="alternate"]')) {
          link = el.querySelector('link[rel="alternate"]').getAttribute('href');
        }
        items.push({ title, link });
      }
      return items;
    }

    function buildContent(items){
      if(items.length === 0) return '<span class="rss-item">📡 Aucun article récent</span>';
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
      viewport.style.animation = 'none';
      void viewport.offsetWidth;

      const banner = document.querySelector('.rss-banner');
      const bannerWidth = banner.clientWidth;
      const contentWidth = viewport.scrollWidth;

      if(contentWidth <= bannerWidth){
        viewport.style.transform = 'translateX(0)';
        viewport.style.animation = 'none';
        return;
      }

      const translateDistance = contentWidth + 30;
      const durationSec = Math.max(8, translateDistance * minDurationPerPixel);
      viewport.style.setProperty('--translate-x', `-${translateDistance}px`);
      viewport.style.animation = `scroll-x ${durationSec}s linear infinite`;
      viewport.style.animationPlayState = isPaused ? 'paused' : 'running';
    }

    async function fetchAndRender(){
      try {
        const xml = await fetchRSS(RSS_URL);
        if(xml.querySelectorAll('parsererror').length){
          throw new Error('Erreur parsing XML');
        }
        const items = parseItems(xml, 30);
        viewport.innerHTML = buildContent(items);
        startScrollAnimation();
      } catch (err) {
        console.error(err);
        viewport.innerHTML = '<span class="rss-item">⚠️ Erreur chargement flux actualités</span>';
        startScrollAnimation();
      }
    }

    fetchAndRender();
    setInterval(fetchAndRender, refreshInterval);

    window.addEventListener('resize', startScrollAnimation);

    viewport.addEventListener('focus', () => { isPaused = true; updatePauseState(); });
    viewport.addEventListener('blur', () => { isPaused = false; updatePauseState(); });
  })();