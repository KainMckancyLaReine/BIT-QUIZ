# BITQUIZ — Bestandsoverzicht

Elke file uitgelegd: wat hij doet, welke functies erin zitten en hoe hij samenwerkt met de rest.

---

## 📄 index.html

**Wat:** De enige HTML-pagina van de hele app. Er is maar één pagina — JavaScript wisselt de inhoud steeds in zonder de pagina te herladen (dit heet een Single Page Application).

**Wat staat erin:**
- De `<head>` met de Google Fonts-link en de CSS-link
- De preloader (de B-I-T-? animatie bij opstarten)
- De navigatiebalk met de vier links (Quizzes, Maak quiz, Leaderboard, Importeren)
- Het `<main id="app">` element — dit is de lege container die JavaScript vult
- Alle `<template>` elementen (zes stuks, één per scherm) — deze worden pas zichtbaar als JavaScript ze kloont en in `#app` plaatst
- Onderaan alle `<script>` tags in de juiste laadvolgorde

**Laadvolgorde van scripts (volgorde is verplicht):**
```
quizzes.js → storage.js → helpers.js → views/*.js → app.js
```
Als je de volgorde omdraait crasht de app omdat een bestand functies gebruikt van een bestand dat nog niet geladen is.

---

## 🎨 css/style.css

**Wat:** Alle opmaak van de app. Kleuren, lettergrootten, layout, animaties, responsiviteit voor mobiel.

**Bevat onder andere:**
- De preloader-animatie (de puzzelstukjes die samentrekken)
- Het CSS-grid voor de quiz-kaarten op het startscherm
- De stijlen voor de voortgangsbalk, antwoordknoppen, leaderboard-tabel
- Media queries voor mobiel (hamburger menu, kleinere tekst)

---

## 📦 js/quizzes.js

**Wat:** Bevat alle ingebakken quizdata als één grote array.

**Bevat:**
- `DEFAULT_QUIZZES` — een array van quiz-objecten

**Structuur van één quiz:**
```js
{
  id: 'amsterdam-feitjes',     // unieke ID (string)
  title: 'Amsterdam Feitjes',  // zichtbare naam
  description: '...',          // korte uitleg
  emoji: '🏛️',                 // emoji op de kaart
  theme: 'amsterdam',          // kleurthema voor de SVG
  questions: [
    {
      question: 'Hoeveel grachten?',
      answers: ['25', '75', '165', '300'],
      correct: 2,              // INDEX van juist antwoord (0 = eerste)
      image: '🚣',             // emoji voor de SVG-afbeelding
      imageUrl: 'https://...'  // optionele echte foto
    }
  ]
}
```

**Werkt samen met:** `app.js` (die laadt deze array in `allQuizzes`)

---

## 💾 js/storage.js

**Wat:** Alle communicatie met `localStorage` — de opslag in de browser die blijft bestaan na sluiten.

**Bevat 4 functies:**

| Functie | Wat het doet |
|---|---|
| `loadCustom()` | Leest eigen quizzes uit localStorage, geeft een array terug |
| `saveCustom(list)` | Schrijft een array van eigen quizzes naar localStorage |
| `loadScores()` | Leest alle scores uit localStorage, geeft een object terug |
| `saveScores(obj)` | Schrijft het scores-object naar localStorage |

**Twee sleutels in localStorage:**
- `'qm_custom_quizzes'` — eigen quizzes
- `'qm_scores'` — leaderboard scores

**Waarom JSON.stringify / JSON.parse?**
localStorage slaat alleen tekst op. `JSON.stringify` zet een object om naar tekst voor opslaan. `JSON.parse` zet die tekst terug naar een object bij ophalen.

**Werkt samen met:** `app.js`, `create.js`, `import.js`, `result.js`, `leaderboard.js`

---

## 🔧 js/helpers.js

**Wat:** Losse hulpfuncties die door meerdere view-bestanden gebruikt worden. Geen eigen state, geen directe DOM-koppeling.

**Bevat:**

