/* ==========================================================
   game.js - LOGIQUE DU JEU (aucun accès à l'affichage)
   Règle : on retire 1, 2 ou 3 allumettes.
   Celui qui retire la DERNIÈRE allumette GAGNE.
   ========================================================== */
const Jeu = (function () {
  const MAX_RETRAIT = 3;
  const MAX_ALLUMETTES = 100;

  /** Initialise une partie. joueurs = [{nom, type}, {nom, type}] */
  function creerPartie(nbAllumettes, joueurs) {
    if (!Number.isInteger(nbAllumettes) || nbAllumettes < 1 || nbAllumettes > MAX_ALLUMETTES) {
      throw new Error("Nombre d'allumettes invalide : " + nbAllumettes);
    }
    return {
      initial: nbAllumettes,
      restantes: nbAllumettes,
      joueurs: joueurs,
      indexActif: 0,       // 0 = premier joueur, 1 = second
      historique: [],      // {joueur, retire, restantes}
      terminee: false,
      perdant: null,
      gagnant: null
    };
  }

  function joueurActif(etat) { return etat.joueurs[etat.indexActif]; }

  /** Nombre maximum d'allumettes retirables maintenant (jamais plus que le reste) */
  function maxRetrait(etat) { return Math.min(MAX_RETRAIT, etat.restantes); }

  function retraitValide(etat, n) {
    return !etat.terminee && Number.isInteger(n) && n >= 1 && n <= maxRetrait(etat);
  }

  /** Change de joueur */
  function changerJoueur(etat) { etat.indexActif = 1 - etat.indexActif; }

  /** Vérifie la fin : si plus d'allumettes, le joueur actif (qui vient de retirer la dernière) GAGNE */
  function verifierFin(etat) {
    if (etat.restantes === 0) {
      etat.terminee = true;
      etat.gagnant = joueurActif(etat);
      etat.perdant = etat.joueurs[1 - etat.indexActif];
      return true;
    }
    return false;
  }

  /** Retire n allumettes pour le joueur actif. Renvoie false si le coup est interdit. */
  function retirer(etat, n) {
    if (!retraitValide(etat, n)) return false;
    etat.restantes -= n;
    etat.historique.push({ joueur: joueurActif(etat).nom, retire: n, restantes: etat.restantes });
    if (!verifierFin(etat)) changerJoueur(etat);
    return true;
  }

  return { MAX_RETRAIT, MAX_ALLUMETTES, creerPartie, joueurActif, maxRetrait,
           retraitValide, changerJoueur, verifierFin, retirer };
})();

if (typeof module !== "undefined") module.exports = Jeu;
