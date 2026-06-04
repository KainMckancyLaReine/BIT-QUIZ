# BITQUIZ — JavaScript Uitleg

Alles zo simpel mogelijk uitgelegd. Lees het rustig door en je snapt het.

---

## const, let, var — een doos met een naam

Stel je voor: je hebt een doos. Je schrijft een naam op die doos en stopt er iets in. Dat is een variabele.

**const** = de doos is verzegeld. Je mag er nooit iets anders in stoppen.
**let** = de doos mag je later leegmaken en iets anders insteken.
**var** = de oude versie van let. In BITQUIZ gebruikt voor dozen die alle bestanden mogen gebruiken.

---

### const in jouw code

```js
// app.js
const appEl    = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');
const routes   = { home: renderHome, play: renderPlay, result: renderResult };
```
→ `appEl` is altijd het `<main>` blok op de pagina. Nooit iets anders.
→ `navLinks` is altijd de lijst van navigatieknoppen.
→ `routes` is altijd het overzicht van welke functie bij welk scherm hoort.

```js
// play.js
const quiz       = allQuizzes.find(q => q.id === quizId);
const total      = quiz.questions.length;
const isCorrect  = selected === correctIdx;
const letters    = ['A', 'B', 'C', 'D', 'E', 'F'];
```
→ `quiz` is de gevonden quiz. Verandert niet meer tijdens het spelen.
→ `total` is het aantal vragen. Blijft altijd hetzelfde.
→ `isCorrect` is `true` of `false`. Wordt één keer berekend per vraag.

```js
// result.js
const { quiz, score, answers, seconds } = playState;
const total  = quiz.questions.length;
const pct    = Math.round((score / total) * 100);
```
→ `pct` is het scorepercentage. Bijv. 7 van 10 = 70.

```js
// helpers.js
const m = Math.floor(sec / 60).toString().padStart(2, '0');
const s = (sec % 60).toString().padStart(2, '0');
```
→ `m` zijn de minuten (bijv. `"02"`), `s` de seconden (bijv. `"35"`).

---

### let in jouw code

```js
// app.js
let currentRoute = 'home';
```
→ Begint als `'home'`. Verandert elke keer als je naar een ander scherm gaat.

```js
// result.js
let emoji = '🎉';
let title = 'Goed gedaan!';
if (pct === 100) { emoji = '🏆'; title = 'Perfect!'; }
else if (pct >= 80) { emoji = '🌟'; title = 'Indrukwekkend!'; }
```
→ `emoji` en `title` beginnen met een standaard waarde en worden daarna overschreven op basis van de score.

```js
// leaderboard.js
let body;
if (entries.length === 0) {
  body = '<p>Nog geen scores.</p>';
} else {
  body = '<table>...</table>';
}
```
→ `body` krijgt één van twee waardes afhankelijk van of er scores zijn.

---

### var in jouw code

```js
// app.js
var allQuizzes    = [];
var playState     = null;
var timerInterval = null;
```
→ `allQuizzes` — de lijst van alle quizzes. Elk bestand kan hierbij.
→ `playState` — alles over de lopende quiz (score, vraagnummer, antwoorden). Is `null` als er geen quiz speelt.
→ `timerInterval` — de lopende timer. Is `null` als er geen timer actief is.

```js
// helpers.js
var THEMES = {
  amsterdam: { bg: '#FFEB00', ... },
  custom:    { bg: '#1FBC6E', ... }
};
```
→ De kleuren per quiz-thema. Beschikbaar voor elk bestand.

---

## = het gelijkteken — stoppen in een doos

`=` betekent: stop de waarde rechts in de doos links.
Lees het altijd als **"wordt"**, nooit als "is gelijk aan".

```js
currentRoute = route;       // currentRoute WORDT de nieuwe route
playState.selected = null;  // selected WORDT null (geen antwoord gekozen)
playState.idx = 0;          // idx WORDT 0 (begin bij vraag 1)
timerInterval = null;       // timerInterval WORDT null (timer gestopt)
emoji = '🏆';               // emoji WORDT de trofee
```

> Onthoud: `=` is opslaan. `===` is vergelijken. Totaal verschillend.

---

## === twee waarden vergelijken

`===` vraagt: **zijn deze twee dingen precies gelijk?**
Het antwoord is altijd `true` (ja) of `false` (nee).

```js
// play.js
const isCorrect = selected === correctIdx;
```
→ Is het gekozen antwoord hetzelfde als het juiste antwoord? Ja = `true`, nee = `false`.

```js
// play.js
nextBtn.textContent = (idx === total - 1) ? 'Afronden ✓' : 'Volgende →';
```
→ Is dit de laatste vraag? Dan toon "Afronden". Anders "Volgende".

```js
// result.js
if (pct === 100) { emoji = '🏆'; }
```
→ Is het percentage precies 100? Alleen dan krijg je de trofee.

```js
// app.js
l.classList.toggle('active', l.dataset.route === route);
```
→ Is de route van deze link gelijk aan de huidige route? Zo ja, markeer hem als actief.

---

## !== niet gelijk

`!==` is het omgekeerde van `===`. Vraagt: **zijn deze twee dingen NIET gelijk?**

```js
// import.js
if (typeof data !== 'object') throw new Error('Bestand is geen geldige JSON.');
```
→ Als het type van data NIET 'object' is, gooi een fout.

