// ============================================================
// helpers.js — losse hulpfuncties die overal in de app gebruikt worden
// ============================================================

// --- Template in #app plaatsen ---
function renderTemplate(id) {
  const app = document.getElementById('app'); // zoekt het hoofdelement op waar elk scherm in geplaatst wordt
  app.innerHTML = ''; // leegt het scherm zodat het vorige scherm verdwijnt voordat het nieuwe geladen wordt
  const tpl = document.getElementById(id); // zoekt de template op met het opgegeven id, bijvoorbeeld 'tpl-home' of 'tpl-play'
  app.appendChild(tpl.content.cloneNode(true)); // maakt een volledige kopie van de template-inhoud en plaatst die in het hoofdelement zodat het scherm zichtbaar wordt
}

// --- Schatting van speelduur op basis van aantal vragen ---
function estimatedDuration(quiz) {
  const seconds = quiz.questions.length * 15; // schat 15 seconden per vraag om de totale speelduur te berekenen
  const min = Math.ceil(seconds / 60); // zet de seconden om naar minuten en rondt naar boven af zodat het altijd een heel getal is
  return `${min} min`; // geeft de geschatte speeltijd terug als leesbare tekst, bijvoorbeeld "3 min"
}

// --- Seconden omzetten naar mm:ss weergave ---
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0'); // berekent het aantal volledige minuten en vult aan met een nul zodat het altijd twee cijfers zijn, bijvoorbeeld "02"
  const s = (sec % 60).toString().padStart(2, '0'); // berekent de resterende seconden na de minuten en vult aan met een nul zodat het altijd twee cijfers zijn, bijvoorbeeld "35"
  return `${m}:${s}`; // geeft de tijd terug in het formaat "mm:ss" zodat de klok op het scherm leesbaar is, bijvoorbeeld "02:35"
}

