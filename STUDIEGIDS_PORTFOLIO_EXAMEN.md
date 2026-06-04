# BITQUIZ — Studiegids Portfolio-examen

> **Hoe gebruik je dit document?**
> Lees elke sectie één keer rustig door. Sluit het dan en probeer het uit je hoofd te vertellen. Open het weer, check wat je miste, en herhaal. Na 2–3 rondes ken je het.

---

## 1. Wat is BITQUIZ en wat doet het?

BITQUIZ is een **single-page webapplicatie** (SPA). Dat betekent: er is maar **één HTML-pagina** (`index.html`). De app laadt nooit een nieuwe pagina — JavaScript wisselt de inhoud van één element (`<main id="app">`) steeds opnieuw in. Hierdoor voelt het als een snelle app in plaats van een gewone website.

**Wat kan de gebruiker doen?**
- Standaard quizzes spelen (Amsterdam, Rembrandt, WO2)
- Eigen quizzes maken en opslaan
- Een quiz importeren via een JSON-bestand
- Scores bekijken op het leaderboard

---

## 2. De bestandsstructuur — wat zit waar?

```
index.html          → de enige HTML-pagina: structuur, navigatie, templates en script-links
css/
  style.css         → alle opmaak (kleuren, layout, animaties)
js/
  quizzes.js        → de ingebakken quizdata (DEFAULT_QUIZZES array)
  storage.js        → lees/schrijf functies voor localStorage
  helpers.js        → losse hulpfuncties (renderTemplate, formatTime, escapeHtml, ...)
  app.js            → globale state, router (navigate), initialisatie
  views/
    home.js         → renderHome() — het startscherm met quiz-kaarten
    play.js         → renderPlay(), showQuestion(), onSelect(), onNext()
    result.js       → renderResult() — score en feedback
    create.js       → renderCreate() — quiz aanmaken
    leaderboard.js  → renderLeaderboard() — topscores
    import.js       → renderImport() — JSON-bestand uploaden
```

**De laadvolgorde is cruciaal.** Onderaan `index.html` staan de `<script>` tags in deze vaste volgorde:

```
quizzes.js  →  storage.js  →  helpers.js  →  views/*.js  →  app.js
```

Waarom? Elk bestand gebruikt functies van het bestand ervóór. `app.js` laadt als laatste omdat die alles samenvoegt. Als je de volgorde omdraait, crasht de app met "function is not defined".

---

## 3. Hoe start de app op? (app.js)

Helemaal onderaan `app.js` staat de **initialisatie**:

```js
try {
  refreshQuizList();  // vul allQuizzes met standaard + eigen quizzes
  navigate('home');   // toon het startscherm
} catch (err) {
  // toon de foutmelding op het scherm als er iets mis gaat
}
```

**Stap voor stap:**

1. `refreshQuizList()` wordt aangeroepen. Dit combineert `DEFAULT_QUIZZES` (uit `quizzes.js`) met eigen quizzes uit `localStorage` en stopt alles in de globale variabele `allQuizzes`.
2. `navigate('home')` wordt aangeroepen. De router tekent het startscherm.

**De drie globale variabelen in app.js:**

| Variabele | Wat het is |
|---|---|
| `allQuizzes` | Array met alle quiz-objecten (standaard + eigen) |
| `playState` | Object met alle data van de lopende quiz (of `null` als er geen quiz speelt) |
| `timerInterval` | De ID van de lopende timer (of `null`) — nodig om de timer te stoppen |

---

## 4. Hoe werken de HTML-templates?

In `index.html` staan meerdere `<template>` elementen:

```html
<template id="tpl-home">  ...inhoud van het startscherm... </template>
<template id="tpl-play">  ...inhoud van het speelscherm... </template>
<template id="tpl-result"> ...inhoud van het resultaatscherm... </template>
```

Een `<template>` wordt **niet gerenderd** door de browser. De inhoud slaapt totdat JavaScript het wakker maakt.

De functie `renderTemplate(id)` in `helpers.js` doet dit:

```js
function renderTemplate(id) {
  const app = document.getElementById('app');
  app.innerHTML = '';                        // leeg het scherm
  const tpl = document.getElementById(id);   // zoek de template op id
  app.appendChild(tpl.content.cloneNode(true)); // kopieer de inhoud naar #app
}
```