---

## >= en <= en > en < groter/kleiner dan

```js
// result.js
if (pct === 100) { emoji = '🏆'; }          // precies 100
else if (pct >= 80)  { emoji = '🌟'; }      // 80 of hoger
else if (pct >= 60)  { emoji = '👍'; }      // 60 of hoger
else if (pct >= 40)  { emoji = '💪'; }      // 40 of hoger
else                 { emoji = '📚'; }      // alles onder 40
```
→ De code checkt van boven naar beneden. Bij 75% stopt het bij `pct >= 60` want die is als eerste waar.

```js
// play.js
if (idx + 1 >= quiz.questions.length) {
  navigate('result');
}
```
→ Is het volgende vraagnummer groter dan of gelijk aan het totaal? Dan zijn alle vragen geweest.

```js
// import.js
if (q.answers.length < 2) throw new Error('Vraag moet minstens 2 antwoorden hebben.');
```
→ Heeft de vraag minder dan 2 antwoorden? Dan is de quiz ongeldig.

---

## ! uitroepteken — draai het om

`!` voor iets draait het om. `true` wordt `false`, `false` wordt `true`.
Als iets leeg/null is (wat "false-achtig" is) wordt het `true`.

```js
// play.js
if (!quiz) { navigate('home'); return; }
```
→ Als quiz leeg/null is (`!quiz` = true): ga naar home.

```js
// result.js
if (!playState) { navigate('home'); return; }
if (!name)      { status.textContent = 'Vul een naam in.'; return; }
```
→ Als er geen speldata is, of geen naam is ingevuld: stop en toon foutmelding.

```js
// import.js
if (!file) return;
```
→ Als er geen bestand is: stop direct.

---

## && en — beide moeten kloppen

`&&` betekent: doe dit **alleen als beide dingen kloppen**.
Wordt ook gebruikt als: doe dit **alleen als dit bestaat**.

```js
// app.js
preloader && preloader.classList.add('hide');
```
→ Alleen als `preloader` bestaat (niet null), voeg dan de klasse toe. Als de preloader er niet is crasht de app niet.

```js
// app.js
if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
```
→ Alleen als er een timer loopt, stop hem dan.

---

## || of — gebruik dit, of anders dat

`||` werkt als een reservewaarde. Als de linkerkant leeg/null is, gebruik dan de rechterkant.

```js
// helpers.js
const emoji = question.image || '❓';
```
→ Heeft de vraag een emoji? Gebruik die. Zo niet: gebruik `'❓'`.

```js
// helpers.js
const t = THEMES[theme] || THEMES.amsterdam;
```
→ Bestaat het thema? Gebruik dat. Bestaat het niet: gebruik amsterdam als reserveoptie.

```js
// storage.js
return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM)) || [];
return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES)) || {};
```
→ Is er iets opgeslagen? Gebruik dat. Zo niet: geef een lege lijst/object terug.

```js
// app.js
(routes[route] || renderHome)(params);
```
→ Bestaat de route? Gebruik die functie. Bestaat die niet: gebruik renderHome als reserveoptie.

```js
// home.js
${q.emoji || '❓'}
${q.description || ''}
```
→ Heeft de quiz een emoji? Gebruik die. Zo niet: vraagteken. Geen beschrijving? Lege tekst.

---

## ++ telt 1 op

`x++` is hetzelfde als `x = x + 1`. Telt precies 1 bij de waarde op.

```js
// play.js — elke seconde:
playState.seconds++;

// play.js — als het antwoord goed is:
if (isCorrect) playState.score++;

// play.js — naar de volgende vraag:
playState.idx++;
```
→ De speeltijd gaat elke seconde omhoog. De score gaat omhoog bij een goed antwoord. Het vraagnummer gaat omhoog na elke vraag.

---

## % restdeling

`155 % 60` vraagt: hoeveel blijft er over na de deling?
155 gedeeld door 60 = 2 rest **35**. Antwoord: 35.

```js
// helpers.js
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
```
→ Bij 155 seconden: `Math.floor(155/60)` = 2 minuten. `155 % 60` = 35 seconden. Resultaat: `"02:35"`.

---

## if / else if / else — als dit, anders dat

```js
// result.js
let emoji = '🎉';
if (pct === 100)      { emoji = '🏆'; }
else if (pct >= 80)   { emoji = '🌟'; }
else if (pct >= 60)   { emoji = '👍'; }
else if (pct >= 40)   { emoji = '💪'; }
else                  { emoji = '📚'; }
```
→ De computer gaat van boven naar beneden. Zodra één voorwaarde klopt, stopt het. Bij 75% stopt het bij `pct >= 60`.

```js
// play.js
if (idx + 1 >= quiz.questions.length) {
  clearInterval(timerInterval);
  timerInterval = null;
  navigate('result');
} else {
  playState.idx++;
  showQuestion();
}
```
→ Zijn alle vragen geweest? Ga naar resultaat. Anders: laad de volgende vraag.

```js
// result.js
if (!name) {
  status.textContent = 'Vul eerst een naam in.';
  status.classList.add('error');
  return;
}
```
→ Als naam leeg is: toon foutmelding en stop. De rest wordt niet uitgevoerd.

---

## ? : korte if/else op één regel

Lees `?` als "als dit waar is" en `:` als "anders".