| Functie | Wat het doet |
|---|---|
| `renderTemplate(id)` | Zoekt een `<template>` op in de HTML via het opgegeven id, maakt een diepe kopie van de inhoud met `cloneNode(true)` en plaatst die kopie in `<main id="app">` |
| `estimatedDuration(quiz)` | Vermenigvuldigt het aantal vragen met 15 seconden, deelt door 60 en rondt omhoog af met `Math.ceil()` — geeft een tekst terug zoals `"3 min"` |
| `formatTime(sec)` | Berekent de minuten met `Math.floor(sec / 60)` en de resterende seconden met `sec % 60`, vult beide aan naar twee cijfers met `padStart(2, '0')` en geeft een tekst terug in het formaat `"mm:ss"` |
| `escapeHtml(str)` | Vervangt de tekens `&`, `<`, `>`, `"` en `'` door hun HTML-entiteiten (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`) zodat de tekst veilig als HTML-inhoud gebruikt kan worden |
| `escapeAttr(str)` | Vervangt `"` en `<` door hun HTML-entiteiten zodat de tekst veilig als waarde in een HTML-attribuut gebruikt kan worden |
| `THEMES` | Een object met vier kleurthema's (amsterdam, rembrandt, ww2, custom). Elk thema bevat de eigenschappen `bg` (achtergrondkleur), `dot` (stippelkleur), `accent` en `shape` als hexadecimale kleurcodes |
| `buildSvgImage(theme, emoji)` | Zoekt het thema-object op in `THEMES`, bouwt een SVG-string met achtergrondkleur, stippenpatroon, decoratieve vormen en de emoji centraal in een cirkel, en geeft die SVG-string terug |
| `renderQuestionImage(container, question, theme)` | Als de vraag een `imageUrl` heeft: maakt een `<img>` element aan, toont de SVG alvast terwijl de foto laadt, en vervangt die door de foto zodra hij geladen is. Als er geen `imageUrl` is: plaatst direct de SVG in de container |

**Werkt samen met:** alle view-bestanden

---

## ⚙️ js/app.js

**Wat:** Het startpunt van de app. Bevat de globale state, de router en de initialisatie.

**3 globale variabelen** (beschikbaar voor alle andere bestanden):
- `allQuizzes` — array met alle quizzes (standaard + eigen gecombineerd)
- `playState` — object met alle data van de lopende quiz, of `null` als er geen quiz bezig is
- `timerInterval` — ID van de lopende timer, of `null`

**Functies:**
- `refreshQuizList()` — combineert `DEFAULT_QUIZZES` met eigen quizzes uit localStorage in `allQuizzes`
- `navigate(route, params)` — de router: stopt de timer, bepaalt welk scherm getoond wordt, roept de juiste render-functie aan

**routes object:**
```js
const routes = {
  home:        renderHome,
  play:        renderPlay,
  result:      renderResult,
  create:      renderCreate,
  leaderboard: renderLeaderboard,
  import:      renderImport
};
```

**Initialisatie (onderaan):**
```js
refreshQuizList();
navigate('home');
```
Dit is het eerste dat uitgevoerd wordt als de pagina klaar met laden is.

**Werkt samen met:** alle andere bestanden (is de lijm van de app)

---

## 🏠 js/views/home.js

**Wat:** Tekent het startscherm met alle quiz-kaarten.

**Bevat 1 functie:**
- `renderHome()` — laadt het `tpl-home` template, loopt door `allQuizzes` en maakt voor elke quiz een klikbare kaart met emoji, titel, beschrijving en speelduur

**Wat gebeurt er als je een kaart aanklikt:**
```js
card.addEventListener('click', () => navigate('play', { quizId: q.id }));
```
→ de router wordt aangeroepen met de quiz-ID, het speelscherm wordt geladen.

**Werkt samen met:** `app.js` (router + allQuizzes), `helpers.js` (escapeHtml, estimatedDuration)

---

## 🎮 js/views/play.js

**Wat:** Het hart van de app — hier wordt de quiz gespeeld.

**Bevat 4 functies:**

| Functie | Wat het doet |
|---|---|
| `renderPlay({ quizId })` | Zoekt de quiz op, laadt het scherm, vult `playState`, start de timer, toont de eerste vraag |
| `showQuestion()` | Tekent de huidige vraag en antwoordknoppen op basis van `playState.idx` |
| `onSelect(i, btn)` | Wordt aangeroepen als een antwoord geklikt wordt — slaat de keuze op, markeert de knop |
| `onNext()` | Wordt aangeroepen bij "Volgende" — controleert antwoord, verhoogt score, gaat naar volgende vraag of naar het resultaatscherm |

**De speelstroom:**
```
renderPlay → showQuestion → [gebruiker klikt] → onSelect
→ [gebruiker klikt Volgende] → onNext → showQuestion (herhaal)
→ [laatste vraag] → navigate('result')
```

**Werkt samen met:** `app.js` (playState, timerInterval, navigate), `helpers.js` (renderTemplate, formatTime, escapeHtml, renderQuestionImage)

---

## 📊 js/views/result.js

**Wat:** Toont de score en feedback na het spelen van een quiz.

**Bevat 1 functie:**
- `renderResult()` — leest `playState` uit, berekent het percentage, toont emoji + titel op basis van score, toont feedbacklijst per vraag, regelt het opslaan van de score in localStorage

**Score-emoji logica:**
```
100%  → 🏆 Perfect!
≥ 80% → 🌟 Indrukwekkend!
≥ 60% → 👍 Netjes gedaan!
≥ 40% → 💪 Niet slecht
< 40% → 📚 Oefening baart kunst!
```

**Score opslaan:** scores worden gesorteerd op percentage (hoog → laag), bij gelijk percentage op tijd (snel → langzaam). Maximaal 50 scores per quiz worden bewaard.

**Werkt samen met:** `app.js` (playState, navigate), `storage.js` (loadScores, saveScores), `helpers.js` (renderTemplate, formatTime, escapeHtml)

---

## ✏️ js/views/create.js

**Wat:** Het formulier waarmee de gebruiker een eigen quiz kan bouwen.

**Bevat 1 exportfunctie + 3 geneste hulpfuncties:**

| Functie | Wat het doet |
|---|---|
| `renderCreate()` | Laadt het scherm en koppelt alle knoppen |
| `addQuestion(q)` | Voegt een vraagkaart toe aan het formulier (leeg of gevuld met bestaande data) |
| `renumber()` | Hernummert alle vraagkaarten na een verwijdering |
| `collect()` | Leest alle ingevulde velden uit en bouwt een geldig quiz-object — gooit een fout als iets ontbreekt |

**Twee acties:**
- **Opslaan** → `collect()` + `loadCustom()` + `custom.push(quiz)` + `saveCustom(custom)` → ga naar home
- **Downloaden** → `collect()` → `JSON.stringify` → `Blob` → onzichtbare link klikken → `.json` bestand downloadt

**Werkt samen met:** `storage.js` (loadCustom, saveCustom), `helpers.js` (renderTemplate, escapeHtml, escapeAttr), `app.js` (navigate)

---

## 🏅 js/views/leaderboard.js

**Wat:** Toont de top-10 scores per quiz.

**Bevat 1 functie:**
- `renderLeaderboard()` — laadt het scherm, haalt scores op uit localStorage, bouwt per quiz een tabel met rangschikking, naam, tijd en score. Als er geen scores zijn toont het een lege melding. De "leegmaken"-knop verwijdert alle scores na bevestiging.

**Scores worden getoond als:**
```
#  Naam       Tijd    Score
1  Kain       02:35   9/10 (90%)
2  Sander     01:58   8/10 (80%)
```

**Werkt samen met:** `storage.js` (loadScores), `helpers.js` (renderTemplate, formatTime, escapeHtml), `app.js` (allQuizzes, navigate)

---

## 📥 js/views/import.js

**Wat:** Laat de gebruiker een `.json` bestand uploaden om een quiz te importeren. Ondersteunt zowel klikken als drag & drop.

**Bevat 2 functies:**

| Functie | Wat het doet |
|---|---|
| `renderImport()` | Laadt het scherm, regelt de bestandskiezer en de drag & drop events |
| `handleFile(file)` | Leest het bestand met `FileReader`, parset de JSON, valideert de quiz, slaat op in localStorage |
| `validateQuiz(data)` | Controleert of een quiz-object geldig is — gooit een fout als title, questions of correct ontbreekt |

**Drag & drop werkt zo:**
- `dragenter` / `dragover` → visuele hover-stijl tonen + standaard browser-gedrag blokkeren
- `dragleave` / `drop` → hover-stijl verwijderen
- `drop` → haal het bestand op uit `e.dataTransfer.files[0]` → roep `handleFile()` aan

**Werkt samen met:** `storage.js` (loadCustom, saveCustom), `helpers.js` (renderTemplate), `app.js` (navigate)

---

## 🔗 Hoe de bestanden samenwerken — in één oogopslag

```
index.html
  ├── laadt css/style.css (opmaak)
  ├── bevat alle <template> elementen (slapende HTML)
  └── laadt scripts in volgorde:
        quizzes.js           →  levert DEFAULT_QUIZZES
        storage.js           →  levert load/save functies
        helpers.js           →  levert renderTemplate, escapeHtml, formatTime, ...
        views/home.js        →  renderHome()
        views/play.js        →  renderPlay(), showQuestion(), onSelect(), onNext()
        views/result.js      →  renderResult()
        views/create.js      →  renderCreate()
        views/leaderboard.js →  renderLeaderboard()
        views/stats.js       →  renderStats()
        views/import.js      →  renderImport(), validateQuiz()
        app.js               →  allQuizzes, playState, routes, navigate() — LAATSTE
```

---

## 🚀 UPDATE — Van 3 quizzes naar een volwaardig quizplatform

Deze update maakt BITQUIZ een stuk groter en vollediger. Hieronder staat precies wat er is
toegevoegd en in welk bestand je het terugvindt.

### 📦 js/quizzes.js — van 3 naar 13 quizzes

- **10 nieuwe quizzes** toegevoegd naast de bestaande 3: Wereldgeschiedenis, Aardrijkskunde
  van de Wereld, Ruimtevaart, Wetenschap, Sport Algemeen, Muziekgeschiedenis, Filmgeschiedenis
  & Hollywood, Technologie, Dieren & Natuur, Eten & Drinken. Samen goed voor **130 vragen**.
- Elke quiz heeft nu twee **nieuwe velden**:
  - `category` — de categorienaam (bijv. `'Ruimtevaart'`), gebruikt door de zoek-/filterbalk
    op het startscherm.
  - `difficulty` — `'makkelijk'`, `'gemiddeld'` of `'moeilijk'`, getoond als gekleurde badge
    op de quiz-kaart (🟢/🟡/🔴, zie `DIFFICULTY_LABELS` in `views/home.js`).
- **Echte foto's**: veel vragen hebben nu een `imageUrl` die naar een echte foto van
  Wikimedia Commons wijst, via de kleine hulpfunctie `wm(bestandsnaam)` bovenaan het bestand.
  `wm()` bouwt een `Special:FilePath`-link op (`commons.wikimedia.org/wiki/Special:FilePath/...`)
  — dat is de "veilige" manier om naar een Commons-bestand te linken, omdat je geen
  ingewikkeld hash-pad hoeft te kennen: Wikimedia zoekt de echte locatie zelf op en stuurt de
  browser door. Als een specifieke foto ooit verdwenen of hernoemd is, springt de app
  automatisch terug naar de mooie gegenereerde SVG-illustratie — dat vangnet zat al in
  `renderQuestionImage()` in `helpers.js` en werkt hier dus meteen mee.

### 🎨 js/helpers.js — twee toevoegingen

- **`THEMES`** heeft 10 nieuwe kleurthema's gekregen (`history`, `geography`, `space`,
  `science`, `sport`, `music`, `film`, `tech`, `nature`, `food`) — één per nieuwe
  quizcategorie, zodat elke quiz zijn eigen sfeer heeft in de gegenereerde SVG-afbeeldingen.
