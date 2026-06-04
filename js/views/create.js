// ============================================================
// views/create.js — eigen quiz bouwen via een formulier
// ============================================================

function renderCreate() {
  renderTemplate('tpl-create'); // laadt het aanmaakscherm in #app door het tpl-create template te kloonen
  const builder = document.getElementById('qBuilder'); // zoekt de container op waar de vraagkaarten in geplaatst worden

  // --- Voeg één vraagkaart toe aan het formulier ---
  function addQuestion(q = null) {
    const idx  = builder.children.length; // telt het huidige aantal vraagkaarten zodat het nieuwe kaartnummer bepaald kan worden
    const card = document.createElement('div'); // maakt een nieuw div-element aan voor de vraagkaart
    card.className   = 'q-card'; // geeft de kaart de juiste opmaak via CSS
    card.dataset.idx = idx; // slaat het indexnummer op in de kaart zodat later bij verwijdering hernummerd kan worden
    card.innerHTML = `
      <div class="q-card-top">
        <h4>Vraag ${idx + 1}</h4>
        <button type="button" class="remove">✕ verwijderen</button>
      </div>
      <input type="text" class="q-text" placeholder="Typ hier de vraag..." value="${q ? escapeAttr(q.question) : ''}" />
      <div class="answers-grid">
        ${[0,1,2,3].map(i => `
          <label class="answer-row">
            <input type="radio" name="correct-${idx}" value="${i}" ${q && q.correct === i ? 'checked' : (i === 0 && !q ? 'checked' : '')} />
            <input type="text" class="q-ans" placeholder="Antwoord ${i+1}" value="${q ? escapeAttr(q.answers[i] || '') : ''}" />
          </label>
        `).join('')}
      </div>
    `; // vult de kaart met een kop met het vraagnummer en een verwijderknop, een tekstveld voor de vraag en vier rijen met een keuzerondje en een tekstveld voor elk antwoord — als er een bestaande vraag meegegeven is worden de velden vooraf ingevuld
    card.querySelector('.remove').addEventListener('click', () => { // luistert naar klikken op de verwijderknop van deze kaart
      card.remove(); // verwijdert de vraagkaart uit het formulier
      renumber(); // hernummert de resterende kaarten zodat de nummering weer klopt
    });
    builder.appendChild(card); // plaatst de nieuwe vraagkaart onderaan het formulier
  }

  // --- Hernummer alle vraagkaarten na het verwijderen van een kaart ---
  function renumber() {
    Array.from(builder.children).forEach((c, i) => { // loopt door alle resterende vraagkaarten
      c.querySelector('h4').textContent = `Vraag ${i + 1}`; // werkt het vraagnummer in de kop bij zodat de nummering weer opeenvolgend is
      c.dataset.idx = i; // werkt het indexnummer in de kaart bij
      c.querySelectorAll('input[type=radio]').forEach(r => r.name = `correct-${i}`); // werkt de groepsnaam van de keuzerondjes bij zodat ze per vraag gegroepeerd blijven
    });
  }

  addQuestion(); // voegt direct één lege vraagkaart toe zodat de gebruiker meteen kan beginnen met invullen

  document.getElementById('addQuestionBtn').addEventListener('click', () => addQuestion()); // voegt een nieuwe lege vraagkaart toe als de gebruiker op "+ Vraag toevoegen" klikt

  // --- Lees alle ingevulde velden uit en bouw er een quiz-object van ---
  function collect() {
    const title = document.getElementById('cTitle').value.trim(); // leest de naam van de quiz uit het titelveld — dit is de naam die straks op de quiz-kaart getoond wordt
    const desc  = document.getElementById('cDesc').value.trim(); // leest de beschrijving van de quiz uit het beschrijvingsveld
    const emoji = document.getElementById('cEmoji').value.trim() || '✨'; // leest de emoji uit het emojiveld, of gebruikt een ster als het veld leeg is
    if (!title) throw new Error('Geef je quiz een titel.'); // als het titelveld leeg is gooit het een fout zodat er geen naamloze quiz opgeslagen wordt

    const qs = Array.from(builder.children).map(card => { // loopt door alle vraagkaarten en leest de ingevulde gegevens uit
      const q       = card.querySelector('.q-text').value.trim(); // leest de vraagtekst uit het tekstveld van deze kaart
      const ansEls  = card.querySelectorAll('.q-ans'); // zoekt alle antwoordvelden van deze kaart op
      const answers = Array.from(ansEls).map(a => a.value.trim()); // leest de tekst uit elk antwoordveld zodat er een lijst van antwoorden ontstaat
      const correctEl = card.querySelector('input[type=radio]:checked'); // zoekt het aangevinkte keuzerondje op om te weten welk antwoord als juist gemarkeerd is
      const correct   = correctEl ? parseInt(correctEl.value, 10) : 0; // leest het indexnummer van het juiste antwoord uit het aangevinkte keuzerondje
      if (!q) throw new Error('Een vraag heeft geen tekst.'); // als de vraagtekst leeg is gooit het een fout
      if (answers.some(a => !a)) throw new Error('Elke vraag moet 4 antwoorden hebben.'); // als een van de antwoordvelden leeg is gooit het een fout
      return { question: q, answers, correct, image: emoji }; // geeft het vraag-object terug met de vraagtekst, de antwoorden, het juiste antwoord en de emoji als afbeelding
    });
    if (qs.length === 0) throw new Error('Voeg minstens één vraag toe.'); // als er geen vragen zijn gooit het een fout

    return { // geeft het volledige quiz-object terug dat opgeslagen of gedownload kan worden
      id: 'custom-' + Date.now(), // genereert een uniek id op basis van het huidige tijdstip zodat elke quiz een eigen id heeft
      title,
      description: desc,
      emoji,
      theme: 'custom', // gebruikt het groene custom-thema voor eigen gemaakte quizzes
      questions: qs    // de lijst van vraag-objecten die hierboven opgebouwd is
    };
  }

  document.getElementById('saveQuizBtn').addEventListener('click', () => { // luistert naar de klik op de opslaan-knop
    const status = document.getElementById('createStatus'); // zoekt het status-element op voor bevestigingen en foutmeldingen
    try {
      const quiz   = collect(); // leest alle ingevulde velden uit en bouwt er een quiz-object van
      const custom = loadCustom(); // haalt de bestaande eigen quizzes op uit de browser zodat de nieuwe quiz toegevoegd kan worden
      custom.push(quiz); // voegt de nieuwe quiz toe aan de lijst van eigen quizzes
      saveCustom(custom); // slaat de bijgewerkte lijst op in de browser zodat de quiz bewaard blijft
      status.classList.remove('error'); // verwijdert een eventuele rode foutmelding
      status.textContent = `✓ Quiz "${quiz.title}" opgeslagen! Je vindt 'm in het overzicht.`; // toont een bevestiging zodat de gebruiker weet dat de quiz opgeslagen is
      setTimeout(() => navigate('home'), 900); // wacht 0,9 seconden zodat de gebruiker de bevestiging kan lezen en navigeert dan naar het startscherm
    } catch (e) {
      status.classList.add('error'); // geeft de foutmelding een rode kleur
      status.textContent = e.message; // toont de foutmelding zodat de gebruiker weet wat er ontbreekt of mis is
    }
  });

  document.getElementById('downloadQuizBtn').addEventListener('click', () => { // luistert naar de klik op de download-knop
    const status = document.getElementById('createStatus'); // zoekt het status-element op
    try {
      const quiz = collect(); // leest alle ingevulde velden uit en bouwt er een quiz-object van
      const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' }); // zet het quiz-object om naar een netjes opgemaakte JSON-tekst en verpakt die als downloadbaar bestand
      const url  = URL.createObjectURL(blob); // maakt een tijdelijke download-link aan voor het bestand
      const a    = document.createElement('a'); // maakt een onzichtbare link aan die de download triggert
      a.href     = url; // koppelt de download-link aan het bestand
      a.download = quiz.title.replace(/\s+/g, '_').toLowerCase() + '.json'; // bepaalt de bestandsnaam op basis van de quiz-titel, waarbij spaties vervangen worden door underscores
      a.click(); // simuleert een klik op de link zodat de browser het bestand downloadt
      URL.revokeObjectURL(url); // verwijdert de tijdelijke link om geheugen vrij te maken
      status.classList.remove('error'); // verwijdert een eventuele rode foutmelding
      status.textContent = '✓ Bestand gedownload — je kunt het delen of later importeren.'; // toont een bevestiging zodat de gebruiker weet dat het downloaden gelukt is
    } catch (e) {
      status.classList.add('error'); // geeft de foutmelding een rode kleur
      status.textContent = e.message; // toont de foutmelding zodat de gebruiker weet wat er mis is
    }
  });
}