```js
// play.js
nextBtn.textContent = (idx === total - 1) ? 'Afronden ✓' : 'Volgende →';
```
→ Laatste vraag? Dan "Afronden". Anders "Volgende".

```js
// home.js
q._custom ? '<span class="badge custom">Eigen</span>' : '<span class="badge">Standaard</span>'
```
→ Eigen quiz? Dan badge "Eigen". Anders badge "Standaard".

```js
// result.js
const selectedText = a.selected != null ? a.answers[a.selected] : '(geen antwoord)';
```
→ Is er een antwoord gekozen? Gebruik die tekst. Anders: toon "(geen antwoord)".

---

## function — een stuk code met een naam

Je schrijft een functie één keer. Je kunt hem daarna overal aanroepen.
Vergelijk het met een recept: je schrijft het één keer op, en je kookt het zo vaak je wilt.

```js
// helpers.js
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
```
→ Je geeft een getal mee (bijv. 155). De functie geeft `"02:35"` terug.
→ Wordt gebruikt in play.js (timer) en leaderboard.js (speeltijd in tabel).

```js
// app.js
function navigate(route, params = {}) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  currentRoute = route;
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.route === route));
  (routes[route] || renderHome)(params);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```
→ Wisselt van scherm. Stopt de timer, slaat de huidige route op, markeert de actieve link, laadt het nieuwe scherm, scrollt naar boven.

---

## => pijlfunctie — kortere functie

Een pijlfunctie is gewoon een kortere manier om een functie te schrijven. Ze worden vaak gebruikt wanneer de functie maar op één plek nodig is.

```js
// Gewone functie:
function(e) { e.preventDefault(); navigate(link.dataset.route); }

// Zelfde als pijlfunctie:
(e) => { e.preventDefault(); navigate(link.dataset.route); }
```

**In jouw code — app.js:**
```js
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(link.dataset.route);
  });
});
```
→ `link =>` = "voor elke link, doe het volgende".

```js
menuToggle.addEventListener('click', () => navEl.classList.toggle('open'));
```
→ `() =>` heeft geen parameters. Bij een klik: open/sluit het menu.

**In jouw code — play.js:**
```js
timerInterval = setInterval(() => {
  playState.seconds++;
  document.getElementById('timerValue').textContent = formatTime(playState.seconds);
}, 1000);
```
→ Elke seconde wordt deze pijlfunctie uitgevoerd.

```js
q.answers.forEach((ans, i) => {
  const btn = document.createElement('button');
  btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(ans)}</span>`;
  btn.addEventListener('click', () => onSelect(i, btn));
  wrap.appendChild(btn);
});
```
→ `(ans, i) =>` = "voor elk antwoord `ans` op positie `i`".

---

## return — geef iets terug en stop

`return` doet twee dingen: het geeft een waarde terug én stopt de functie.

**Geeft iets terug:**
```js
// helpers.js
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
```
→ Overal waar `formatTime(155)` staat, verschijnt `"02:35"`.

**Stopt de functie (zonder waarde terug te geven):**
```js
// play.js
if (!quiz) { navigate('home'); return; }
```
→ Quiz niet gevonden: ga naar home en stop. De rest van de functie wordt niet uitgevoerd.

```js
// import.js
function handleFile(file) {
  if (!file) return;  // geen bestand: stop direct
  ...
}
```

```js
// result.js
if (!name) {
  status.textContent = 'Vul een naam in.';
  return;  // stop hier: sla niets op
}
```

---

## ... drie puntjes — kopieer en combineer

`...` voor een array kopieert alle elementen op die plek.

```js
// app.js
allQuizzes = [...DEFAULT_QUIZZES, ...custom];
```
→ Kopieer alle standaard quizzes, daarna alle eigen quizzes. Samen in één grote array.

```js
// app.js
loadCustom().map(q => ({ ...q, _custom: true, theme: q.theme || 'custom' }))
```
→ `...q` kopieert alle eigenschappen van de quiz. Daarna wordt `_custom: true` toegevoegd. Je krijgt een kopie met één extra eigenschap erbij.

---

## { } uitpakken (destructuring)

Meerdere eigenschappen van een object in één keer in aparte variabelen stoppen.

```js
// play.js
const { quiz, idx } = playState;

// Dit is hetzelfde als:
const quiz = playState.quiz;
const idx  = playState.idx;
```
→ Korter en overzichtelijker.

```js
// result.js
const { quiz, score, answers, seconds } = playState;
```
→ Vier variabelen tegelijk uitpakken.

```js
// play.js — in de functie-aanroep zelf:
function renderPlay({ quizId }) {
```
→ Het object `{ quizId: 'amsterdam' }` dat meegegeven wordt, wordt direct uitpakt. Je kunt gewoon `quizId` gebruiken.

---

## ` ` backtick — tekst met variabelen erin

Tekst tussen backticks (`` ` ``) kan variabelen bevatten via `${ }`.
Alles tussen `${` en `}` wordt uitgevoerd als code.

```js
// play.js
document.getElementById('qCount').textContent = `Vraag ${idx + 1} van ${total}`;
```
→ Bij vraag 2 van 10: `idx` is 1, dus `idx + 1` is 2. Resultaat: `"Vraag 2 van 10"`.