- **`fireConfetti()`** — een nieuwe functie die 60 gekleurde "confetti-snippers" op het scherm
  laat vallen via CSS-animatie. Wordt aangeroepen vanuit `views/result.js` bij een score van
  100%. Ruimt zichzelf na 3,8 seconden weer op.

### 💾 js/storage.js — kleurmodus onthouden

- Nieuwe sleutel `STORAGE_KEYS.THEME` (`'qm_theme'`) en twee functies: `loadTheme()` en
  `saveTheme(theme)`. Hiermee onthoudt de browser of je licht of donker gekozen hebt.

### ⚙️ js/app.js — donkere modus + nieuwe route

- **Donkere modus**: `applyTheme(theme)` zet `data-theme="dark"` (of `"light"`) op
  `<html>` — alle kleuren in `style.css` zijn opgebouwd met CSS-variabelen, dus deze ene
  regel verandert de kleur van de hele app in één keer. Gekoppeld aan de nieuwe knop
  `#themeToggle` in de header (🌙 ⇄ ☀️).
  - Bij het opstarten wordt meteen de eerder opgeslagen keuze toegepast, zodat je niet
    steeds opnieuw hoeft te wisselen.
- **Nieuwe route**: `routes.stats = renderStats`, gekoppeld aan het nieuwe navigatie-item
  "Statistieken".

