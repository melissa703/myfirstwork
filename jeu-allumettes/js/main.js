/* ==========================================================
   main.js - Navigation entre écrans, formulaire de configuration
   ========================================================== */

/** Affiche un seul écran et masque les autres */
function afficherEcran(idEcran) {
  const cible = document.getElementById(idEcran);
  if (!cible) { console.error("Écran introuvable : " + idEcran); return; }
  if (idEcran !== "ecran-jeu" && idEcran !== "ecran-fin") UI.annuler(); // quitte la partie : on stoppe les timers
  document.querySelectorAll(".ecran").forEach(function (e) { e.classList.remove("actif"); });
  cible.classList.add("actif");
  window.scrollTo(0, 0);
}

/* ---------- Son : bouton muet + petit clic sur les boutons ---------- */
function majBoutonSon() {
  const actif = Son.estActif();
  const b = document.getElementById("btn-son");
  b.setAttribute("aria-pressed", String(actif));
  b.setAttribute("aria-label", actif ? t("Couper le son") : t("Activer le son"));
  document.getElementById("btn-son-icone").textContent = actif ? "🔊" : "🔇";
  document.getElementById("btn-son-texte").textContent = actif ? t("Son") : t("Muet");
}
document.getElementById("btn-son").addEventListener("click", function () { Son.basculer(); majBoutonSon(); });
majBoutonSon();

/* Clic sonore sur tous les boutons du jeu (sauf le bouton son et les retraits, qui ont leur propre son) */
document.addEventListener("click", function (e) {
  const b = e.target.closest("button");
  if (!b || b.id === "btn-son" || b.disabled || b.hasAttribute("data-retrait") || b.id === "btn-commencer" || b.id === "btn-rejouer") return;
  Son.clic();
});

/* ---------- Boutons de navigation (data-aller) ---------- */
document.querySelectorAll("[data-aller]").forEach(function (bouton) {
  bouton.addEventListener("click", function () { afficherEcran(bouton.dataset.aller); });
});

/* ---------- Configuration de la partie ---------- */
const champNb = document.getElementById("nb-allumettes");
const champNom1 = document.getElementById("champ-nom1-saisie");
const champNom2 = document.getElementById("champ-nom2-saisie");
const erreur = document.getElementById("erreur-config");

function modeChoisi() { return document.querySelector('input[name="mode"]:checked').value; }

/** Affiche/masque le second nom selon le mode */
function majFormulaire() {
  const deux = modeChoisi() === "deux";
  document.getElementById("champ-nom2").hidden = !deux;
  document.getElementById("label-nom1").textContent = deux ? t("Nom du joueur 1") : t("Ton nom");
}
document.querySelectorAll('input[name="mode"]').forEach(function (r) { r.addEventListener("change", majFormulaire); });
document.querySelectorAll("[data-nb]").forEach(function (b) {
  b.addEventListener("click", function () { champNb.value = b.dataset.nb; erreur.textContent = ""; });
});
majFormulaire();

/** Vérifie les champs ; renvoie la config ou null (avec message d'erreur) */
function lireConfiguration() {
  const nb = Number(champNb.value);
  if (champNb.value.trim() === "" || !Number.isInteger(nb) || nb < 1 || nb > Jeu.MAX_ALLUMETTES) {
    erreur.textContent = t("Entre un nombre entier d'allumettes entre 1 et {max}.", { max: Jeu.MAX_ALLUMETTES });
    return null;
  }
  const mode = modeChoisi();
  const nom1 = champNom1.value.trim();
  const nom2 = champNom2.value.trim();
  let joueurs;
  if (mode === "deux") {
    if (!nom1 || !nom2) { erreur.textContent = t("Saisis un nom pour chaque joueur."); return null; }
    if (nom1.toLowerCase() === nom2.toLowerCase()) { erreur.textContent = t("Les deux joueurs doivent avoir des noms différents."); return null; }
    joueurs = [{ nom: nom1, type: "humain" }, { nom: nom2, type: "humain" }];
  } else {
    if (!nom1) { erreur.textContent = t("Saisis ton nom."); return null; }
    const machine = mode === "ia"
      ? { nom: t("L'IA"), type: "ia" }
      : { nom: t("La machine"), type: "aleatoire" };
    if (nom1.toLowerCase() === machine.nom.toLowerCase()) { erreur.textContent = t("Choisis un autre nom."); return null; }
    joueurs = [{ nom: nom1, type: "humain" }, machine];
  }
  erreur.textContent = "";
  return { nb: nb, mode: mode, joueurs: joueurs };
}

document.getElementById("btn-commencer").addEventListener("click", function () {
  const cfg = lireConfiguration();
  if (!cfg) return;
  UI.demarrer(cfg);
  afficherEcran("ecran-jeu");
});

/* ---------- Plateau : boutons de retrait ---------- */
document.querySelectorAll("[data-retrait]").forEach(function (b) {
  b.addEventListener("click", function () { UI.clicHumain(Number(b.dataset.retrait)); });
});

/* ---------- Fin de partie ---------- */
document.getElementById("btn-rejouer").addEventListener("click", function () {
  UI.rejouer();
  afficherEcran("ecran-jeu");
});