// --- HTML-tekens escapen zodat gebruikersinvoer veilig getoond kan worden ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')   // vervangt het teken & door &amp; zodat de browser het letterlijk toont en niet als HTML-code leest
    .replace(/</g, '&lt;')    // vervangt het teken < door &lt; zodat de browser het niet als het begin van een HTML-tag ziet
    .replace(/>/g, '&gt;')    // vervangt het teken > door &gt; zodat de browser het niet als het einde van een HTML-tag ziet
    .replace(/"/g, '&quot;')  // vervangt het teken " door &quot; zodat het een HTML-attribuut niet per ongeluk afsluit
    .replace(/'/g, '&#39;');  // vervangt het teken ' door &#39; zodat het geen problemen geeft in HTML-attributen
}

// --- HTML-tekens escapen voor gebruik als waarde in een HTML-attribuut ---
function escapeAttr(str) {
  return String(str)
    .replace(/"/g, '&quot;') // vervangt " door &quot; zodat het attribuut niet vroegtijdig afgesloten wordt
    .replace(/</g, '&lt;');  // vervangt < door &lt; zodat er geen ongewenste HTML-code in het attribuut terechtkomt
}

// --- Kleurthema's voor de SVG-kaarten ---
// Elk nieuw quiz-thema heeft hier zijn eigen regel nodig: buildSvgImage() zoekt het thema
// op via THEMES[theme] en valt terug op 'amsterdam' als de naam niet bestaat.
var THEMES = {
  amsterdam:  { bg: '#FFEB00', dot: '#0F1419', accent: '#0F1419', shape: '#F2D900' }, // geel thema voor de Amsterdam-quiz
  rembrandt:  { bg: '#4F7CF5', dot: '#FFEB00', accent: '#FFFFFF', shape: '#3B62D6' }, // blauw thema voor de Rembrandt-quiz
  ww2:        { bg: '#0F1419', dot: '#FFEB00', accent: '#FFEB00', shape: '#1F2532' }, // donker thema voor de WO2-quiz
  custom:     { bg: '#1FBC6E', dot: '#FFEB00', accent: '#FFFFFF', shape: '#18A35E' }, // groen thema voor eigen gemaakte quizzes
  history:    { bg: '#D97706', dot: '#1F2937', accent: '#FFFFFF', shape: '#B45309' }, // brons/amber thema voor Wereldgeschiedenis
  geography:  { bg: '#0EA5E9', dot: '#FFFFFF', accent: '#FFFFFF', shape: '#0284C7' }, // hemelsblauw thema voor Aardrijkskunde
  space:      { bg: '#1E1B4B', dot: '#FFEB00', accent: '#FFEB00', shape: '#312E81' }, // donker ruimteblauw thema voor Ruimtevaart
  science:    { bg: '#6366F1', dot: '#FFEB00', accent: '#FFFFFF', shape: '#4F46E5' }, // paars/indigo thema voor Wetenschap
  sport:      { bg: '#EF4444', dot: '#FFFFFF', accent: '#FFFFFF', shape: '#B91C1C' }, // rood thema voor Sport
  music:      { bg: '#EC4899', dot: '#FFFFFF', accent: '#FFFFFF', shape: '#BE185D' }, // roze thema voor Muziek
  film:       { bg: '#1F2937', dot: '#FBBF24', accent: '#FBBF24', shape: '#374151' }, // donker/goud thema voor Film & Hollywood
  tech:       { bg: '#06B6D4', dot: '#0F1419', accent: '#FFFFFF', shape: '#0891B2' }, // cyaan thema voor Technologie
  nature:     { bg: '#16A34A', dot: '#FFEB00', accent: '#FFFFFF', shape: '#15803D' }, // bosgroen thema voor Dieren & Natuur
  food:       { bg: '#F97316', dot: '#FFFFFF', accent: '#FFFFFF', shape: '#C2410C' }  // oranje thema voor Eten & Drinken
};

// --- Bouw een SVG-afbeelding met de kleuren van het thema en een emoji ---
function buildSvgImage(theme, emoji) {
  const t = THEMES[theme] || THEMES.amsterdam; // zoekt de kleurinstellingen op voor het opgegeven thema — als het thema niet bestaat valt het terug op het amsterdam-thema
  return `
    <svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="dots-${theme}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="${t.dot}" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="900" height="360" fill="${t.bg}"/>
      <rect width="900" height="360" fill="url(#dots-${theme})"/>
      <circle cx="120" cy="80" r="60" fill="${t.shape}" opacity="0.55"/>
      <circle cx="800" cy="290" r="90" fill="${t.shape}" opacity="0.45"/>
      <rect x="640" y="50" width="160" height="160" rx="28" fill="${t.shape}" opacity="0.35" transform="rotate(12 720 130)"/>
      <g transform="translate(450 180)">
        <circle r="92" fill="${t.accent}" opacity="0.95"/>
        <text x="0" y="22" text-anchor="middle" font-size="100" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${emoji}</text>
      </g>
    </svg>`; // geeft de volledige SVG terug als tekst met de thema-kleuren en de emoji verwerkt, zodat het als afbeelding op het scherm getoond kan worden
}

// --- Vier een perfecte score met een korte confetti-animatie ---
function fireConfetti() {
  const colors = ['#FFEB00', '#1FBC6E', '#4F7CF5', '#EF4444', '#EC4899']; // de kleuren die de vallende confetti-snippers mogen hebben, passend bij het kleurenpalet van de app
  const container = document.createElement('div'); // maakt een nieuwe container aan die over de hele pagina heen ligt
  container.className = 'confetti-layer'; // CSS zorgt dat deze laag "position: fixed" over alles heen ligt zonder klikken te blokkeren
  for (let i = 0; i < 60; i++) { // maakt 60 losse confetti-snippers aan
    const piece = document.createElement('span'); // elk snippertje is een eigen inline-element
    piece.className = 'confetti-piece'; // CSS regelt de vorm en de val-animatie
    piece.style.left = Math.random() * 100 + 'vw'; // Math.random() = willekeurig getal tussen 0 en 1 | * 100 = willekeurige positie tussen 0 en 100vw (volledige schermbreedte)
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]; // kiest willekeurig één van de vijf kleuren
    piece.style.animationDelay = (Math.random() * 0.6) + 's'; // laat de snippers niet allemaal precies gelijk beginnen te vallen, voor een natuurlijker effect
    piece.style.animationDuration = (2.2 + Math.random() * 1.4) + 's'; // elke snipper valt met een iets andere snelheid
    container.appendChild(piece); // voegt de snipper toe aan de confetti-laag
  }
  document.body.appendChild(container); // plaatst de hele confetti-laag op de pagina zodat de animatie zichtbaar wordt
  setTimeout(() => container.remove(), 3800); // verwijdert de confetti-laag na 3,8 seconden weer uit de pagina, zodat er geen onzichtbare elementen achterblijven
}

// --- Zet een afbeelding in een container, met SVG als reserveoptie ---
function renderQuestionImage(container, question, theme) {
  const emoji = question.image || '❓'; // gebruikt de emoji van de vraag als afbeelding, of een vraagteken als er geen emoji ingesteld is
  const svgFallback = buildSvgImage(theme || 'amsterdam', emoji); // bouwt alvast de SVG-afbeelding als reserveoptie voor het geval de echte foto niet laadt

  if (question.imageUrl) { // controleert of de vraag een URL naar een echte foto heeft
    const img = new Image(); // maakt een nieuw afbeelding-element aan in het geheugen zodat de foto geladen kan worden
    img.alt = ''; // de afbeelding is decoratief, de alt-tekst blijft leeg
    img.loading = 'lazy'; // instrueert de browser om de foto pas te laden als die in beeld komt zodat de pagina sneller is
    img.onerror = () => {
      container.innerHTML = svgFallback; // als de foto niet geladen kan worden toont het de SVG als vervanging zodat er altijd iets zichtbaar is
    };
    img.onload = () => {
      container.innerHTML = ''; // verwijdert de tijdelijke SVG zodra de echte foto geladen is
      container.appendChild(img); // plaatst de echte foto in de container zodat die zichtbaar wordt
    };
    container.innerHTML = svgFallback; // toont de SVG alvast terwijl de browser de echte foto nog aan het laden is
    img.src = question.imageUrl; // geeft de browser de URL van de foto zodat het laden gestart wordt
  } else {
    container.innerHTML = svgFallback; // als er geen foto-URL is toont het direct de SVG als afbeelding
  }
}