```js
document.getElementById('qPct').textContent = `${pct}%`;
document.getElementById('progressFill').style.width = pct + '%';
```
→ Bij 30%: toont `"30%"` en zet de balk op 30% breedte.

```js
// helpers.js
return `${m}:${s}`;
return `${min} min`;
return `custom-${Date.now()}`;
```
→ `"02:35"`, `"3 min"`, `"custom-1748954400000"`.

---

## forEach — doe dit voor elk element

`forEach` voert een stuk code uit voor elk element in een lijst.

```js
// home.js
allQuizzes.forEach(q => {
  const card = document.createElement('article');
  card.className = 'quiz-card';
  card.innerHTML = `...`;
  card.addEventListener('click', () => navigate('play', { quizId: q.id }));
  grid.appendChild(card);
});
```
→ Voor elke quiz `q` in `allQuizzes`: maak een kaart, vul die, maak hem klikbaar, zet hem op de pagina.

```js
// play.js
q.answers.forEach((ans, i) => {
  const btn = document.createElement('button');
  btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(ans)}</span>`;
  btn.addEventListener('click', () => onSelect(i, btn));
  wrap.appendChild(btn);
});
```
→ Voor elk antwoord `ans` op positie `i`: maak knop A, B, C of D.

```js
// result.js
answers.forEach((a, i) => {
  const li = document.createElement('li');
  li.className = 'feedback-item ' + (a.isCorrect ? 'good' : 'bad');
  list.appendChild(li);
});
```
→ Voor elk gegeven antwoord: maak een groen of rood feedbackregel.

```js
// app.js
navLinks.forEach(l => l.classList.toggle('active', l.dataset.route === route));
```
→ Voor elke navigatielink: zet 'active' aan als de route klopt, anders uit.

---

## .find — zoek één element in een lijst

Zoekt door een array en geeft het eerste element terug waarvoor de voorwaarde `true` is.

```js
// play.js
const quiz = allQuizzes.find(q => q.id === quizId);
```
→ Zoek in `allQuizzes` de quiz waarvan het id overeenkomt. Als niets gevonden: `undefined`.

---

## .map — maak een nieuwe lijst

`map` maakt een nieuwe array door elk element te veranderen. Het origineel blijft ongewijzigd.

```js
// app.js
const custom = loadCustom().map(q => ({ ...q, _custom: true, theme: q.theme || 'custom' }));
```
→ Voor elke opgeslagen quiz: maak een kopie met `_custom: true` erbij.

```js
// leaderboard.js
entries.map((e, i) => `<tr><td>${i + 1}</td><td>${e.name}</td>...</tr>`).join('')
```
→ Zet elke score om naar een HTML-tabelrij. `.join('')` plakt ze aan elkaar.

```js
// create.js
[0, 1, 2, 3].map(i => `<label>...</label>`).join('')
```
→ Maakt 4 antwoordrijen aan (voor antwoord 1, 2, 3, 4).

---

## .push — voeg toe achteraan

`push` voegt iets achteraan een array toe. De array wordt één langer.

```js
// play.js
playState.answers.push({
  question: quiz.questions[idx].question,
  selected,
  correct:  correctIdx,
  answers:  quiz.questions[idx].answers,
  isCorrect
});
```
→ Na elke vraag wordt het gegeven antwoord opgeslagen. Dit is later nodig voor de feedbackpagina.

```js
// create.js en import.js
custom.push(quiz);
saveCustom(custom);
```
→ Voeg de nieuwe quiz toe aan de lijst. Sla daarna de hele bijgewerkte lijst op.

---

## .sort — sorteer

`sort` sorteert een array. Je geeft aan hoe gesorteerd moet worden.

```js
// result.js
scores[quiz.id].sort((a, b) => b.pct - a.pct || a.seconds - b.seconds);
```
→ Sorteer van hoog naar laag percentage. Bij gelijk percentage: van snel naar langzaam.
De logica: negatief getal = `a` vóór `b`. Positief getal = `b` vóór `a`.

---

## .slice — pak een stuk

`slice` geeft een deel van een array terug. Het origineel blijft ongewijzigd.

```js
// result.js
scores[quiz.id] = scores[quiz.id].slice(0, 50);
```
→ Bewaar maximaal 50 scores. De rest wordt weggesneden.

```js
// leaderboard.js
const entries = (scores[q.id] || []).slice(0, 10);
```
→ Pak de top 10. `slice(0, 10)` = van positie 0 tot en met positie 9.

---

## .join — plak een array samen tot tekst

```js
// leaderboard.js
entries.map((e, i) => `<tr>...</tr>`).join('')
```
→ Eerst maakt `.map()` een array van HTML-stukjes: `['<tr>...</tr>', '<tr>...</tr>']`.
Dan plakt `.join('')` ze aan elkaar: `'<tr>...</tr><tr>...</tr>'`.

---

## .some — is er minstens één?

```js
// create.js
if (answers.some(a => !a)) throw new Error('Elke vraag moet 4 antwoorden hebben.');
```
→ Is er een antwoord dat leeg is (`!a`)? Dan is de quiz ongeldig.

---

## Array.from — maak er een echte array van

`HTMLCollection` en `NodeList` zijn geen echte arrays. Daardoor werken `.forEach()` en `.map()` er niet op. `Array.from()` maakt er een echte array van.

```js
// create.js
Array.from(builder.children).forEach((c, i) => {
  c.querySelector('h4').textContent = `Vraag ${i + 1}`;
  c.dataset.idx = i;
});
```
→ `builder.children` is een HTMLCollection. `Array.from()` maakt er een echte array van zodat `.forEach()` werkt.

```js
const answers = Array.from(ansEls).map(a => a.value.trim());
```
→ Alle antwoordvelden omzetten naar een array van ingevulde teksten.

---

## document.getElementById — zoek op id

Zoekt één element via het `id` attribuut in de HTML.

```js
// app.js
const appEl      = document.getElementById('app');
const menuToggle = document.getElementById('menuToggle');
```
```js
// play.js — aanpassen na het vinden:
document.getElementById('playTitle').textContent    = quiz.title;
document.getElementById('timerValue').textContent   = formatTime(playState.seconds);
document.getElementById('qCount').textContent       = `Vraag ${idx + 1} van ${total}`;
document.getElementById('progressFill').style.width = pct + '%';
document.getElementById('questionText').textContent = q.question;
document.getElementById('nextBtn').disabled = true;
```
→ Zoek het element en pas het daarna direct aan.

---

## document.querySelector en querySelectorAll — zoek op class

`.querySelector` vindt het **eerste** element met die class (punt = class, hekje = id).
`.querySelectorAll` vindt **alle** elementen met die class.

```js
// app.js
const navEl    = document.querySelector('.nav');          // eerste .nav
const navLinks = document.querySelectorAll('.nav-link');  // ALLE .nav-link
document.querySelector('.logo').addEventListener('click', ...);
```

```js
// create.js — zoek BINNEN een kaart, niet op de hele pagina:
card.querySelector('.remove')
card.querySelector('.q-text')
card.querySelector('input[type=radio]:checked')
card.querySelectorAll('.q-ans')
card.querySelectorAll('input[type=radio]')
```
→ Door `card.querySelector(...)` te gebruiken zoek je alleen binnen die ene kaart.

---

## document.createElement — maak een nieuw HTML-element

Maakt een nieuw element aan in het geheugen. Pas na `.appendChild()` zie je het op de pagina.

```js
const card    = document.createElement('article'); // home.js
const btn     = document.createElement('button');  // play.js
const li      = document.createElement('li');      // result.js
const section = document.createElement('section'); // leaderboard.js
const div     = document.createElement('div');     // create.js
const a       = document.createElement('a');       // create.js (download)
```

---

## .textContent en .innerHTML — zet de inhoud

**.textContent** = plaatst puur tekst. Veilig voor gebruikersinvoer.
**.innerHTML** = plaatst HTML. Gebruik `escapeHtml()` bij gebruikersinvoer.

```js
// play.js — textContent:
document.getElementById('playTitle').textContent = quiz.title;
document.getElementById('timerValue').textContent = formatTime(playState.seconds);
nextBtn.textContent = 'Volgende →';
status.textContent = 'Score opgeslagen! 🎉';
```

```js
// Scherm leegmaken:
app.innerHTML = '';
wrap.innerHTML = '';

