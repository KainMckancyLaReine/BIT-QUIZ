// ============================================================
// views/home.js — startscherm met alle quiz-kaarten
// ============================================================

function renderHome() {
  refreshQuizList(); // zorgt ervoor dat de lijst met quizzes up-to-date is voordat de kaarten getekend worden
  renderTemplate('tpl-home'); // laadt het startscherm in #app door het tpl-home template te kloonen
  const grid = document.getElementById('quizGrid'); // zoekt de container op waar alle quiz-kaarten in geplaatst worden

  allQuizzes.forEach(q => { // loopt door elke quiz in de lijst en maakt er een klikbare kaart van
    const card = document.createElement('article'); // maakt een nieuw kaart-element aan dat straks op het scherm komt
    card.className = 'quiz-card'; // geeft de kaart de juiste opmaak via CSS
    card.innerHTML = `
      ${q._custom ? '<span class="badge custom">Eigen</span>' : '<span class="badge">Standaard</span>'}
      <div class="emoji-wrap">${q.emoji || '❓'}</div>
      <h3>${escapeHtml(q.title)}</h3>
      <p class="desc">${escapeHtml(q.description || '')}</p>
      <div class="meta">
        <span>📝 ${q.questions.length} vragen</span>
        <span>⏱ ${estimatedDuration(q)}</span>
      </div>
    `; // vult de kaart met alle quiz-informatie: een badge die aangeeft of het eigen of standaard is, de emoji, de titel, de beschrijving en het aantal vragen met de geschatte speeltijd
    card.addEventListener('click', () => navigate('play', { quizId: q.id })); // zorgt ervoor dat klikken op de kaart de quiz opent door naar het speelscherm te navigeren met het id van deze quiz
    grid.appendChild(card); // plaatst de afgewerkte kaart op het scherm in de quiz-grid
  });
}
