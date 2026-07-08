// ============================================================
// views/result.js — score en feedback tonen na de quiz
// ============================================================

function renderResult() {
  if (!playState) { navigate('home'); return; } // als er geen speldata is stuurt het de gebruiker terug naar het startscherm
  renderTemplate('tpl-result'); // laadt het resultaatscherm in #app door het tpl-result template te kloonen

  const { quiz, score, answers, seconds } = playState; // haalt de quiz, de score, de gegeven antwoorden en de speeltijd op uit de speldata
  const total = quiz.questions.length; // het totale aantal vragen in de quiz
  const pct   = Math.round((score / total) * 100); // berekent het scorepercentage door de behaalde score te delen door het totaal en met 100 te vermenigvuldigen

  let emoji = '🎉', title = 'Goed gedaan!'; // standaard emoji en titel als de score tussen 40% en 60% ligt
  if (pct === 100) { emoji = '🏆'; title = 'Perfect! Wat een topscore!'; fireConfetti(); } // bij een perfecte score wordt ook een korte confetti-animatie afgevuurd (zie fireConfetti() in helpers.js)
  else if (pct >= 80) { emoji = '🌟'; title = 'Indrukwekkend!'; }                  // bij 80% of hoger
  else if (pct >= 60) { emoji = '👍'; title = 'Netjes gedaan!'; }                  // bij 60% of hoger
  else if (pct >= 40) { emoji = '💪'; title = 'Niet slecht — probeer nog eens!'; } // bij 40% of hoger
  else { emoji = '📚'; title = 'Oefening baart kunst!'; }                          // bij minder dan 40%

  document.getElementById('resultEmoji').textContent = emoji; // toont de passende emoji op het resultaatscherm op basis van de behaalde score
  document.getElementById('resultTitle').textContent = title; // toont de passende tekst op het resultaatscherm op basis van de behaalde score
  document.getElementById('resultScore').textContent = `${score}/${total}`; // toont de behaalde score als breuk, bijvoorbeeld "7/10"
  document.getElementById('resultPct').textContent   = `${pct}%`; // toont het scorepercentage, bijvoorbeeld "70%"

  document.getElementById('saveScoreBtn').addEventListener('click', () => { // luistert naar de klik op de opslaan-knop
    const name   = (document.getElementById('playerName').value || '').trim(); // leest de naam die de gebruiker ingetypt heeft uit het invoerveld
    const status = document.getElementById('saveStatus'); // zoekt het status-element op waar de bevestiging of foutmelding in getoond wordt
    if (!name) { // als het naamveld leeg is
      status.textContent = 'Vul eerst een naam in om je score op te slaan.'; // toont een foutmelding zodat de gebruiker weet wat er ontbreekt
      status.classList.add('error'); // geeft de foutmelding een rode kleur via CSS
      return; // stopt de functie zodat er geen lege naam opgeslagen wordt
    }
    const scores = loadScores(); // haalt alle bestaande scores op uit de browser zodat de nieuwe score toegevoegd kan worden
    if (!scores[quiz.id]) scores[quiz.id] = []; // maakt een lege lijst aan voor deze quiz als er nog geen scores voor deze quiz zijn
    scores[quiz.id].push({ name, score, total, pct, seconds, date: new Date().toISOString() }); // voegt de nieuwe score toe aan de lijst met de naam, het resultaat en de speeltijd
    scores[quiz.id].sort((a, b) => b.pct - a.pct || a.seconds - b.seconds); // sorteert de scores van hoog naar laag percentage, en bij gelijk percentage van snel naar langzaam zodat het leaderboard correct gesorteerd is
    scores[quiz.id] = scores[quiz.id].slice(0, 50); // bewaart maximaal 50 scores per quiz zodat de opslag niet eindeloos groeit
    saveScores(scores); // slaat alle scores permanent op in de browser — dit is de regel die de score écht bewaart
    status.classList.remove('error'); // verwijdert de eventuele rode foutmelding
    status.textContent = `Score opgeslagen voor ${name}! 🎉`; // toont een bevestiging zodat de gebruiker weet dat de score bewaard is
    document.getElementById('saveScoreBtn').disabled = true; // zet de opslaan-knop uit zodat de score niet twee keer opgeslagen kan worden
    document.getElementById('playerName').disabled   = true; // zet het naamveld uit zodat het niet meer aangepast kan worden na het opslaan
  });

  document.getElementById('retryBtn').addEventListener('click', () => navigate('play', { quizId: quiz.id })); // start de quiz opnieuw als de gebruiker op "Opnieuw spelen" klikt
  document.getElementById('homeBtn').addEventListener('click', () => navigate('home')); // stuurt de gebruiker terug naar het startscherm als die op "Terug naar overzicht" klikt

  const list = document.getElementById('feedbackList'); // zoekt de feedbacklijst op waar de resultaten per vraag in komen
  answers.forEach((a, i) => { // loopt door elk gegeven antwoord en maakt er een feedbackregel van
    const li = document.createElement('li'); // maakt een nieuw lijstitem aan voor deze vraag
    li.className = 'feedback-item ' + (a.isCorrect ? 'good' : 'bad'); // geeft het item een groene kleur als het goed was, of een rode kleur als het fout was
    const correctText  = a.answers[a.correct]; // haalt de tekst van het juiste antwoord op zodat die getoond kan worden als de gebruiker het fout had
    const selectedText = a.selected != null ? a.answers[a.selected] : '(geen antwoord)'; // haalt de tekst van het gekozen antwoord op, of toont "(geen antwoord)" als er niets gekozen was
    li.innerHTML = `
      <div class="feedback-q">${i + 1}. ${escapeHtml(a.question)}</div>
      <p class="feedback-a">Jouw antwoord: <strong>${escapeHtml(selectedText)}</strong> ${a.isCorrect ? '✅' : '❌'}</p>
      ${!a.isCorrect ? `<p class="feedback-a">Juiste antwoord: <strong>${escapeHtml(correctText)}</strong></p>` : ''}
    `; // vult het lijstitem met het vraagnummer, de vraagtekst, het gekozen antwoord met een vinkje of kruis, en als het fout was ook het juiste antwoord
    list.appendChild(li); // plaatst de feedbackregel in de lijst zodat die zichtbaar wordt op het scherm
  });
}
