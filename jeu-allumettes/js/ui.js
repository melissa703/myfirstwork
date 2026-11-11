/* ==========================================================
   ui.js - AFFICHAGE du plateau, animations, tours de la machine
   Utilise Jeu (game.js) pour la logique et Machine (ai.js) pour les coups.
   ========================================================== */
const UI = (function () {
  const DUREE_ANIMATION = 450;   // ms, durée de disparition des allumettes
  const NB_HISTORIQUE = 6;       // nombre de lignes d'historique affichées

  let etat = null;               // état courant de la partie (voir Jeu.creerPartie)
  let config = null;             // configuration pour pouvoir rejouer
  let verrou = false;            // true = le joueur ne peut pas cliquer
  let jeton = 0;                 // change à chaque nouvelle partie / sortie : annule les anciens timers

  const $ = function (id) { return document.getElementById(id); };

  /* ---------- Démarrage / réinitialisation ---------- */

  /** Lance une nouvelle partie à partir de la config {nb, mode, joueurs} */
  function demarrer(cfg) {
    config = cfg;
    jeton++;
    etat = Jeu.creerPartie(cfg.nb, cfg.joueurs.map(function (j) { return { nom: j.nom, type: j.type }; }));
    verrou = false;
    $("liste-historique").innerHTML = "";
    $("info-mode").textContent = libelleMode(cfg.mode);
    $("nom-j1").textContent = etat.joueurs[0].nom;
    $("nom-j2").textContent = etat.joueurs[1].nom;
    dessinerAllumettes(etat.restantes);
    majCompteur();
    Son.depart();
    lancerTour();
  }

  /** Réinitialise : relance avec la même configuration (bouton Rejouer) */
  function rejouer() { if (config) demarrer(config); }

  /** Annule les timers en cours (appelé quand on quitte le plateau) */
  function annuler() { jeton++; }

  function libelleMode(mode) {
    if (mode === "deux") return t("Deux joueurs");
    if (mode === "machine") return t("Contre la machine");
    return t("Contre l'IA");
  }

  /* ---------- Dessin des allumettes ---------- */

  /** Adapte la taille des allumettes à leur quantité puis les dessine */
  function dessinerAllumettes(nb) {
    const zone = $("zone-allumettes");
    zone.innerHTML = "";
    const haut = nb <= 15 ? 150 : nb <= 30 ? 110 : nb <= 60 ? 80 : 58;
    zone.style.setProperty("--haut", haut + "px");
    for (let i = 0; i < nb; i++) {
      const allu = document.createElement("div");
      allu.className = "allu";
      allu.innerHTML = '<span class="tete"></span><span class="bois"></span>';
      allu.style.animationDelay = Math.min(i * 12, 400) + "ms";
      zone.appendChild(allu);
    }
  }

  /** Fait disparaître les n dernières allumettes avec animation puis appelle suite() */
  function animerRetrait(n, suite) {
    const monJeton = jeton;
    const zone = $("zone-allumettes");
    const presentes = Array.prototype.slice.call(zone.querySelectorAll(".allu:not(.retiree)"));
    const aRetirer = presentes.slice(presentes.length - n);
    aRetirer.forEach(function (el) { el.classList.add("retiree"); });
    setTimeout(function () {
      if (monJeton !== jeton) return;
      aRetirer.forEach(function (el) { el.remove(); });
      suite();
    }, DUREE_ANIMATION);
  }

  /* ---------- Informations affichées ---------- */

  function majCompteur() {
    const c = $("compteur-restantes");
    c.textContent = etat.restantes;
    c.classList.remove("pulse");
    void c.offsetWidth;            // relance l'animation
    c.classList.add("pulse");
    $("libelle-restantes").textContent = etat.restantes > 1 ? t("allumettes restantes") : t("allumette restante");
  }

  function majJoueurActif() {
    $("carte-j1").classList.toggle("active", etat.indexActif === 0);
    $("carte-j2").classList.toggle("active", etat.indexActif === 1);
  }

  /** Active/désactive les 3 boutons selon le verrou et le nombre d'allumettes restantes */
  function majBoutons() {
    document.querySelectorAll("[data-retrait]").forEach(function (b) {
      const n = Number(b.dataset.retrait);
      b.disabled = verrou || !Jeu.retraitValide(etat, n);
    });
  }

  function indicateur(texte, reflechit) {
    const el = $("indicateur-tour");
    el.textContent = texte;
    el.classList.toggle("reflechit", !!reflechit);
  }

  function ajouterHistorique(entree) {
    const li = document.createElement("li");
    const qui = document.createElement("strong");
    qui.textContent = entree.joueur;
    li.appendChild(qui);
    li.appendChild(document.createTextNode(
      t(entree.retire > 1 ? " retire {n} allumettes — reste : {r}" : " retire {n} allumette — reste : {r}",
        { n: entree.retire, r: entree.restantes })));
    const liste = $("liste-historique");
    liste.insertBefore(li, liste.firstChild);
    while (liste.children.length > NB_HISTORIQUE) liste.removeChild(liste.lastChild);
  }

  /* ---------- Déroulement des tours ---------- */

  /** Prépare le tour du joueur actif (humain : attend un clic ; machine : joue seule) */
  function lancerTour() {
    const joueur = Jeu.joueurActif(etat);
    majJoueurActif();
    if (joueur.type === "humain") {
      verrou = false;
      indicateur(t("À toi de jouer, {nom}.", { nom: joueur.nom }), false);
    } else {
      verrou = true;                 // le joueur ne peut rien faire pendant la machine
      indicateur(t("{nom} réfléchit", { nom: joueur.nom }), true);
      tourMachine(joueur);
    }
    majBoutons();
  }

  /** La machine attend un peu (effet "réflexion") puis joue */
  function tourMachine(joueur) {
    const monJeton = jeton;
    Son.reflexion();
    setTimeout(function () {
      if (monJeton !== jeton) return;
      const n = Machine.choisirCoup(joueur.type, etat.restantes);
      indicateur(joueur.nom + " retire " + n + (n > 1 ? " allumettes" : " allumette") + ".", false);
      jouerCoup(n);
    }, 1000 + Math.random() * 600);
  }

  /** Appelé par un clic sur un bouton "Retirer n" */
  function clicHumain(n) {
    if (verrou || !etat || etat.terminee) return;
    jouerCoup(n);
  }

  /** Applique un coup (humain ou machine) : logique -> affichage -> tour suivant */
  function jouerCoup(n) {
    if (!Jeu.retirer(etat, n)) return;
    verrou = true;
    majBoutons();
    ajouterHistorique(etat.historique[etat.historique.length - 1]);
    majCompteur();                   // mise à jour immédiate du nombre
    Son.retrait(n);
    const monJeton = jeton;
    animerRetrait(n, function () {
      if (etat.terminee) {
        setTimeout(function () { if (monJeton === jeton) afficherFin(); }, 500);
      } else {
        lancerTour();
      }
    });
  }

  /* ---------- Fin de partie ---------- */

  function afficherFin() {
    const g = etat.gagnant, p = etat.perdant;
    let badge = t("Partie terminée");
    if (config.mode !== "deux") badge = g.type === "humain" ? t("Victoire") : t("Défaite");
    $("fin-badge").textContent = badge;
    $("fin-titre").textContent = t("{nom} gagne !", { nom: g.nom });
    $("fin-detail").textContent = t("{nom} a retiré la dernière allumette et remporte la partie.", { nom: g.nom });
    $("fin-resume").textContent = t("{n} coups joués, {i} allumettes au départ.", { n: etat.historique.length, i: etat.initial });
    lancerBraises();
    if (config.mode !== "deux" && g.type !== "humain") Son.defaite(); else Son.victoire();
    window.afficherEcran("ecran-fin");
  }

  /** Petites braises qui montent (animation de fin) */
  function lancerBraises() {
    const zone = $("braises");
    zone.innerHTML = "";
    for (let i = 0; i < 22; i++) {
      const b = document.createElement("span");
      b.style.left = Math.random() * 100 + "%";
      b.style.animationDelay = Math.random() * 2.5 + "s";
      b.style.animationDuration = 3 + Math.random() * 3 + "s";
      zone.appendChild(b);
    }
  }

  return { demarrer, rejouer, annuler, clicHumain };
})();
