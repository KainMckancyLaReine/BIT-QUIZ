// ============================================================
// views/leaderboard.js — highscores per quiz tonen
// ============================================================

function renderLeaderboard() {
  refreshQuizList(); // zorgt ervoor dat allQuizzes up-to-date is voordat de scores per quiz getoond worden
  renderTemplate('tpl-leaderboard'); // laadt het leaderboard-scherm in #app door het tpl-leaderboard template te kloonen
  const list   = document.getElementById('lbList'); // zoekt de container op waar alle score-tabellen in geplaatst worden
  const scores = loadScores(); // haalt alle opgeslagen scores op uit de browser zodat ze getoond kunnen worden

  allQuizzes.forEach(q => { // loopt door elke quiz en maakt er een score-sectie van
    const section = document.createElement('section'); // maakt een nieuw sectie-element aan voor deze quiz
    section.className = 'lb-section'; // geeft de sectie de juiste opmaak via CSS
    const entries = (scores[q.id] || []).slice(0, 10); // haalt de scores op voor deze quiz en beperkt het tot de top 10 — als er geen scores zijn geeft het een lege lijst

    let body;
    if (entries.length === 0) {
      body = '<p class="lb-empty">Nog geen scores. Speel deze quiz en sla je score op!</p>'; // toont een lege melding als er nog geen scores zijn voor deze quiz
    } else {
      body = `
        <table class="lb-table">
          <thead>
            <tr>
              <th class="rank">#</th>
              <th>Naam</th>
              <th>Tijd</th>
              <th class="score">Score</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map((e, i) => `
              <tr>
                <td class="rank">${i + 1}</td>
                <td>${escapeHtml(e.name)}</td>
                <td>${formatTime(e.seconds)}</td>
                <td class="score">${e.score}/${e.total} (${e.pct}%)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `; // bouwt een tabel met voor elke score een rij met de rangschikking, de naam, de speeltijd en het resultaat — i + 1 omdat de rangschikking bij 1 begint in plaats van bij 0
    }

    section.innerHTML = `<h3>${q.emoji || '❓'} ${escapeHtml(q.title)}</h3>${body}`; // vult de sectie met de naam van de quiz en daarna de tabel of de lege melding
    list.appendChild(section); // plaatst de sectie op het scherm
  });

  document.getElementById('clearLbBtn').addEventListener('click', () => { // luistert naar de klik op de leegmaken-knop
    if (confirm('Weet je zeker dat je alle scores wilt verwijderen?')) { // vraagt bevestiging voordat alle scores gewist worden
      localStorage.removeItem(STORAGE_KEYS.SCORES); // verwijdert alle opgeslagen scores uit de browser
      renderLeaderboard(); // herlaadt het leaderboard zodat het lege scherm getoond wordt
    }
  });
}
