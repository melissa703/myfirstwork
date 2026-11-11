/* ==========================================================
   ai.js - Choix des coups de la machine
   - Machine NAÏVE : totalement aléatoire (mode 2)
   - IA STRATÉGIQUE : bonus (mode 3)
   ========================================================== */
const Machine = (function () {
  const MAX = 3;

  /** Entier aléatoire entre 1 et min(3, restantes) */
  function coupAleatoire(restantes) {
    const max = Math.min(MAX, restantes);
    return 1 + Math.floor(Math.random() * max);
  }

  /**
   * IA : comme celui qui prend la dernière allumette gagne, la position
   * gagnante est de laisser à l'adversaire 0, 4, 8, 12... allumettes
   * (un multiple de 4). On retire donc restantes mod 4. Si ce reste
   * vaut 0, on est en position perdante : on joue au hasard en espérant
   * une erreur.
   */
  function coupStrategique(restantes) {
    const n = restantes % 4;
    return n === 0 ? coupAleatoire(restantes) : n;
  }

  /** type : "aleatoire" ou "ia" */
  function choisirCoup(type, restantes) {
    return type === "ia" ? coupStrategique(restantes) : coupAleatoire(restantes);
  }

  return { coupAleatoire, coupStrategique, choisirCoup };
})();

if (typeof module !== "undefined") module.exports = Machine;
