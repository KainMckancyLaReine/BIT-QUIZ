// ============================================================
// views/stats.js — persoonlijke statistieken, opgebouwd uit de opgeslagen leaderboard-scores
// ============================================================
// Er wordt geen nieuwe opslag toegevoegd: alles hier wordt berekend uit de scores die
// je al opslaat op het resultaatscherm (localStorage-sleutel 'qm_scores', via storage.js).
// Speel je een quiz zonder je score op te slaan, dan telt die run hier niet mee — precies
// zoals bij het leaderboard.

function renderStats() {
  refreshQuizList(); // zorgt ervoor dat allQuizzes up-to-date is zodat quiznamen en -emoji's opgezocht kunnen worden
  renderTemplate('tpl-stats'); // laadt het statistiekenscherm in #app door het tpl-stats template te kloonen
  const scores = loadScores(); // haalt alle opgeslagen scores per quiz op uit de browser

  // --- Verzamel alle losse scores (van elke quiz) in één platte lijst ---
  const allEntries = []; // hier komt elke score-poging in te staan, ongeacht van welke quiz
  Object.keys(scores).forEach(quizId => { // loopt door elke quiz-id waarvoor scores bestaan
    (scores[quizId] || []).forEach(entry => allEntries.push({ ...entry, quizId })); // voegt elke score toe aan de platte lijst, met erbij welke quiz het was
  });

  const cardsEl = document.getElementById('statsCards'); // zoekt de container op waar de statistiek-kaarten in komen
  const tableEl = document.getElementById('statsTableWrap'); // zoekt de container op waar de tabel per quiz in komt

  if (allEntries.length === 0) { // als er nog helemaal geen scores opgeslagen zijn
    cardsEl.innerHTML = '<p class="lb-empty">Nog geen statistieken. Speel een quiz en sla je score op om hier je voortgang te zien!</p>'; // toont een vriendelijke lege melding
    tableEl.innerHTML = ''; // laat de tabel-container leeg
    return; // stopt de functie, er valt niets te berekenen
  }

  // --- Bereken de algemene statistieken ---
  const totalPlays   = allEntries.length; // het totaal aantal opgeslagen pogingen, over alle quizzes heen
  const uniqueQuizzes = new Set(allEntries.map(e => e.quizId)).size; // Set = verzameling zonder duplicaten: telt hoeveel VERSCHILLENDE quizzes je gespeeld hebt
  const avgPct = Math.round(allEntries.reduce((sum, e) => sum + e.pct, 0) / totalPlays); // reduce = loopt door de lijst en telt alle percentages bij elkaar op, daarna gedeeld door het aantal pogingen = gemiddelde
  const best   = allEntries.reduce((a, b) => (b.pct > a.pct || (b.pct === a.pct && b.seconds < a.seconds)) ? b : a); // zoekt de beste poging: hoogste percentage, en bij gelijke stand de snelste tijd
  const totalSeconds = allEntries.reduce((sum, e) => sum + (e.seconds || 0), 0); // telt de speeltijd van alle pogingen bij elkaar op
  const bestQuiz = allQuizzes.find(q => q.id === best.quizId); // zoekt de quiz op waar de beste score bij hoort, zodat de titel getoond kan worden

  cardsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${totalPlays}</div>
      <div class="stat-label">Quizzes voltooid</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${uniqueQuizzes}/${allQuizzes.length}</div>
      <div class="stat-label">Verschillende quizzes gespeeld</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${avgPct}%</div>
      <div class="stat-label">Gemiddelde score</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${best.pct}%</div>
      <div class="stat-label">Beste score${bestQuiz ? ' — ' + escapeHtml(bestQuiz.title) : ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${formatTime(totalSeconds)}</div>
      <div class="stat-label">Totale speeltijd</div>
    </div>
  `; // vult de kaarten-grid met de vijf berekende statistieken

  // --- Bouw een tabel met de beste score per quiz ---
  const perQuiz = {}; // hier komt per quiz-id de beste poging in te staan
  allEntries.forEach(e => { // loopt door elke poging
    const current = perQuiz[e.quizId]; // de tot nu toe beste poging voor deze quiz, of undefined als dit de eerste is
    if (!current || e.pct > current.pct || (e.pct === current.pct && e.seconds < current.seconds)) {
      perQuiz[e.quizId] = e; // bewaart deze poging als die beter is dan de vorige beste (hoger percentage, of bij gelijke stand sneller)
    }
  });

  const rows = Object.keys(perQuiz).map(quizId => { // zet elke quiz-id om in een rij voor de tabel
    const quiz  = allQuizzes.find(q => q.id === quizId); // zoekt de quiz op zodat titel en emoji getoond kunnen worden
    const entry = perQuiz[quizId]; // de beste score-poging voor deze quiz
    const plays = allEntries.filter(e => e.quizId === quizId).length; // telt hoeveel keer deze specifieke quiz opgeslagen is
    return { quiz, entry, plays };
  }).filter(r => r.quiz) // verwijdert rijen waarvan de quiz niet meer bestaat (bijv. een verwijderde eigen quiz)
    .sort((a, b) => b.entry.pct - a.entry.pct); // sorteert van hoogste naar laagste beste score

  tableEl.innerHTML = rows.length === 0 ? '' : `
    <table class="lb-table">
      <thead>
        <tr>
          <th>Quiz</th>
          <th>Keer gespeeld</th>
          <th>Beste score</th>
          <th>Beste tijd</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.quiz.emoji || '❓'} ${escapeHtml(r.quiz.title)}</td>
            <td>${r.plays}</td>
            <td class="score">${r.entry.score}/${r.entry.total} (${r.entry.pct}%)</td>
            <td>${formatTime(r.entry.seconds)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `; // bouwt de tabel met één rij per gespeelde quiz, gesorteerd op beste score
}