// HTML inzetten:
card.innerHTML = `
  <div class="emoji-wrap">${q.emoji || '❓'}</div>
  <h3>${escapeHtml(q.title)}</h3>
`;
btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(ans)}</span>`;
```

---

## .appendChild — zet het element op de pagina

Voegt een element toe als laatste kind van een ander element.

```js
grid.appendChild(card);      // home.js — kaart in de grid
wrap.appendChild(btn);       // play.js — antwoordknop in de container
list.appendChild(li);        // result.js — feedbackregel in de lijst
list.appendChild(section);   // leaderboard.js — sectie in de lijst
app.appendChild(tpl.content.cloneNode(true)); // helpers.js — template laden
```

---

## .style.width / .disabled / .value — eigenschappen aanpassen

```js
// play.js — voortgangsbalk:
document.getElementById('progressFill').style.width = pct + '%';
```
→ Bij vraag 3 van 10: `pct` is 30 → balk is 30% breed.

```js
// play.js — knop blokkeren:
nextBtn.disabled = true;   // begin van elke vraag: knop grijs
nextBtn.disabled = false;  // zodra een antwoord gekozen is: knop actief

// result.js — voorkom dubbel opslaan:
document.getElementById('saveScoreBtn').disabled = true;
document.getElementById('playerName').disabled   = true;
```

```js
// create.js — lees wat de gebruiker heeft ingevuld:
const title = document.getElementById('cTitle').value.trim();
const emoji = document.getElementById('cEmoji').value.trim() || '✨';

// result.js:
const name = (document.getElementById('playerName').value || '').trim();
```

---

## classList — klassen toevoegen en verwijderen

Door een CSS-klasse toe te voegen of te verwijderen verander je de opmaak van een element.

```js
// toevoegen:
status.classList.add('error');        // element wordt rood (via CSS)
dz.classList.add('dragover');         // dropzone krijgt markering
preloader.classList.add('hide');      // preloader verdwijnt

// verwijderen:
status.classList.remove('error');     // rood weg
dz.classList.remove('dragover');      // markering weg
navEl.classList.remove('open');       // menu sluit
b.classList.remove('selected');       // selectie van knop weg

// toggle — aan als het er niet is, uit als het er al is:
navEl.classList.toggle('open');
// klik 1: 'open' bestaat niet → voeg toe (menu opent)
// klik 2: 'open' bestaat al → verwijder (menu sluit)

// toggle met voorwaarde — aan of uit op basis van true/false:
l.classList.toggle('active', l.dataset.route === route);
// true → voeg 'active' toe / false → verwijder 'active'

// bevat — controleer of klasse er al is:
if (navEl.classList.contains('open')) navEl.classList.remove('open');
```