### 🏠 js/views/home.js — zoeken, filteren, quiz van de dag, moeilijkheidsgraad

Volledig herschreven met vier nieuwe onderdelen:

| Onderdeel | Wat het doet |
|---|---|
| `pickDailyQuiz(list)` | Kiest via het huidige dagnummer van het jaar (`% list.length`) elke dag een andere "quiz van de dag" — deterministisch, dus iedereen op hetzelfde apparaat ziet dezelfde quiz totdat de volgende dag begint |
| Zoekbalk (`#quizSearch`) | Filtert live (bij elke toetsaanslag) op titel én beschrijving |
| Categorie-knopjes (`#categoryFilters`) | Worden automatisch opgebouwd uit alle `category`-waarden die in `allQuizzes` voorkomen, plus een "Alle"-knop |
| Moeilijkheidsbadge | Toont 🟢 Makkelijk / 🟡 Gemiddeld / 🔴 Moeilijk op elke kaart, via `DIFFICULTY_LABELS` |

Zoeken en filteren werken samen (een quiz moet aan **beide** voorwaarden voldoen) en
herbouwen alleen de kaarten-grid, niet de hele pagina — zo verlies je nooit de focus in het
zoekveld terwijl je typt.

### 📊 js/views/stats.js — nieuw bestand

