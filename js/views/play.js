// ============================================================
// views/play.js — quiz spelen: vragen tonen, antwoorden kiezen, timer bijhouden
// ============================================================

function renderPlay({ quizId }) {
  refreshQuizList(); // zorgt ervoor dat allQuizzes up-to-date is voordat de quiz gezocht wordt
  const quiz = allQuizzes.find(q => q.id === quizId); // zoekt de quiz op in de lijst op basis van het meegegeven id
  if (!quiz) { navigate('home'); return; } // als de quiz niet gevonden wordt stuurt het de gebruiker terug naar het startscherm

  renderTemplate('tpl-play'); // laadt het speelscherm in #app door het tpl-play template te kloonen

  playState = { // slaat alle informatie op over de lopende quiz zodat alle functies er bij kunnen
    quiz,           // het quiz-object met alle vragen en antwoorden
    idx: 0,         // begint bij de eerste vraag, index 0
    selected: null, // er is nog geen antwoord gekozen
    answers: [],    // hier worden de gegeven antwoorden bijgehouden zodat de feedback achteraf getoond kan worden
    seconds: 0,     // de timer begint op 0 seconden
    score: 0        // de score begint op 0 punten
  };

  document.getElementById('playTitle').textContent = quiz.title; // toont de naam van de quiz bovenaan het speelscherm
  document.getElementById('playSub').textContent = `${quiz.questions.length} vragen · Geschat ${estimatedDuration(quiz)}`; // toont hoeveel vragen er zijn en hoe lang de quiz ongeveer duurt

  timerInterval = setInterval(() => { // start de timer die elke seconde bijhoudt hoe lang de gebruiker bezig is
    playState.seconds++; // telt één seconde op bij de speeltijd zodat de totale tijd bijgehouden wordt
    document.getElementById('timerValue').textContent = formatTime(playState.seconds); // werkt de klok op het scherm bij zodat de gebruiker de verstreken tijd kan zien
  }, 1000); // herhaalt dit elke 1000 milliseconden, dat is elke seconde

  document.getElementById('nextBtn').addEventListener('click', onNext); // koppelt de volgende-knop aan de functie die naar de volgende vraag gaat of de quiz afrondt
  document.getElementById('quitBtn').addEventListener('click', () => { // koppelt de stop-knop aan een bevestigingsvenster
    if (confirm('Weet je zeker dat je wilt stoppen? Je voortgang gaat verloren.')) { // vraagt de gebruiker om bevestiging voordat de quiz gestopt wordt
      navigate('home'); // stuurt de gebruiker terug naar het startscherm als die bevestigt
    }
  });

  showQuestion(); // toont de eerste vraag op het scherm zodat de quiz meteen kan beginnen
}

