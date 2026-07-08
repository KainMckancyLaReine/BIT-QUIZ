// ============================================================
// views/home.js — startscherm met quiz-van-de-dag, zoeken/filteren en alle quiz-kaarten
// ============================================================

// --- Kleine emoji-indicator per moeilijkheidsgraad, gebruikt op de kaarten ---
var DIFFICULTY_LABELS = {
  makkelijk: '🟢 Makkelijk',
  gemiddeld: '🟡 Gemiddeld',
  moeilijk:  '🔴 Moeilijk'
};

// --- Kies een "quiz van de dag": elke dag dezelfde quiz, maar morgen weer een andere ---
function pickDailyQuiz(list) {
  if (!list.length) return null; // als er geen quizzes zijn zeker niets teruggeven, anders crasht de modulo-berekening hieronder
  const start = new Date(new Date().getFullYear(), 0, 0); // 0 januari van dit jaar = de dag vóór 1 januari, gebruikt als startpunt om het dagnummer te berekenen
  const diff  = new Date() - start; // het verschil in milliseconden tussen nu en het begin van het jaar
  const dayOfYear = Math.floor(diff / 86400000); // 86400000 = het aantal milliseconden in een dag → geeft het huidige dagnummer van het jaar (1, 2, 3, ...)
  return list[dayOfYear % list.length]; // % = modulo: "wikkelt" het dagnummer terug binnen de lengte van de lijst, zodat elke dag een geldige quiz uitkomt en de keuze na verloop van tijd weer verandert
}