Bevat één functie, `renderStats()`, die **geen nieuwe opslag** gebruikt: alles wordt
berekend uit de scores die je al opslaat via het resultaatscherm (`loadScores()` uit
`storage.js`). Berekent:

- Aantal opgeslagen pogingen, aantal verschillende gespeelde quizzes
- Gemiddelde score, beste score (met quiznaam)
- Totale speeltijd (via `formatTime()`)
- Een tabel met per quiz je beste score, aantal keer gespeeld en beste tijd

Speel je een quiz zonder de score op te slaan, dan telt die run hier niet mee — precies
zoals bij het leaderboard.

### 📄 index.html — nieuwe onderdelen

- Nieuwe navigatielink "Statistieken" en nieuwe knop `#themeToggle` in de header.
- `tpl-home` uitgebreid met `#dailyQuizCard`, `#quizSearch` en `#categoryFilters`.
- Nieuw template `tpl-stats` met `#statsCards` en `#statsTableWrap`.
- Nieuw script-tag voor `js/views/stats.js`, correct tussen `helpers.js`/`storage.js` en
  `app.js` in geladen (de laadvolgorde blijft cruciaal, zie eerder in dit document).

### 🎨 css/style.css — nieuwe secties

`.theme-toggle`, `.filter-bar` / `.quiz-search` / `.chips`, `.daily-quiz`, `.stats-cards` /
`.stat-card`, `.confetti-layer` / `@keyframes confettiFall`, en een volledige
`[data-theme="dark"]`-sectie die alle CSS-variabelen uit `:root` overschrijft voor de
donkere modus — de rest van de opmaak hoefde niet aangepast te worden, omdat die overal al
`var(--naam)` gebruikte in plaats van vaste kleuren.