---

## dataset — data uit HTML lezen

`data-*` attributen in de HTML zijn bereikbaar via `dataset` in JavaScript.

In de HTML:
```html
<a class="nav-link" data-route="home">Home</a>
```
In JavaScript:
```js
link.dataset.route  // "home"
```

```js
// app.js — lees welk scherm de link moet openen:
navigate(link.dataset.route);

// app.js — markeer actieve link:
l.classList.toggle('active', l.dataset.route === route);

// create.js — sla kaartnummer op:
card.dataset.idx = idx;
c.dataset.idx = i;  // bijwerken na verwijderen
```

---

## addEventListener — koppel een actie

Koppelt een functie aan een element. De functie wordt uitgevoerd als het event plaatsvindt.

```js
element.addEventListener('eventnaam', functie);
```

**click — klik:**
```js
document.getElementById('nextBtn').addEventListener('click', onNext);
document.getElementById('quitBtn').addEventListener('click', () => {
  if (confirm('Weet je zeker?')) { navigate('home'); }
});
document.getElementById('addQuestionBtn').addEventListener('click', () => addQuestion());
document.getElementById('saveQuizBtn').addEventListener('click', () => { ... });
card.querySelector('.remove').addEventListener('click', () => { card.remove(); renumber(); });
btn.addEventListener('click', () => onSelect(i, btn));
card.addEventListener('click', () => navigate('play', { quizId: q.id }));
```

**change — bestand kiezen:**
```js
input.addEventListener('change', (e) => handleFile(e.target.files[0]));
```
→ `e.target` = het invoerveld. `.files[0]` = het eerste gekozen bestand.

**load — pagina klaar:**
```js
window.addEventListener('load', () => {
  setTimeout(() => preloader && preloader.classList.add('hide'), 1900);
});
```

**drag & drop:**
```js
['dragenter', 'dragover'].forEach(ev =>
  dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dragover'); })
);
dz.addEventListener('drop', (e) => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
});
```

---

## e.preventDefault() — stop het standaard gedrag

De browser heeft standaard gedrag bij sommige events. `e.preventDefault()` zet dat uit.

```js
// app.js — bij klik op een link:
link.addEventListener('click', (e) => {
  e.preventDefault();   // zonder dit: browser herlaadt de pagina
  navigate(link.dataset.route);
});
```

```js
// import.js — bij drag & drop:
dz.addEventListener('dragover', (e) => {
  e.preventDefault();   // zonder dit: drag & drop werkt niet
});
dz.addEventListener('drop', (e) => {
  e.preventDefault();   // zonder dit: browser opent het bestand zelf
  handleFile(e.dataTransfer.files[0]);
});
```

---

## localStorage — opslag in de browser

Data die hier staat blijft bewaard ook als je de browser sluit.
Kan alleen tekst opslaan — daarom gebruik je altijd `JSON.stringify` en `JSON.parse`.

```js
// storage.js

// opslaan:
localStorage.setItem('qm_custom_quizzes', JSON.stringify(list));
localStorage.setItem('qm_scores', JSON.stringify(obj));

// ophalen:
JSON.parse(localStorage.getItem('qm_custom_quizzes')) || []
JSON.parse(localStorage.getItem('qm_scores'))         || {}

// verwijderen:
localStorage.removeItem('qm_scores');  // leaderboard.js — alles wissen
```

---

## JSON.stringify en JSON.parse — object naar tekst en terug

localStorage slaat alleen tekst op. `stringify` maakt van een object tekst. `parse` maakt van tekst weer een object.

```js
// Object naar tekst (voor opslaan):
JSON.stringify({ score: 7, naam: 'Kain' })
// Resultaat: '{"score":7,"naam":"Kain"}'

// Tekst naar object (na ophalen):
JSON.parse('{"score":7,"naam":"Kain"}')
// Resultaat: { score: 7, naam: 'Kain' }

// create.js — netjes opgemaakte download:
JSON.stringify(quiz, null, 2)
// null = geen filter, 2 = 2 spaties inspringing → leesbaar in het bestand
```

---

## setInterval en clearInterval — timer

`setInterval` herhaalt een functie steeds opnieuw. `clearInterval` stopt dat.

```js
// play.js — timer starten:
timerInterval = setInterval(() => {
  playState.seconds++;
  document.getElementById('timerValue').textContent = formatTime(playState.seconds);
}, 1000);
```
→ Elke 1000 milliseconden (= 1 seconde): tik 1 seconde op en toon de nieuwe tijd.

```js
// play.js — timer stoppen als alle vragen beantwoord zijn:
clearInterval(timerInterval);
timerInterval = null;

// app.js — timer stoppen bij elke schermwisseling:
if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
```
→ Zo lopen er nooit twee timers tegelijk.

---

## setTimeout — wacht even, doe dan iets

`setTimeout` voert iets één keer uit na een vertraging.