function renderHome() {
  refreshQuizList(); // zorgt ervoor dat de lijst met quizzes up-to-date is voordat de kaarten getekend worden
  renderTemplate('tpl-home'); // laadt het startscherm in #app door het tpl-home template te kloonen

  const grid       = document.getElementById('quizGrid'); // container waar alle quiz-kaarten in komen
  const searchInput = document.getElementById('quizSearch'); // het zoekveld
  const chipsWrap   = document.getElementById('categoryFilters'); // container voor de categorie-knopjes
  const dailyWrap   = document.getElementById('dailyQuizCard'); // container voor de "quiz van de dag"-kaart

  // --- Quiz van de dag bovenaan tonen ---
  const daily = pickDailyQuiz(allQuizzes); // bepaalt welke quiz vandaag uitgelicht wordt
  if (daily) {
    dailyWrap.innerHTML = `
      <div class="daily-quiz" id="dailyQuizBtn">
        <span class="daily-badge">⭐ Quiz van de dag</span>
        <div class="daily-body">
          <div class="emoji-wrap">${daily.emoji || '❓'}</div>
          <div>
            <h3>${escapeHtml(daily.title)}</h3>
            <p class="desc">${escapeHtml(daily.description || '')}</p>
          </div>
        </div>
        <span class="btn btn-yellow">Speel nu →</span>
      </div>
    `; // toont een uitgelichte kaart met de quiz van vandaag, in dezelfde stijl als de rest van de app
    document.getElementById('dailyQuizBtn').addEventListener('click', () => navigate('play', { quizId: daily.id })); // start de quiz van de dag direct bij een klik
  }

  // --- Categorie-knopjes opbouwen op basis van alle beschikbare quizzes ---
  const categories = Array.from(new Set(allQuizzes.map(q => q.category || 'Overig'))).sort(); // Set = verwijdert dubbele categorieën, Array.from zet de Set weer om in een array, sort() zet ze op alfabetische volgorde
  let activeCategory = 'Alle'; // begint met alle categorieën zichtbaar
  let searchTerm = ''; // begint met een leeg zoekveld

  function renderChips() {
    const all = ['Alle', ...categories]; // 'Alle' staat altijd als eerste knop, gevolgd door elke categorie
    chipsWrap.innerHTML = all.map(cat => // map = zet elke categorienaam om in een knop-HTML-string
      `<button type="button" class="chip ${cat === activeCategory ? 'active' : ''}" data-cat="${escapeAttr(cat)}">${escapeHtml(cat)}</button>`
    ).join(''); // join('') = plakt alle knop-strings aan elkaar zonder scheidingsteken
    chipsWrap.querySelectorAll('.chip').forEach(chip => { // koppelt aan elke knop een klik-actie
      chip.addEventListener('click', () => {
        activeCategory = chip.dataset.cat; // onthoudt welke categorie nu actief is
        renderChips(); // hertekent de knopjes zodat de juiste knop gemarkeerd wordt
        renderGrid(); // hertekent de quiz-kaarten met het nieuwe filter
      });
    });
  }

  // --- De quiz-kaarten zelf tekenen, rekening houdend met zoekterm + categorie ---
  function renderGrid() {
    const term = searchTerm.trim().toLowerCase(); // maakt de zoekterm klein geschreven zodat de zoekopdracht niet hoofdlettergevoelig is
    const filtered = allQuizzes.filter(q => { // filter = houdt alleen de quizzes over die aan de voorwaarden voldoen
      const matchesCategory = activeCategory === 'Alle' || (q.category || 'Overig') === activeCategory; // een quiz mag alleen getoond worden als 'Alle' actief is, of als de categorie exact overeenkomt
      const haystack = (q.title + ' ' + (q.description || '')).toLowerCase(); // plakt titel en beschrijving samen zodat er in beide gezocht kan worden
      const matchesSearch = !term || haystack.includes(term); // een quiz mag alleen getoond worden als het zoekveld leeg is, of als de zoekterm ergens in titel/beschrijving voorkomt
      return matchesCategory && matchesSearch; // een quiz moet aan BEIDE voorwaarden voldoen om getoond te worden
    });

    grid.innerHTML = ''; // maakt het grid leeg voordat de (mogelijk nieuwe) resultaten getekend worden
    if (filtered.length === 0) { // als er na filteren niets overblijft
      grid.innerHTML = '<p class="lb-empty">Geen quizzes gevonden. Probeer een andere zoekterm of categorie.</p>'; // toont een vriendelijke lege melding
      return;
    }

    filtered.forEach(q => { // loopt door elke overgebleven quiz en maakt er een klikbare kaart van
      const card = document.createElement('article'); // maakt een nieuw kaart-element aan dat straks op het scherm komt
      card.className = 'quiz-card'; // geeft de kaart de juiste opmaak via CSS
      const diffLabel = DIFFICULTY_LABELS[q.difficulty] || ''; // zoekt de bijpassende moeilijkheids-tekst op, of een lege string als er geen moeilijkheidsgraad is ingesteld
      card.innerHTML = `
        ${q._custom ? '<span class="badge custom">Eigen</span>' : '<span class="badge">Standaard</span>'}
        <div class="emoji-wrap">${q.emoji || '❓'}</div>
        <h3>${escapeHtml(q.title)}</h3>
        <p class="desc">${escapeHtml(q.description || '')}</p>
        <div class="meta">
          <span>📝 ${q.questions.length} vragen</span>
          <span>⏱ ${estimatedDuration(q)}</span>
        </div>
        ${diffLabel ? `<div class="meta"><span>${diffLabel}</span><span>${escapeHtml(q.category || '')}</span></div>` : ''}
      `; // vult de kaart met badge, emoji, titel, beschrijving, aantal vragen + speeltijd, en (indien aanwezig) de moeilijkheidsgraad en categorie
      card.addEventListener('click', () => navigate('play', { quizId: q.id })); // zorgt ervoor dat klikken op de kaart de quiz opent
      grid.appendChild(card); // plaatst de afgewerkte kaart op het scherm in de quiz-grid
    });
  }

  searchInput.addEventListener('input', () => { // luistert naar elke toetsaanslag in het zoekveld
    searchTerm = searchInput.value; // onthoudt de actuele zoektekst
    renderGrid(); // hertekent de kaarten meteen met de nieuwe zoekterm (geen aparte zoekknop nodig)
  });

  renderChips(); // tekent de categorie-knopjes bij het openen van het scherm
  renderGrid();  // tekent de quiz-kaarten bij het openen van het scherm
}
