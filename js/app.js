// ============================================================
// app.js — startpunt van de app: globale data, router en initialisatie
// Dit bestand laadt als laatste zodat alle andere bestanden al beschikbaar zijn.
// ============================================================

// --- Globale variabelen die door alle bestanden gebruikt worden ---
var allQuizzes    = []; // hier worden straks alle quizzes in opgeslagen, zowel de standaard als de eigen quizzes
var playState     = null; // houdt bij wat er gaande is tijdens een actieve quiz — is leeg als er geen quiz speelt
var timerInterval = null; // slaat de timer op zodat die later gestopt kan worden als de gebruiker van scherm wisselt

// --- Zoek de vaste elementen op die de app altijd nodig heeft ---
const appEl      = document.getElementById('app'); // zoekt het hoofdelement op — hier wordt elk scherm ingeladen
const navLinks   = document.querySelectorAll('.nav-link'); // zoekt alle navigatielinks op zodat ze later klikbaar gemaakt kunnen worden
const menuToggle = document.getElementById('menuToggle'); // zoekt de hamburgerknop op voor het mobiele menu
const navEl      = document.querySelector('.nav'); // zoekt de navigatiebalk op zodat die geopend en gesloten kan worden
const themeToggle = document.getElementById('themeToggle'); // zoekt de knop op waarmee de gebruiker tussen licht en donker kan wisselen

// --- Donkere modus toepassen en onthouden ---
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme; // zet data-theme="dark" of "light" op <html>, de CSS in style.css reageert hierop via [data-theme="dark"] selectors
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; // toont een zon-icoon als je NAAR licht kan wisselen, en een maan-icoon als je NAAR donker kan wisselen
  saveTheme(theme); // onthoudt de keuze zodat die blijft staan bij een volgend bezoek
}
applyTheme(loadTheme()); // past bij het opstarten meteen de eerder gekozen kleurmodus toe (of 'light' als er nog niets gekozen is)

if (themeToggle) {
  themeToggle.addEventListener('click', () => { // luistert naar de klik op de knop
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; // bepaalt de tegenovergestelde modus van de huidige
    applyTheme(next); // wisselt naar die tegenovergestelde modus
  });
}

// --- Verberg de preloader nadat de pagina volledig geladen is ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader'); // zoekt de preloader op zodat die verborgen kan worden
  setTimeout(() => preloader && preloader.classList.add('hide'), 1900); // verbergt de preloader na 1,9 seconden zodat de animatie eerst volledig afgespeeld wordt
});

// --- Combineer de standaard quizzes met de eigen opgeslagen quizzes ---
function refreshQuizList() {
  const custom = loadCustom().map(q => ({ ...q, _custom: true, theme: q.theme || 'custom' })); // haalt de eigen quizzes op uit de browser en markeert ze als eigen quiz zodat er later een badge op getoond kan worden
  allQuizzes = [...DEFAULT_QUIZZES, ...custom]; // voegt de standaard quizzes en de eigen quizzes samen in één lijst — dit is de regel die alle quizzes inlaadt zodat ze op het startscherm getoond kunnen worden
}

// ============================================================
// ROUTER — koppelt scherm-namen aan de functies die ze tekenen
// ============================================================
const routes = {
  home:        renderHome,        // als er naar 'home' genavigeerd wordt roept de router renderHome() aan
  play:        renderPlay,        // als er naar 'play' genavigeerd wordt roept de router renderPlay() aan
  result:      renderResult,      // als er naar 'result' genavigeerd wordt roept de router renderResult() aan
  create:      renderCreate,      // als er naar 'create' genavigeerd wordt roept de router renderCreate() aan
  leaderboard: renderLeaderboard, // als er naar 'leaderboard' genavigeerd wordt roept de router renderLeaderboard() aan
  import:      renderImport,      // als er naar 'import' genavigeerd wordt roept de router renderImport() aan
  stats:       renderStats        // als er naar 'stats' genavigeerd wordt roept de router renderStats() aan
};

let currentRoute = 'home'; // houdt bij op welk scherm de gebruiker zich op dit moment bevindt

// --- Wissel van scherm zonder de pagina te herladen ---
function navigate(route, params = {}) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } // stopt de timer als die nog loopt zodat er nooit twee timers tegelijk actief zijn
  currentRoute = route; // slaat het huidige scherm op zodat de rest van de app weet waar de gebruiker is
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.route === route)); // markeert de juiste navigatielink als actief zodat de gebruiker ziet op welk scherm hij is
  (routes[route] || renderHome)(params); // zoekt de bijbehorende render-functie op en roept die aan zodat het juiste scherm getekend wordt — als de route niet bestaat valt het terug op het startscherm
  if (navEl.classList.contains('open')) navEl.classList.remove('open'); // sluit het mobiele menu als het nog open stond
  window.scrollTo({ top: 0, behavior: 'smooth' }); // scrollt soepel terug naar de bovenkant bij elk schermwissel
}

// --- Maak alle navigatielinks klikbaar ---
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // zorgt ervoor dat de browser de pagina niet herlaadt bij een klik op de link
    navigate(link.dataset.route); // leest welk scherm de link moet openen via het data-route attribuut en navigeert daarheen
  });
});

// --- Logo stuurt de gebruiker terug naar het startscherm ---
document.querySelector('.logo').addEventListener('click', (e) => {
  e.preventDefault(); // zorgt ervoor dat de pagina niet herlaadt bij een klik op het logo
  navigate('home'); // navigeert terug naar het startscherm
});

// --- Hamburgerknop opent of sluit het mobiele menu ---
menuToggle.addEventListener('click', () => navEl.classList.toggle('open')); // zet de klasse 'open' aan of uit zodat het menu verschijnt of verdwijnt op mobiel

// ============================================================
// INITIALISATIE — start de app op
// ============================================================
try {
  refreshQuizList(); // laadt alle quizzes in zodat ze beschikbaar zijn voor de rest van de app
  navigate('home'); // opent het startscherm zodat de gebruiker direct de quizzes ziet
} catch (err) {
  const appEl2 = document.getElementById('app');
  if (appEl2) appEl2.innerHTML = '<div style="padding:2rem;color:red;font-family:monospace;white-space:pre-wrap;font-size:14px;"><strong>FOUT BIJ OPSTARTEN:</strong>\n' + err.stack + '</div>'; // toont de foutmelding op het scherm als er iets mis gaat bij het opstarten zodat het duidelijk is wat er fout gaat
  throw err; // gooit de fout opnieuw zodat die ook zichtbaar is in de browser-console
}