```js
// create.js — toon bevestiging, ga dan naar home:
status.textContent = '✓ Quiz opgeslagen!';
setTimeout(() => navigate('home'), 900);
```
→ Na 0,9 seconden ga je naar home. Zo kan de gebruiker de bevestiging lezen.

```js
// import.js:
setTimeout(() => navigate('home'), 1100);

// app.js — preloader verbergen:
setTimeout(() => preloader && preloader.classList.add('hide'), 1900);
```

---

## try en catch — vang fouten op

Zonder `try/catch` crasht de hele app als er iets fout gaat.
Met `try/catch` vang je de fout op en blijft de app werken.

```js
// storage.js
function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM)) || [];
  } catch {
    return [];  // data kapot → geef lege lijst
  }
}
```

```js
// import.js
reader.onload = () => {
  try {
    const data = JSON.parse(reader.result);  // kan fout gaan
    validateQuiz(data);                       // kan fout gaan
    custom.push(data);
    saveCustom(custom);
    status.textContent = '✓ Geïmporteerd!';
    setTimeout(() => navigate('home'), 1100);
  } catch (e) {
    status.classList.add('error');
    status.textContent = 'Fout: ' + e.message;  // toon de foutmelding
  }
};
```

```js
// create.js
try {
  const quiz = collect();   // gooit een fout als er iets leeg is
  custom.push(quiz);
  saveCustom(custom);
  status.textContent = '✓ Opgeslagen!';
  setTimeout(() => navigate('home'), 900);
} catch (e) {
  status.classList.add('error');
  status.textContent = e.message;
}
```

---

## throw new Error — gooi een fout

`throw` stopt de uitvoering en stuurt een foutmelding door naar de `catch` erboven.

```js
// create.js — als iets leeg is bij opslaan:
if (!title)               throw new Error('Geef je quiz een titel.');
if (qs.length === 0)      throw new Error('Voeg minstens één vraag toe.');
if (!q)                   throw new Error('Een vraag heeft geen tekst.');
if (answers.some(a => !a)) throw new Error('Elke vraag moet 4 antwoorden hebben.');
```

```js
// import.js — als het bestand ongeldig is:
if (!data.title)                   throw new Error('Quiz mist een "title".');
if (!Array.isArray(data.questions)) throw new Error('Quiz moet vragen bevatten.');
if (!q.question)                   throw new Error(`Vraag ${i + 1} mist tekst.`);
```
→ Al deze fouten worden direct opgepikt door de `catch (e)` en getoond als rode foutmelding.

---

## new — maak een nieuw object aan

`new` maakt een nieuw exemplaar van iets aan.

```js
// helpers.js — nieuwe afbeelding aanmaken:
const img = new Image();
img.alt     = '';
img.loading = 'lazy';
img.onerror = () => { container.innerHTML = svgFallback; };
img.onload  = () => { container.innerHTML = ''; container.appendChild(img); };
img.src = question.imageUrl;  // dit start het laden
```
→ Zodra `.src` ingesteld is begint de browser te laden. Als het lukt: `onload`. Als het mislukt: `onerror`.

```js
// import.js — bestand lezen:
const reader = new FileReader();
reader.onload = () => {
  const data = JSON.parse(reader.result);
  ...
};
reader.readAsText(file);  // start het lezen
```

```js
// create.js — bestand downloaden:
const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
const url  = URL.createObjectURL(blob);
const a    = document.createElement('a');
a.href = url;
a.download = quiz.title.replace(/\s+/g, '_').toLowerCase() + '.json';
a.click();
URL.revokeObjectURL(url);
```

```js
// result.js — tijdstip opslaan:
date: new Date().toISOString()
// Geeft: "2026-06-03T14:30:00.000Z"

// create.js — uniek id aanmaken:
id: 'custom-' + Date.now()
// Date.now() = groot getal (milliseconden). Elk tijdstip is uniek.
// Geeft bijv: "custom-1748954400000"
```

---

## typeof en Array.isArray — wat voor type is dit?

```js
// import.js
if (!data || typeof data !== 'object') throw new Error('Bestand is geen geldige JSON.');
```
→ `typeof data` geeft het type als tekst. `'object'` = het is een object of array. `!== 'object'` = het is iets anders.

```js
if (!Array.isArray(data.questions) || data.questions.length === 0) {
  throw new Error('Quiz moet ten minste 1 vraag bevatten.');
}
```
→ `typeof` kan niet onderscheiden of iets een array of object is. `Array.isArray()` wel.

---

## parseInt — tekst naar getal

HTML-invoervelden geven altijd tekst terug. Als je een getal nodig hebt, gebruik `parseInt`.

```js
// create.js
const correct = correctEl ? parseInt(correctEl.value, 10) : 0;
```
→ `correctEl.value` is bijv. de tekst `'2'`. `parseInt('2', 10)` maakt er het getal `2` van. De `10` = decimaal stelsel.

---

## Math.floor, Math.ceil, Math.round

```js
// helpers.js
Math.floor(2.9)  // → 2   altijd naar BENEDEN afronden
Math.ceil(2.1)   // → 3   altijd naar BOVEN afronden
Math.round(2.5)  // → 3   normaal afronden
```

```js
// In jouw code:
const m   = Math.floor(sec / 60)       // minuten berekenen
const min = Math.ceil(seconds / 60)    // schatting speelduur
const pct = Math.round((score / total) * 100)  // scorepercentage
```