// --- Toon de huidige vraag op het scherm ---
function showQuestion() {
  const { quiz, idx } = playState; // haalt de quiz en het huidige vraagnummer op uit de speldata
  const q     = quiz.questions[idx]; // zoekt de huidige vraag op in de vragen-array op basis van het vraagnummer
  const total = quiz.questions.length; // het totale aantal vragen in de quiz

  renderQuestionImage(document.getElementById('questionImage'), q, quiz.theme); // plaatst de afbeelding of SVG bij de vraag

  document.getElementById('questionText').textContent = q.question; // toont de vraagtekst op het scherm
  document.getElementById('qCount').textContent = `Vraag ${idx + 1} van ${total}`; // toont het vraagnummer, bijvoorbeeld "Vraag 3 van 10" — idx + 1 omdat vragen voor de gebruiker bij 1 beginnen in plaats van bij 0
  const pct = Math.round((idx / total) * 100); // berekent hoeveel procent van de quiz de gebruiker al voltooid heeft
  document.getElementById('qPct').textContent = `${pct}%`; // toont het voltooide percentage naast de voortgangsbalk
  document.getElementById('progressFill').style.width = pct + '%'; // past de breedte van de gekleurde voortgangsbalk aan zodat de gebruiker visueel ziet hoe ver die is

  const wrap = document.getElementById('answers'); // zoekt de container op waar de antwoordknoppen in geplaatst worden
  wrap.innerHTML = ''; // verwijdert de antwoordknoppen van de vorige vraag zodat alleen de knoppen van de huidige vraag zichtbaar zijn
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']; // de letters die voor de antwoordknoppen geplaatst worden

  q.answers.forEach((ans, i) => { // loopt door elk antwoord van de vraag en maakt er een knop van
    const btn = document.createElement('button'); // maakt een nieuwe knop aan voor dit antwoord
    btn.className = 'answer'; // geeft de knop de juiste opmaak via CSS
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(ans)}</span>`; // vult de knop met de letter, bijvoorbeeld "A", en de antwoordtekst
    btn.addEventListener('click', () => onSelect(i, btn)); // zorgt ervoor dat klikken op de knop het antwoord selecteert
    wrap.appendChild(btn); // plaatst de knop op het scherm
  });

  playState.selected = null; // reset de selectie zodat er voor de nieuwe vraag nog geen antwoord gekozen is
  const nextBtn = document.getElementById('nextBtn'); // zoekt de volgende-knop op
  nextBtn.disabled = true; // zet de volgende-knop uit zodat de gebruiker verplicht eerst een antwoord moet kiezen
  nextBtn.textContent = (idx === total - 1) ? 'Afronden ✓' : 'Volgende →'; // toont "Afronden" als dit de laatste vraag is, anders "Volgende"
}

// --- Verwerk het gekozen antwoord ---
function onSelect(i, btn) {
  playState.selected = i; // slaat het indexnummer van het gekozen antwoord op zodat het later vergeleken kan worden met het juiste antwoord
  document.querySelectorAll('.answer').forEach(b => b.classList.remove('selected')); // verwijdert de markering van alle antwoordknoppen zodat de gebruiker van keuze kan wisselen
  btn.classList.add('selected'); // markeert de geklikte knop als geselecteerd zodat de gebruiker ziet wat hij gekozen heeft
  document.getElementById('nextBtn').disabled = false; // activeert de volgende-knop zodat de gebruiker verder kan gaan
}

// --- Verwerk de klik op "Volgende" ---
function onNext() {
  const { quiz, idx, selected } = playState; // haalt de huidige quiz, het vraagnummer en het gekozen antwoord op uit de speldata
  const correctIdx = quiz.questions[idx].correct; // leest het indexnummer van het juiste antwoord voor deze vraag uit de quiz-data
  const isCorrect  = selected === correctIdx; // vergelijkt het gekozen antwoord met het juiste antwoord om te bepalen of het goed of fout is
  if (isCorrect) playState.score++; // als het antwoord goed is wordt de score met 1 verhoogd

  playState.answers.push({ // slaat het gegeven antwoord op in de lijst zodat de feedback achteraf per vraag getoond kan worden
    question: quiz.questions[idx].question, // de vraagtekst van de huidige vraag
    selected,                               // het indexnummer van het gekozen antwoord
    correct:  correctIdx,                   // het indexnummer van het juiste antwoord
    answers:  quiz.questions[idx].answers,  // alle antwoordopties van de vraag
    isCorrect                               // of het gekozen antwoord goed of fout was
  });

  if (idx + 1 >= quiz.questions.length) { // controleert of alle vragen beantwoord zijn
    clearInterval(timerInterval); // stopt de timer zodat de eindtijd vastgelegd is
    timerInterval = null; // reset de timer-variabele zodat duidelijk is dat er geen timer meer loopt
    navigate('result'); // gaat naar het resultaatscherm zodat de score en feedback getoond kunnen worden
  } else {
    playState.idx++; // verhoogt het vraagnummer zodat de volgende vraag geladen wordt
    showQuestion(); // tekent de volgende vraag op het scherm
  }
}
