/* ==========================================================
   sound.js - SONS du jeu (aucun fichier audio : tout est
   synthétisé par le navigateur avec l'API Web Audio).
   Le son est activé par défaut ; le choix est mémorisé.
   ========================================================== */
const Son = (function () {
  const CLE = "allumettes-son";     // clé de mémorisation du choix du joueur
  let ctx = null;                   // contexte audio (créé au premier clic)
  let maitre = null;                // volume général
  let tampon = null;                // bruit blanc réutilisé (frottement, souffle)
  let actif = lireChoix();

  /* ---------- Choix actif / muet (mémorisé) ---------- */
  function lireChoix() {
    try { return localStorage.getItem(CLE) !== "non"; } catch (e) { return true; }
  }
  function ecrireChoix() {
    try { localStorage.setItem(CLE, actif ? "oui" : "non"); } catch (e) { /* stockage indisponible */ }
  }
  function estActif() { return actif; }
  function basculer() {
    actif = !actif;
    ecrireChoix();
    if (actif) clic();
    return actif;
  }

  /* ---------- Contexte audio (créé après une action du joueur) ---------- */
  function preparer() {
    if (!actif) return false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      maitre = ctx.createGain();
      maitre.gain.value = 0.5;
      maitre.connect(ctx.destination);
      tampon = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = tampon.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  /* ---------- Briques de base ---------- */

  /** Une note : fréquence (Hz), début (s), durée (s), forme d'onde, volume */
  function note(freq, debut, duree, forme, volume) {
    const t = ctx.currentTime + debut;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = forme || "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume || 0.3, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    osc.connect(gain);
    gain.connect(maitre);
    osc.start(t);
    osc.stop(t + duree + 0.05);
  }

  /** Un souffle de bruit filtré (frottement de l'allumette, flamme) */
  function souffle(debut, duree, freqDepart, freqFin, volume) {
    const t = ctx.currentTime + debut;
    const src = ctx.createBufferSource();
    src.buffer = tampon;
    src.loop = true;
    const filtre = ctx.createBiquadFilter();
    filtre.type = "bandpass";
    filtre.Q.value = 0.9;
    filtre.frequency.setValueAtTime(freqDepart, t);
    filtre.frequency.exponentialRampToValueAtTime(freqFin, t + duree);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume || 0.3, t + duree * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    src.connect(filtre);
    filtre.connect(gain);
    gain.connect(maitre);
    src.start(t);
    src.stop(t + duree + 0.05);
  }

  /* ---------- Les sons du jeu ---------- */

  /** Petit clic de bouton */
  function clic() {
    if (!preparer()) return;
    note(620, 0, 0.06, "triangle", 0.18);
  }

  /** Une allumette qu'on gratte puis qui s'enflamme (début de partie) */
  function depart() {
    if (!preparer()) return;
    souffle(0, 0.28, 1800, 5200, 0.35);   // frottement
    souffle(0.26, 0.5, 900, 300, 0.22);   // petite flamme
    note(140, 0.26, 0.12, "sine", 0.25);  // "pouf" de l'allumage
  }

  /** n allumettes retirées : un petit frottement + un "tac" par allumette */
  function retrait(n) {
    if (!preparer()) return;
    for (let i = 0; i < n; i++) {
      const d = i * 0.09;
      souffle(d, 0.1, 3200, 1400, 0.28);
      note(210 - i * 15, d + 0.02, 0.09, "triangle", 0.28);
    }
  }

  /** La machine réfléchit : deux petits tic-tac discrets */
  function reflexion() {
    if (!preparer()) return;
    note(330, 0, 0.05, "square", 0.07);
    note(280, 0.32, 0.05, "square", 0.07);
  }

  /** Victoire : arpège montant */
  function victoire() {
    if (!preparer()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      note(f, i * 0.13, 0.35, "triangle", 0.28);
    });
    note(1046.5, 0.55, 0.7, "sine", 0.22);
  }

  /** Défaite : trois notes descendantes */
  function defaite() {
    if (!preparer()) return;
    [392, 330, 262].forEach(function (f, i) {
      note(f, i * 0.22, 0.4, "sawtooth", 0.12);
    });
  }

  return { estActif, basculer, clic, depart, retrait, reflexion, victoire, defaite };
})();