---

## .toString() en .padStart()

```js
// helpers.js
Math.floor(155 / 60).toString().padStart(2, '0')
```
→ `Math.floor(155/60)` = getal `2`.
→ `.toString()` = maakt er tekst `'2'` van.
→ `.padStart(2, '0')` = minder dan 2 tekens? Vul aan met `'0'` links → `'02'`.

Bij 35 seconden: `'35'.padStart(2, '0')` = `'35'` (al 2 tekens, niets toevoegen).

---

## .trim() / .replace() / .toLowerCase()

```js
// create.js
const title = document.getElementById('cTitle').value.trim();
```
→ `"  Amsterdam  "` wordt `"Amsterdam"`. Verwijdert spaties aan begin en einde.

```js
// create.js — bestandsnaam voor download:
quiz.title.replace(/\s+/g, '_').toLowerCase() + '.json'
```
→ `"Quiz over Amsterdam"` → `.replace(/\s+/g, '_')` → `"Quiz_over_Amsterdam"` → `.toLowerCase()` → `"quiz_over_amsterdam"` → + `'.json'` → `"quiz_over_amsterdam.json"`.

`/\s+/g` is een zoekpatroon: `\s` = spatie, `+` = één of meer, `g` = vervang alle.

---

## null — bewust leeg

`null` betekent: dit heeft op dit moment bewust geen waarde.

```js
var playState     = null;  // geen quiz actief
var timerInterval = null;  // geen timer actief
selected: null,            // nog geen antwoord gekozen

// na stoppen timer:
timerInterval = null;

// begin van elke nieuwe vraag:
playState.selected = null;
```

---

## window — de browser zelf

```js
// app.js — wacht tot alles geladen is:
window.addEventListener('load', () => {
  setTimeout(() => preloader && preloader.classList.add('hide'), 1900);
});

// app.js — scroll naar boven bij elk schermwisselaar:
window.scrollTo({ top: 0, behavior: 'smooth' });
```

---

## confirm — bevestigingspopup

```js
// play.js
if (confirm('Weet je zeker dat je wilt stoppen? Je voortgang gaat verloren.')) {
  navigate('home');  // alleen als OK geklikt
}

// leaderboard.js
if (confirm('Weet je zeker dat je alle scores wilt verwijderen?')) {
  localStorage.removeItem(STORAGE_KEYS.SCORES);
  renderLeaderboard();
}
```
→ `confirm` geeft `true` terug bij OK, `false` bij Annuleren.

---

## Templates en cloneNode — scherm laden

In de HTML staat een `<template>` tag. De inhoud is onzichtbaar totdat je hem kopieert.

```js
// helpers.js
function renderTemplate(id) {
  const app = document.getElementById('app');
  app.innerHTML = '';                            // verwijder huidige scherm
  const tpl = document.getElementById(id);      // zoek template op (bijv. 'tpl-home')
  app.appendChild(tpl.content.cloneNode(true));  // kopieer en zet op pagina
}
```
→ `cloneNode(true)` = maak een diepe kopie. Zonder dit zou de template zelf verplaatst worden en verdwijnen.

---

## params = {} — standaardwaarde voor een parameter

Als je de functie aanroept zonder dat argument mee te geven, krijgt de parameter automatisch de standaardwaarde.

```js
// app.js
function navigate(route, params = {}) {
```
→ `navigate('home')` → `params` wordt automatisch `{}`.
→ `navigate('play', { quizId: 'amsterdam' })` → `params` is `{ quizId: 'amsterdam' }`.

```js
// create.js
function addQuestion(q = null) {
```
→ `addQuestion()` → `q` is `null` (lege nieuwe kaart).
→ `addQuestion(bestaandeVraag)` → `q` is die vraag (velden vooraf invullen).

---

## Samenvatting van alle tekens

| Teken | Wat het doet | Voorbeeld |
|---|---|---|
| `=` | Sla op | `currentRoute = route` |
| `===` | Zijn ze gelijk? | `selected === correctIdx` |
| `!==` | Zijn ze niet gelijk? | `typeof data !== 'object'` |
| `>=` | Groter of gelijk? | `pct >= 80` |
| `>` | Groter dan? | `idx + 1 >= total` |
| `<` | Kleiner dan? | `answers.length < 2` |
| `!` | Draai om / is leeg? | `!quiz` |
| `&&` | Beide kloppen / bestaat? | `preloader && ...` |
| `\|\|` | Of / reservewaarde | `question.image \|\| '❓'` |
| `++` | Tel 1 op | `playState.score++` |
| `%` | Restdeling | `sec % 60` |
| `? :` | Korte if/else | `(x > 0) ? 'ja' : 'nee'` |
| `...` | Kopieer en combineer | `[...DEFAULT_QUIZZES, ...custom]` |
| `;` | Einde van een regel | `navigate('home');` |
| `{ }` | Codeblok of object | `if (...) { }` |
| `( )` | Functie aanroepen/definiëren | `navigate('home')` |
| `[ ]` | Array of positie opzoeken | `letters[i]` |
| `.` | Ga naar eigenschap | `playState.score` |
| `,` | Scheiding | `{ quiz, idx, score: 0 }` |
| `:` | Naam van waarde | `{ idx: 0 }` |
