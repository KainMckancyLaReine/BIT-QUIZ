// ============================================================
// storage.js — alles wat met localStorage te maken heeft
// localStorage = opslag in de browser die blijft bestaan
//               ook als je de pagina herlaadt of sluit.
// ============================================================

var STORAGE_KEYS = {
  CUSTOM: 'qm_custom_quizzes', // dit is de naam waarmee eigen quizzes worden opgeslagen in de browser
  SCORES: 'qm_scores',         // dit is de naam waarmee de leaderboard-scores worden opgeslagen in de browser
  THEME:  'qm_theme'           // dit is de naam waarmee de gekozen kleurmodus (licht/donker) wordt opgeslagen
};

// --- Eigen quizzes ophalen uit de browser ---
function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM)) || []; // leest de opgeslagen quizzes op uit de browser en zet ze om van tekst naar een JavaScript-array zodat de app er mee kan werken — als er niets opgeslagen is geeft het een lege lijst terug
  } catch {
    return []; // als de opgeslagen data kapot of onleesbaar is, geeft het een lege lijst terug zodat de app niet crasht
  }
}

// --- Eigen quizzes opslaan in de browser ---
function saveCustom(list) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(list)); // zet de lijst van eigen quizzes om naar tekst en slaat die op in de browser — hierdoor blijven de quizzes bewaard ook als je de pagina sluit
}

// --- Scores ophalen uit de browser ---
function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES)) || {}; // leest de opgeslagen scores op uit de browser en zet ze om van tekst naar een JavaScript-object zodat de app er mee kan werken — als er geen scores zijn geeft het een leeg object terug
  } catch {
    return {}; // als de opgeslagen scores-data kapot is, geeft het een leeg object terug zodat de app niet crasht
  }
}

// --- Scores opslaan in de browser ---
function saveScores(obj) {
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(obj)); // zet het scores-object om naar tekst en slaat het permanent op in de browser — dit is de regel die de score écht bewaart zodat hij zichtbaar is in het leaderboard
}

// --- Kleurmodus (licht/donker) ophalen uit de browser ---
function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light'; // geeft 'light' terug als er nog nooit een keuze opgeslagen is, zodat de app altijd een geldige waarde heeft
}

// --- Kleurmodus opslaan in de browser ---
function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme); // slaat 'light' of 'dark' op zodat de keuze onthouden wordt bij een volgend bezoek
}
