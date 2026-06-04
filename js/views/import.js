// ============================================================
// views/import.js — quiz importeren via bestandsupload of drag & drop
// ============================================================

function renderImport() {
  renderTemplate('tpl-import'); // laadt het importscherm in #app door het tpl-import template te kloonen
  const input  = document.getElementById('fileInput'); // zoekt het verborgen bestandsinvoerveld op dat de bestandskiezer opent
  const dz     = document.querySelector('.dropzone'); // zoekt het dropzone-vlak op waar bestanden naartoe gesleept kunnen worden
  const status = document.getElementById('importStatus'); // zoekt het status-element op voor bevestigingen en foutmeldingen

  // --- Verwerk het gekozen of gesleepte bestand ---
  function handleFile(file) {
    if (!file) return; // als er geen bestand is stopt de functie meteen
    const reader = new FileReader(); // maakt een FileReader aan waarmee de inhoud van het bestand gelezen kan worden
    reader.onload = () => { // wordt uitgevoerd zodra de browser het bestand klaar heeft gelezen
      try {
        const data = JSON.parse(reader.result); // zet de gelezen bestandstekst om naar een JavaScript-object zodat de app er mee kan werken
        validateQuiz(data); // controleert of het object een geldige quiz is — gooit een fout als er iets ontbreekt of niet klopt
        const custom = loadCustom(); // haalt de bestaande eigen quizzes op uit de browser zodat de geïmporteerde quiz toegevoegd kan worden
        if (!data.id) data.id = 'custom-' + Date.now(); // genereert een uniek id als de geïmporteerde quiz er geen heeft
        custom.push(data); // voegt de geïmporteerde quiz toe aan de lijst van eigen quizzes
        saveCustom(custom); // slaat de bijgewerkte lijst op in de browser zodat de quiz bewaard blijft
        status.classList.remove('error'); // verwijdert een eventuele rode foutmelding
        status.textContent = `✓ Quiz "${data.title}" succesvol geïmporteerd!`; // toont een bevestiging zodat de gebruiker weet dat het importeren gelukt is
        setTimeout(() => navigate('home'), 1100); // wacht 1,1 seconden zodat de gebruiker de bevestiging kan lezen en navigeert dan naar het startscherm
      } catch (e) {
        status.classList.add('error'); // geeft de foutmelding een rode kleur
        status.textContent = 'Fout bij importeren: ' + e.message; // toont de foutmelding zodat de gebruiker weet waarom het importeren mislukt is
      }
    };
    reader.readAsText(file); // instrueert de browser om de inhoud van het bestand als tekst te lezen — dit start het leesproces en roept daarna onload aan
  }

  input.addEventListener('change', (e) => handleFile(e.target.files[0])); // luistert naar het kiezen van een bestand via de bestandskiezer en verwerkt het gekozen bestand

  ['dragenter', 'dragover'].forEach(ev => // luistert naar de sleepbewegingen boven de dropzone
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dragover'); }) // voorkomt het standaard browser-gedrag zodat bestanden gedropt kunnen worden, en voegt een visuele markering toe zodat de gebruiker ziet dat het dropzone actief is
  );

  ['dragleave', 'drop'].forEach(ev => // luistert naar het verlaten van de dropzone of het loslaten van een bestand
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('dragover'); }) // verwijdert de visuele markering zodat de dropzone er weer normaal uitziet
  );

  dz.addEventListener('drop', (e) => { // luistert naar het loslaten van een bestand op de dropzone
    const file = e.dataTransfer.files[0]; // haalt het losgelaten bestand op uit de drop-gebeurtenis
    handleFile(file); // verwerkt het bestand zodat het geïmporteerd wordt
  });
}

// --- Controleer of een geïmporteerd object een geldige quiz is ---
function validateQuiz(data) {
  if (!data || typeof data !== 'object') throw new Error('Bestand is geen geldige JSON.'); // controleert of de data een object is, want een quiz moet een object zijn
  if (!data.title) throw new Error('Quiz mist een "title".'); // controleert of de quiz een titel heeft, want zonder naam kan de quiz niet getoond worden
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('Quiz moet ten minste 1 vraag bevatten.'); // controleert of de quiz vragen heeft, want een quiz zonder vragen kan niet gespeeld worden
  }
  data.questions.forEach((q, i) => { // loopt door elke vraag en controleert of die geldig is
    if (!q.question) throw new Error(`Vraag ${i + 1} mist tekst.`); // controleert of de vraag een vraagtekst heeft
    if (!Array.isArray(q.answers) || q.answers.length < 2) {
      throw new Error(`Vraag ${i + 1} moet ≥ 2 antwoorden bevatten.`); // controleert of de vraag minstens twee antwoorden heeft zodat de gebruiker een keuze kan maken
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.answers.length) {
      throw new Error(`Vraag ${i + 1} heeft een ongeldig "correct" veld.`); // controleert of het juiste antwoord een geldig indexnummer is dat binnen de antwoordenlijst valt
    }
  });
}