**cloneNode(true)** — het woord `true` is belangrijk: het betekent "kopieer ook alle kinderen" (een diepe kopie). Zonder `true` kopieer je alleen het lege omhulsel.

---

## 5. De router — navigate()

De router is het hart van de app. Elke keer dat je op een knop of link klikt, wordt `navigate()` aangeroepen.

```js
const routes = {
  home:        renderHome,
  play:        renderPlay,
  result:      renderResult,
  create:      renderCreate,
  leaderboard: renderLeaderboard,
  import:      renderImport
};

function navigate(route, params = {}) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  currentRoute = route;
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.route === route));
  (routes[route] || renderHome)(params);
  if (navEl.classList.contains('open')) navEl.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**Wat doet navigate() precies?**
1. Stopt de timer als die loopt (zodat je niet twee timers tegelijk hebt)
2. Slaat de huidige route op in `currentRoute`
3. Markeert de juiste navigatielink als actief (gele streep/kleur)
4. Roept de juiste render-functie aan (bijv. `renderPlay(params)`)
5. Sluit het mobiele menu als het open stond
6. Scrolt soepel naar de bovenkant

**Voorbeeld:** Als je op een quiz-kaart klikt:
```js
navigate('play', { quizId: 'amsterdam-feitjes' })
// → roept renderPlay({ quizId: 'amsterdam-feitjes' }) aan
```

**Hoe zijn de nav-links gekoppeld aan de router?**

```js
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();             // voorkom dat de browser de href="#" volgt
    navigate(link.dataset.route);   // lees data-route="home" en navigeer
  });
});
```

`e.preventDefault()` — zonder dit zou de browser de pagina herladen bij een klik op een link.

---

## 6. Hoe wordt een quiz ingeladen? — renderPlay()

Dit is waarschijnlijk de meest gestelde examenvraag.

### Stap 1: De juiste quiz opzoeken

```js
function renderPlay({ quizId }) {
  refreshQuizList();
  const quiz = allQuizzes.find(q => q.id === quizId);
  if (!quiz) { navigate('home'); return; }
```

- `{ quizId }` is **destructuring**: JavaScript haalt automatisch de eigenschap `quizId` uit het meegegeven object.
- `.find()` doorzoekt de array en geeft het eerste object terug waarvoor de functie `true` geeft.
- Als de quiz niet gevonden wordt (`!quiz` is `true`), gaat de app terug naar home.

### Stap 2: Het scherm laden en de state instellen

```js
  renderTemplate('tpl-play');   // laad het play-scherm in #app

  playState = {
    quiz,           // het quiz-object
    idx: 0,         // beginnen bij vraag 0 (de eerste)
    selected: null, // nog geen antwoord gekozen
    answers: [],    // hier komen de gegeven antwoorden in
    seconds: 0,     // timer begint op 0
    score: 0        // score begint op 0
  };
```

`playState` is de **globale variabele** die alle informatie over de lopende quiz bijhoudt. Door het globaal te maken kunnen alle view-bestanden erbij.

### Stap 3: De timer starten

```js
  timerInterval = setInterval(() => {
    playState.seconds++;
    document.getElementById('timerValue').textContent = formatTime(playState.seconds);
  }, 1000);
```

`setInterval` voert een functie elke X milliseconden uit. Hier elke **1000ms = 1 seconde**. De functie telt `seconds` op met 1 en updatet de klok op het scherm via `formatTime()`.

De ID van de timer wordt opgeslagen in `timerInterval` zodat we hem later kunnen stoppen met `clearInterval(timerInterval)`.

### Stap 4: De eerste vraag tonen

```js
  showQuestion();
```

---

## 7. Hoe wordt een vraag getoond? — showQuestion()

```js
function showQuestion() {
  const { quiz, idx } = playState;
  const q     = quiz.questions[idx];    // haal de huidige vraag op
  const total = quiz.questions.length;  // totaal aantal vragen

  // tekst en voortgangsbalk instellen...
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('qCount').textContent = `Vraag ${idx + 1} van ${total}`;

  const pct = Math.round((idx / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';

  // antwoordknoppen bouwen
  const wrap = document.getElementById('answers');
  wrap.innerHTML = '';  // verwijder vorige knoppen
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  q.answers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(ans)}</span>`;
    btn.addEventListener('click', () => onSelect(i, btn));
    wrap.appendChild(btn);
  });

  playState.selected = null;         // reset: nog geen antwoord
  document.getElementById('nextBtn').disabled = true;  // knop uitschakelen
  document.getElementById('nextBtn').textContent =
    (idx === total - 1) ? 'Afronden ✓' : 'Volgende →';  // laatste vraag? andere tekst
}
```

**Waarom `idx + 1`?** Arrays in JavaScript beginnen bij index 0. De gebruiker verwacht "Vraag 1", niet "Vraag 0". Door 1 op te tellen zet je de computerlogica om naar menselijke logica.

**Waarom `idx === total - 1` voor de laatste vraag?** Als er 10 vragen zijn, is de laatste op index 9 (0-gebaseerd). `total - 1 = 10 - 1 = 9`. Als `idx === 9` is dit de laatste vraag.

---

## 8. Hoe werkt een antwoord kiezen? — onSelect()

```js
function onSelect(i, btn) {
  playState.selected = i;  // sla de gekozen index op in de state
  document.querySelectorAll('.answer').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');   // markeer de geklikte knop geel
  document.getElementById('nextBtn').disabled = false;  // activeer de volgende-knop
}
```

**Waarom eerst alle 'selected' verwijderen?** Zo kan de gebruiker van antwoord wisselen. Eerst worden alle knoppen gereset, dan krijgt alleen de laatste klik de markering.

---

## 9. Hoe werkt de volgende vraag? — onNext()

```js
function onNext() {
  const { quiz, idx, selected } = playState;
  const correctIdx = quiz.questions[idx].correct;
  const isCorrect  = selected === correctIdx;
  if (isCorrect) playState.score++;

  playState.answers.push({
    question: quiz.questions[idx].question,
    selected,
    correct: correctIdx,
    answers: quiz.questions[idx].answers,
    isCorrect
  });

  if (idx + 1 >= quiz.questions.length) {
    clearInterval(timerInterval);  // stop de timer
    timerInterval = null;
    navigate('result');            // ga naar het resultaatscherm
  } else {
    playState.idx++;    // volgende vraag
    showQuestion();
  }
}
```

**De logica:**
1. Vergelijk het gekozen antwoord (`selected`) met het juiste antwoord (`correct`)
2. Als het goed is: score + 1
3. Sla het antwoord op in `playState.answers` (voor de feedback achteraf)
4. Is dit de laatste vraag? → stop timer, ga naar result
5. Zo niet? → `idx++` en toon de volgende vraag

---

## 10. De opslag — storage.js en localStorage

`localStorage` is een **sleutel-waarden opslag in de browser** die blijft bestaan na sluiten. Het kan alleen tekst opslaan, geen objecten. Daarom gebruiken we `JSON.stringify` (object → tekst) en `JSON.parse` (tekst → object).

```js
// Lezen:
function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem('qm_custom_quizzes')) || [];
  } catch {
    return [];  // als de opgeslagen JSON kapot is, geef een lege array
  }
}

// Schrijven:
function saveCustom(list) {
  localStorage.setItem('qm_custom_quizzes', JSON.stringify(list));
}
```

**Twee sleutels:**
- `'qm_custom_quizzes'` — de eigen quizzes (array van quiz-objecten)
- `'qm_scores'` — de leaderboard-scores (object met quiz-id als sleutel)

**Waarom try/catch?** Als de localStorage vol is of de opgeslagen data corrupt is, geeft `JSON.parse` een fout. Met `try/catch` vangt de app die fout op en geeft een lege waarde terug in plaats van te crashen.

---

## 11. Hulpfuncties — helpers.js

| Functie | Wat het doet |
|---|---|
| `renderTemplate(id)` | Klont een `<template>` en plaatst het in `#app` |
| `$(sel)` | Snelle `document.querySelector()` afkorting |
| `$$(sel)` | Snelle `document.querySelectorAll()` die een echte array geeft |
| `estimatedDuration(quiz)` | Berekent schatting: `vragen × 15 sec`, omgezet naar minuten |
| `formatTime(sec)` | Zet seconden om naar `"mm:ss"` (bijv. 155 → `"02:35"`) |
| `escapeHtml(str)` | Vervang `<`, `>`, `&`, `"`, `'` door HTML-entiteiten (veiligheid) |
| `buildSvgImage(theme, emoji)` | Bouwt een SVG-afbeelding met thema-kleuren en emoji als tekst |
| `renderQuestionImage(container, question, theme)` | Plaatst een echte foto of SVG-fallback in een container |

**Waarom escapeHtml?** Als een quizvraag de tekst `<script>alert('hack')</script>` bevat, zou dat zonder escaping als HTML uitgevoerd worden. Met `escapeHtml` wordt het omgezet naar veilige tekst die letterlijk getoond wordt.

---

## 12. De datastructuur van een quiz (quizzes.js)

```js
var DEFAULT_QUIZZES = [
  {
    id: 'amsterdam-feitjes',      // unieke string-identifier
    title: 'Amsterdam Feitjes',   // zichtbare naam
    description: 'Hoeveel weet jij...', // korte uitleg
    emoji: '🏛️',                  // emoji op de kaart
    theme: 'amsterdam',           // kleurthema (zie THEMES in helpers.js)
    questions: [
      {
        question: 'Hoeveel grachten heeft Amsterdam?',
        answers: ['25', '75', '165', '300'],  // array van 4 opties
        correct: 2,                            // INDEX van het juiste antwoord (0-gebaseerd!)
        image: '🚣',                           // emoji voor de SVG
        imageUrl: 'https://...'                // echte foto (optioneel)
      }
    ]
  }
];
```

`correct: 2` betekent dat `answers[2]` het juiste antwoord is. Dat is `'165'` (tellen: 0='25', 1='75', 2='165', 3='300').

---

## 13. De preloader

Bij het opstarten is er een animerende preloader zichtbaar met de letters B-I-T-? en laadstipjes. Na 1,9 seconden verdwijnt die:

```js
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader && preloader.classList.add('hide'), 1900);
});
```

- `window.addEventListener('load', ...)` wacht tot de **hele pagina** geladen is (inclusief scripts en afbeeldingen)
- `setTimeout(..., 1900)` wacht nog eens 1,9 seconden zodat de animatie afgespeeld wordt
- `preloader && ...` — dubbele controle: doe dit alleen als het element bestaat (veiligheid)
- `.classList.add('hide')` — CSS verbergt de preloader via de klasse `'hide'`

---

## 14. Veelgestelde examenvragen — met antwoord

**"Laat me het stukje zien hoe je ervoor zorgt dat de quiz wordt ingeladen."**

Antwoord: "Dat begint in `home.js` bij de quiz-kaarten. Elke kaart heeft een click-listener:
```js
card.addEventListener('click', () => navigate('play', { quizId: q.id }));
```
Die roept `navigate()` aan in `app.js`. Die kijkt in het `routes`-object en roept `renderPlay({ quizId })` aan in `play.js`. Daar zoekt `.find()` de quiz op in `allQuizzes`, laadt `renderTemplate('tpl-play')` het scherm, vult `playState` met de startdata, start `setInterval` de timer, en roept `showQuestion()` de eerste vraag op."

---

**"Waarom gebruik je templates in de HTML?"**

Antwoord: "Templates zijn stukken HTML die de browser niet rendert. Ze zitten 'slapend' in de pagina. Met `cloneNode(true)` kopieer ik de inhoud en plak ik die in `#app`. Zo hoef ik niet alle HTML via JavaScript te schrijven als één grote string — de structuur staat al netjes in de HTML."

---

**"Wat is localStorage en waarom gebruik je het?"**

Antwoord: "localStorage is een opslagplaats in de browser die blijft bestaan ook als je de pagina sluit of herlaadt. Ik gebruik het voor twee dingen: eigen quizzes opslaan (zodat ze niet verdwijnen na sluiten) en leaderboard-scores bewaren. Omdat localStorage alleen tekst kan opslaan, gebruik ik `JSON.stringify` om een object naar tekst te zetten, en `JSON.parse` om het weer terug te zetten naar een object."

---

**"Wat is een SPA (single-page application) en hoe werkt dat in jouw project?"**

Antwoord: "Een SPA heeft maar één HTML-pagina. In mijn project is dat `index.html`. Er is nooit een echte pagina-verversing. De router in `app.js` — de `navigate()` functie — wisselt de inhoud van `<main id="app">` steeds in via JavaScript. Dit maakt de app sneller en soepeler want de browser hoeft niet steeds opnieuw een pagina te laden."

---

**"Waarom laad je de script-bestanden in die volgorde?"**

Antwoord: "Elk bestand gebruikt functies van het bestand ervóór. `quizzes.js` moet als eerste geladen zijn omdat `storage.js` en `app.js` de quiz-data nodig hebben. `helpers.js` moet voor de views geladen zijn omdat alle views `renderTemplate` en `escapeHtml` gebruiken. `app.js` laadt als laatste omdat het alle view-functies (`renderHome`, `renderPlay`, enz.) in het `routes`-object stopt — die moeten dus al bestaan."

---

**"Hoe werkt de voortgangsbalk?"**

Antwoord: "In `showQuestion()` bereken ik het percentage voltooide vragen:
```js
const pct = Math.round((idx / total) * 100);
document.getElementById('progressFill').style.width = pct + '%';
```
`idx` is de huidige vraagindex (0-gebaseerd). Door te delen door `total` en met 100 te vermenigvuldigen krijg je een percentage. Dat stel ik in als de breedte van de `.progress-fill` div — CSS doet de rest."

---

**"Hoe weet de app of een antwoord goed of fout is?"**

Antwoord: "In het quiz-object heeft elke vraag een `correct` eigenschap — dat is het indexnummer van het juiste antwoord. In `onNext()` vergelijk ik dat met `playState.selected`, het indexnummer dat de gebruiker gekozen heeft:
```js
const isCorrect = selected === correctIdx;
```
Als ze gelijk zijn is `isCorrect` `true` en telt de score op met 1."

---

**"Hoe zorg je dat de timer stopt als je de quiz verlaat?"**

Antwoord: "De timer-ID wordt opgeslagen in de globale variabele `timerInterval`. Elke keer dat `navigate()` aangeroepen wordt, kijkt het eerst of `timerInterval` niet `null` is. Als er een timer loopt, stopt het die met `clearInterval(timerInterval)` en zet het `timerInterval = null`. Zo loopt er nooit twee timers tegelijk."

---

**"Wat doet escapeHtml en waarom is het nodig?"**

Antwoord: "escapeHtml vervangt gevaarlijke HTML-tekens door hun veilige alternatieven. Bijvoorbeeld `<` wordt `&lt;` en `>` wordt `&gt;`. Als ik dit niet doe en een quiz-vraag bevat HTML-code, zou de browser die uitvoeren. Met escapeHtml wordt het als gewone tekst getoond. Het is een basisveiligheidsmaatregel tegen XSS (cross-site scripting)."

---

## 15. Snel overzicht — de volledige spelstroom

```
Gebruiker klapt de app open
   ↓
index.html laadt alle scripts in volgorde
   ↓
app.js: refreshQuizList() + navigate('home')
   ↓
home.js: renderHome() → quiz-kaarten worden getekend
   ↓
Gebruiker klikt op een kaart
   ↓
navigate('play', { quizId: '...' })
   ↓
play.js: renderPlay() → zoek quiz, laad template, stel playState in, start timer
   ↓
showQuestion() → tekent vraag + antwoordknoppen
   ↓
Gebruiker klikt op antwoord → onSelect() → markeer knop, activeer volgende-knop
   ↓
Gebruiker klikt "Volgende" → onNext() → check antwoord, sla op, volgende vraag
   ↓
[herhaal showQuestion / onSelect / onNext per vraag]
   ↓
Laatste vraag beantwoord → stop timer → navigate('result')
   ↓
result.js: renderResult() → toon score, feedback, opslaan-knop
   ↓
Optioneel: score opslaan → saveScores() → localStorage
```
