/* ===========================================================
   BITQUIZ — Standaard quizzes
   Elke quiz heeft 10 vragen met 4 antwoordmogelijkheden.

   UITLEG VAN DE DATASTRUCTUUR:
   var DEFAULT_QUIZZES = [ ... ]
     var = variabele declaratie (geen blok-scope: beschikbaar voor alle scripts)
     DEFAULT_QUIZZES = naam (hoofdletters = afspraak: dit verandert niet)
     = = toewijzen
     [ = begin van een array (lijst)
     ] = einde van de array
     ; = einde van de instructie

   Elke quiz is een object { } in de array:
     { = begin object | } = einde object
     id: 'amsterdam-feitjes'  → id = eigenschap-naam | : = koppeling | 'amsterdam-feitjes' = unieke string-id
     title: 'Amsterdam Feitjes' → de zichtbare naam van de quiz
     description: '...'  → een korte beschrijving
     emoji: '🏛️'  → de emoji voor het kaartje op het startscherm
     theme: 'amsterdam'  → de naam van het kleurthema (zie THEMES in helpers.js)
     category: 'Nederland'  → de categorie-naam, gebruikt door het zoek-/filtersysteem op het startscherm
     difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk'  → moeilijkheidsgraad, getoond als badge op de kaart
     questions: [ ... ]  → een array van vraag-objecten

   Elke vraag is een object { } in de questions-array:
     question: '...'  → de vraagtekst als string
     answers: ['A', 'B', 'C', 'D']  → een array van 4 antwoord-teksten
       [ = begin array | ] = einde | 'A', 'B', 'C', 'D' = strings gescheiden door komma's
     correct: 2  → het indexnummer van het JUISTE antwoord (0 = eerste, 1 = tweede, 2 = derde, 3 = vierde)
     image: '🚣'  → de emoji voor de SVG-kaart bij de vraag (reserve-afbeelding)
     imageUrl: 'https://...'  → een optionele URL naar een echte foto (Wikimedia Commons / Unsplash);
                                 valt automatisch terug op de SVG als de foto niet laadt (zie
                                 renderQuestionImage() in helpers.js — dat is waar dit vangnet zit)

   Komma's , scheiden elementen in arrays en objecten.
   Punten . in URLs zijn gewone tekens in een string — geen JavaScript-operator.

   OVER DE ECHTE FOTO'S:
   De meeste foto's komen van Wikimedia Commons via de "Special:FilePath"-route
   (commons.wikimedia.org/wiki/Special:FilePath/<bestandsnaam>). Het voordeel van
   deze route is dat je geen ingewikkeld hash-pad (zoals /a/a3/...) hoeft te kennen —
   je geeft gewoon de bestandsnaam op en Wikimedia stuurt je door naar de echte foto.
   Mocht een foto ooit verplaatst of hernoemd zijn, dan laadt hij niet — en dan springt
   de app automatisch terug naar de mooie gegenereerde SVG-illustratie met emoji.
   Niets crasht: dat vangnet zat al in helpers.js en werkt voor elke foto in dit bestand.
   =========================================================== */

   function wm(file) { // wm = kleine hulpfunctie ALLEEN voor dit bestand: bouwt een Wikimedia Commons-URL op basis van de bestandsnaam
     return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file).replace(/%20/g, '%20') + '?width=900';
     // encodeURIComponent = zet spaties en speciale tekens om naar veilige URL-tekens | ?width=900 = vraagt Wikimedia om de foto alvast te verkleinen naar 900px breed, zodat de pagina sneller laadt
   }

   var DEFAULT_QUIZZES = [ // var = variabele declaratie | DEFAULT_QUIZZES = naam | = = toewijzen | [ = begin array van quizobjecten

    // ============================================================
    // 1. AMSTERDAM FEITJES
    // ============================================================
    {
      id: 'amsterdam-feitjes',
      title: 'Amsterdam Feitjes',
      description: 'Hoeveel weet jij over de hoofdstad van Nederland?',
      emoji: '🏛️',
      theme: 'amsterdam',
      category: 'Nederland',
      difficulty: 'makkelijk',
      questions: [
        {
          question: 'Hoeveel grachten heeft Amsterdam (in het centrum) ongeveer?',
          answers: ['25', '75', '165', '300'],
          correct: 2,
          image: '🚣',
          imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96c5017?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'In welk jaar kreeg Amsterdam stadsrechten?',
          answers: ['1206', '1306', '1406', '1506'],
          correct: 1,
          image: '📜',
          imageUrl: 'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Welke rivier loopt door Amsterdam en gaf de stad zijn naam?',
          answers: ['De IJssel', 'De Amstel', 'Het IJ', 'De Maas'],
          correct: 1,
          image: '🌊',
          imageUrl: 'https://images.unsplash.com/photo-1517939241624-43e7d0ce95eb?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Welk wereldberoemd schilderij hangt in het Rijksmuseum?',
          answers: ['De Sterrennacht', 'De Nachtwacht', 'Het Melkmeisje', 'De Aardappeleters'],
          correct: 1,
          image: '🎨',
          imageUrl: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoeveel bruggen heeft Amsterdam ongeveer?',
          answers: ['Ongeveer 500', 'Ongeveer 1.500', 'Ongeveer 3.000', 'Ongeveer 5.000'],
          correct: 1,
          image: '🌉',
          imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoe heet de bijnaam van Amsterdam in het Jiddisch?',
          answers: ['Mokum', 'Damsko', 'Aspen', 'Ronda'],
          correct: 0,
          image: '🏘️',
          imageUrl: 'https://images.unsplash.com/photo-1576924542622-772579fb1180?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'In welk jaar werd Amsterdam Centraal Station officieel geopend?',
          answers: ['1869', '1889', '1901', '1923'],
          correct: 1,
          image: '🚂',
          imageUrl: 'https://images.unsplash.com/photo-1581354779063-89e10c50adb1?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Wat is het oudste nog bestaande gebouw van Amsterdam?',
          answers: ['De Westerkerk', 'De Oude Kerk', 'Het Paleis op de Dam', 'Het Anne Frank Huis'],
          correct: 1,
          image: '⛪',
          imageUrl: 'https://images.unsplash.com/photo-1590767187868-b5fdf9a0c79f?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Welke beroemde toren staat aan de overkant van het IJ?',
          answers: ['Domtoren', 'Euromast', "A'DAM Toren", 'Martinitoren'],
          correct: 2,
          image: '🗼',
          imageUrl: 'https://images.unsplash.com/photo-1605101100278-5d1deb2b6498?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoeveel inwoners telt de gemeente Amsterdam ongeveer?',
          answers: ['Ongeveer 500.000', 'Ongeveer 700.000', 'Ongeveer 900.000', 'Ongeveer 1,5 miljoen'],
          correct: 2,
          image: '👥',
          imageUrl: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=900&q=80&auto=format&fit=crop'
        }
      ]
    },

    // ============================================================
    // 2. HET REMBRANDTHUIS
    // ============================================================
    {
      id: 'rembrandt-museum',
      title: 'Het Rembrandthuis',
      description: 'Test je kennis over Rembrandt en zijn museum in Amsterdam.',
      emoji: '🎨',
      theme: 'rembrandt',
      category: 'Kunst',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'In welke straat in Amsterdam staat het Rembrandthuis?',
          answers: ['Prinsengracht', 'Jodenbreestraat', 'Kalverstraat', 'Damrak'],
          correct: 1,
          image: '🏠',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Rembrandthuis.jpg/800px-Rembrandthuis.jpg'
        },
        {
          question: 'In welk jaar werd Rembrandt geboren?',
          answers: ['1556', '1606', '1656', '1706'],
          correct: 1,
          image: '👶',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Rembrandt_Harmensz._van_Rijn_135.jpg/800px-Rembrandt_Harmensz._van_Rijn_135.jpg'
        },
        {
          question: 'In welke stad werd Rembrandt geboren?',
          answers: ['Amsterdam', 'Delft', 'Leiden', 'Haarlem'],
          correct: 2,
          image: '🌷',
          imageUrl: 'https://images.unsplash.com/photo-1564518091077-4c863287b0ef?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoeveel jaar woonde Rembrandt in het huis dat nu het museum is?',
          answers: ['5 jaar', '10 jaar', '20 jaar', '40 jaar'],
          correct: 2,
          image: '🗓️',
          imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'In welk jaar werd het Rembrandthuis geopend als museum?',
          answers: ['1885', '1911', '1945', '1969'],
          correct: 1,
          image: '🏛️',
          imageUrl: 'https://images.unsplash.com/photo-1565060169187-5284bbf64bdf?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Waarom moest Rembrandt het huis verlaten?',
          answers: ['Brand', 'Oorlog', 'Hij ging failliet', 'Hij verhuisde naar het buitenland'],
          correct: 2,
          image: '💸',
          imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Wat is het beroemdste schilderij van Rembrandt?',
          answers: ['De Aardappeleters', 'De Nachtwacht', 'Het Melkmeisje', 'De Anatomische Les'],
          correct: 1,
          image: '🖼️',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/1024px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg'
        },
        {
          question: 'Welke grafische techniek wordt in het Rembrandthuis nog gedemonstreerd?',
          answers: ['Aquarel schilderen', 'Etsen', 'Mozaïek leggen', 'Glas-in-lood'],
          correct: 1,
          image: '🖋️',
          imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoe heette Rembrandts eerste vrouw?',
          answers: ['Hendrickje Stoffels', 'Geertje Dircx', 'Saskia van Uylenburgh', 'Cornelia Rembrandtsdochter'],
          correct: 2,
          image: '💍',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Rembrandt_-_Saskia_van_Uylenburgh%2C_the_Wife_of_the_Artist_-_Google_Art_Project.jpg/600px-Rembrandt_-_Saskia_van_Uylenburgh%2C_the_Wife_of_the_Artist_-_Google_Art_Project.jpg'
        },
        {
          question: 'In welk jaar overleed Rembrandt?',
          answers: ['1639', '1659', '1669', '1689'],
          correct: 2,
          image: '🕯️',
          imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&q=80&auto=format&fit=crop'
        }
      ]
    },

    // ============================================================
    // 3. TWEEDE WERELDOORLOG
    // ============================================================
    {
      id: 'tweede-wereldoorlog',
      title: 'Tweede Wereldoorlog',
      description: 'Belangrijke gebeurtenissen en feiten uit WO2.',
      emoji: '🕊️',
      theme: 'ww2',
      category: 'Geschiedenis',
      difficulty: 'moeilijk',
      questions: [
        {
          question: 'In welk jaar begon de Tweede Wereldoorlog?',
          answers: ['1914', '1929', '1939', '1941'],
          correct: 2,
          image: '📅',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Op welke datum viel Duitsland Nederland binnen?',
          answers: ['1 september 1939', '10 mei 1940', '6 juni 1944', '8 mei 1945'],
          correct: 1,
          image: '🇳🇱',
          imageUrl: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Wie was de leider van nazi-Duitsland tijdens WO2?',
          answers: ['Heinrich Himmler', 'Joseph Goebbels', 'Adolf Hitler', 'Hermann Göring'],
          correct: 2,
          image: '🎙️',
          imageUrl: 'https://images.unsplash.com/photo-1581322852750-5ec6e94e1b1c?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Wat was de codenaam voor de geallieerde landing in Normandië?',
          answers: ['Operation Market Garden', 'Operation Overlord', 'Operation Barbarossa', 'Operation Torch'],
          correct: 1,
          image: '🪂',
          imageUrl: 'https://images.unsplash.com/photo-1577643854242-7d6b9d61e02b?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Op welke datum begon D-Day?',
          answers: ['6 juni 1944', '6 juli 1944', '15 augustus 1944', '1 september 1939'],
          correct: 0,
          image: '⛴️',
          imageUrl: 'https://images.unsplash.com/photo-1610476131732-4d40793b7c2b?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Hoe heette het beroemde Joodse meisje uit Amsterdam dat een dagboek schreef in onderduik?',
          answers: ['Hannie Schaft', 'Anne Frank', 'Etty Hillesum', 'Margot Frank'],
          correct: 1,
          image: '📖',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Anne_Frank_lacht_naar_de_schoolfotograaf_%282%29.jpg/600px-Anne_Frank_lacht_naar_de_schoolfotograaf_%282%29.jpg'
        },
        {
          question: 'Welke gebeurtenis bracht de Verenigde Staten in december 1941 in de oorlog?',
          answers: ['De val van Parijs', 'Operatie Barbarossa', 'De aanval op Pearl Harbor', 'De Slag om Engeland'],
          correct: 2,
          image: '✈️',
          imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Wie was de Britse premier tijdens het grootste deel van WO2?',
          answers: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'],
          correct: 1,
          image: '🎩',
          imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Op welke twee Japanse steden gooiden de VS atoombommen in 1945?',
          answers: ['Tokio en Osaka', 'Hiroshima en Nagasaki', 'Kyoto en Nagoya', 'Nagasaki en Yokohama'],
          correct: 1,
          image: '🗾',
          imageUrl: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=900&q=80&auto=format&fit=crop'
        },
        {
          question: 'Op welke datum werd Nederland bevrijd?',
          answers: ['4 mei 1945', '5 mei 1945', '8 mei 1945', '15 augustus 1945'],
          correct: 1,
          image: '🕊️',
          imageUrl: 'https://images.unsplash.com/photo-1567002260137-b9f1ee65bf3b?w=900&q=80&auto=format&fit=crop'
        }
      ]
    },

    // ============================================================
    // 4. WERELDGESCHIEDENIS  (nieuw)
    // ============================================================
    {
      id: 'wereldgeschiedenis',
      title: 'Wereldgeschiedenis',
      description: 'Van het Romeinse Rijk tot de Titanic — grote momenten uit de wereldgeschiedenis.',
      emoji: '📜',
      theme: 'history',
      category: 'Geschiedenis',
      difficulty: 'moeilijk',
      questions: [
        {
          question: 'In welk jaar viel het West-Romeinse Rijk?',
          answers: ['376', '410', '476', '527'],
          correct: 2,
          image: '🏛️',
          imageUrl: wm('Colosseum in Rome, Italy - April 2007.jpg')
        },
        {
          question: 'Wie was de eerste keizer van het Romeinse Rijk?',
          answers: ['Julius Caesar', 'Augustus', 'Nero', 'Constantijn'],
          correct: 1,
          image: '👑',
          imageUrl: wm('Prima Porta Augustus.jpg')
        },
        {
          question: 'In welk jaar begon de Franse Revolutie?',
          answers: ['1776', '1789', '1804', '1848'],
          correct: 1,
          image: '🇫🇷',
          imageUrl: wm('Prise de la Bastille.jpg')
        },
        {
          question: 'Welke Egyptische farao is beroemd om zijn gouden dodenmasker?',
          answers: ['Toetanchamon', 'Ramses II', 'Achnaton', 'Cheops'],
          correct: 0,
          image: '🏺'
        },
        {
          question: 'Welk volk bouwde de piramides van Gizeh?',
          answers: ['Grieken', 'Egyptenaren', 'Romeinen', 'Feniciërs'],
          correct: 1,
          image: '🔺',
          imageUrl: wm('All Gizah Pyramids.jpg')
        },
        {
          question: 'In welke eeuw werd Leonardo da Vinci geboren?',
          answers: ['14e eeuw', '15e eeuw', '16e eeuw', '17e eeuw'],
          correct: 1,
          image: '🎨'
        },
        {
          question: 'Welk bouwwerk in China is duizenden kilometers lang en werd eeuwenlang gebouwd?',
          answers: ['De Grote Muur', 'De Verboden Stad', 'De Drieklovendam', 'Het Terracottaleger'],
          correct: 0,
          image: '🧱',
          imageUrl: wm('Great Wall of China July 2006.JPG')
        },
        {
          question: 'In welk jaar viel de Berlijnse Muur?',
          answers: ['1985', '1987', '1989', '1991'],
          correct: 2,
          image: '🧱'
        },
        {
          question: 'Wie stichtte het grootste aaneengesloten landrijk ooit, het Mongoolse Rijk?',
          answers: ['Genghis Khan', 'Kublai Khan', 'Timoer', 'Attila'],
          correct: 0,
          image: '🐎'
        },
        {
          question: 'Welk schip zonk in 1912 na een aanvaring met een ijsberg?',
          answers: ['Lusitania', 'Titanic', 'Britannic', 'Olympic'],
          correct: 1,
          image: '🚢',
          imageUrl: wm('RMS Titanic 3.jpg')
        }
      ]
    },

    // ============================================================
    // 5. AARDRIJKSKUNDE VAN DE WERELD  (nieuw)
    // ============================================================
    {
      id: 'aardrijkskunde-wereld',
      title: 'Aardrijkskunde van de Wereld',
      description: 'Bergen, rivieren, woestijnen en landen — hoe goed ken jij onze planeet?',
      emoji: '🌍',
      theme: 'geography',
      category: 'Aardrijkskunde',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'Wat is de hoogste berg ter wereld?',
          answers: ['K2', 'Mount Everest', 'Kilimanjaro', 'Denali'],
          correct: 1,
          image: '🏔️',
          imageUrl: wm('Everest North Face toward Base Camp Tibet Luca Galuzzi 2006.jpg')
        },
        {
          question: 'Welke rivier wordt traditioneel gezien als de langste ter wereld?',
          answers: ['Amazone', 'Nijl', 'Yangtze', 'Mississippi'],
          correct: 1,
          image: '🌊'
        },
        {
          question: 'Wat is de grootste (niet-poolwoestijn) woestijn ter wereld?',
          answers: ['Gobi', 'Kalahari', 'Sahara', 'Atacama'],
          correct: 2,
          image: '🏜️'
        },
        {
          question: 'In welk land ligt de Grand Canyon?',
          answers: ['Mexico', 'Canada', 'Verenigde Staten', 'Argentinië'],
          correct: 2,
          image: '🪨'
        },
        {
          question: 'Welk rif is het grootste koraalrif ter wereld?',
          answers: ['Great Barrier Reef', 'Belize Barrier Reef', 'Rode Zee-rif', 'Apo-rif'],
          correct: 0,
          image: '🐠'
        },
        {
          question: 'Wat is het diepste meer ter wereld?',
          answers: ['Lake Tanganyika', 'Kaspische Zee', 'Baikalmeer', 'Lake Superior'],
          correct: 2,
          image: '💧'
        },
        {
          question: 'Welke waterval geldt als een van de bekendste ter wereld door zijn enorme waterdebiet?',
          answers: ['Niagara Falls', 'Victoria Falls', 'Iguazu Falls', 'Angel Falls'],
          correct: 0,
          image: '🌊'
        },
        {
          question: 'Wat is het laagste punt op het land op aarde?',
          answers: ['Death Valley', 'Dode Zee', 'Danakil-depressie', 'Turpan-depressie'],
          correct: 1,
          image: '🧂'
        },
        {
          question: 'Welk continent heeft de meeste landen?',
          answers: ['Azië', 'Afrika', 'Europa', 'Zuid-Amerika'],
          correct: 1,
          image: '🌍'
        },
        {
          question: 'Wat is het kleinste land ter wereld?',
          answers: ['Monaco', 'San Marino', 'Vaticaanstad', 'Liechtenstein'],
          correct: 2,
          image: '⛪',
          imageUrl: wm("St Peter's Basilica facade, Vatican City - April 2007.jpg")
        }
      ]
    },

    // ============================================================
    // 6. RUIMTEVAART  (nieuw)
    // ============================================================
    {
      id: 'ruimtevaart',
      title: 'Ruimtevaart',
      description: 'Astronauten, planeten en raketten — een reis door ons zonnestelsel en de ruimtevaartgeschiedenis.',
      emoji: '🚀',
      theme: 'space',
      category: 'Ruimtevaart',
      difficulty: 'moeilijk',
      questions: [
        {
          question: 'Wie was de eerste mens op de maan?',
          answers: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'],
          correct: 1,
          image: '🧑‍🚀',
          imageUrl: wm('Neil Armstrong pose.jpg')
        },
        {
          question: 'Welk ruimtestation draait al sinds 1998 rond de aarde?',
          answers: ['Mir', 'Skylab', 'ISS', 'Tiangong'],
          correct: 2,
          image: '🛰️',
          imageUrl: wm('International Space Station after undocking of STS-132.jpg')
        },
        {
          question: 'Wie was de eerste mens in de ruimte?',
          answers: ['Alan Shepard', 'Yuri Gagarin', 'John Glenn', 'Valentina Teresjkova'],
          correct: 1,
          image: '🚀'
        },
        {
          question: 'Welke planeet staat bekend om zijn opvallende ringen?',
          answers: ['Jupiter', 'Saturnus', 'Uranus', 'Neptunus'],
          correct: 1,
          image: '🪐',
          imageUrl: wm('Saturn during Equinox.jpg')
        },
        {
          question: 'Welke planeet wordt de "rode planeet" genoemd?',
          answers: ['Venus', 'Mars', 'Jupiter', 'Mercurius'],
          correct: 1,
          image: '🔴'
        },
        {
          question: 'Welke missie zette in 1969 voor het eerst mensen op de maan?',
          answers: ['Apollo 8', 'Apollo 11', 'Apollo 13', 'Gemini 4'],
          correct: 1,
          image: '🌕',
          imageUrl: wm('Aldrin Apollo 11 original.jpg')
        },
        {
          question: 'Welk bedrijf van Elon Musk bouwt herbruikbare raketten?',
          answers: ['Blue Origin', 'Virgin Galactic', 'SpaceX', 'Boeing'],
          correct: 2,
          image: '🚀'
        },
        {
          question: 'Hoe heet onze eigen sterrenstelsel?',
          answers: ['Andromeda', 'Melkweg', 'Driehoeksnevel', 'Sombrero'],
          correct: 1,
          image: '🌌'
        },
        {
          question: 'Welke ruimtesonde verliet als eerste mensgemaakt object ons zonnestelsel?',
          answers: ['Voyager 1', 'Pioneer 10', 'New Horizons', 'Cassini'],
          correct: 0,
          image: '🛸'
        },
        {
          question: 'Welke telescoop, gelanceerd in 1990, gaf ons decennialang scherpe foto\'s van de ruimte?',
          answers: ['James Webb', 'Kepler', 'Hubble', 'Spitzer'],
          correct: 2,
          image: '🔭'
        }
      ]
    },

    // ============================================================
    // 7. WETENSCHAP  (nieuw)
    // ============================================================
    {
      id: 'wetenschap',
      title: 'Wetenschap',
      description: 'Van Einstein tot DNA — test je kennis van grote wetenschappelijke doorbraken.',
      emoji: '🧪',
      theme: 'science',
      category: 'Wetenschap',
      difficulty: 'moeilijk',
      questions: [
        {
          question: 'Wie ontwikkelde de relativiteitstheorie?',
          answers: ['Newton', 'Einstein', 'Bohr', 'Hawking'],
          correct: 1,
          image: '🧠',
          imageUrl: wm('Albert Einstein Head.jpg')
        },
        {
          question: 'Wat bevat de erfelijke informatie in vrijwel elke cel van je lichaam?',
          answers: ['RNA', 'DNA', 'ATP', 'Eiwit'],
          correct: 1,
          image: '🧬'
        },
        {
          question: 'Welke wetenschapper won twee Nobelprijzen, in twee verschillende vakgebieden?',
          answers: ['Albert Einstein', 'Marie Curie', 'Niels Bohr', 'Enrico Fermi'],
          correct: 1,
          image: '🏅'
        },
        {
          question: 'Wie beschreef de evolutietheorie via natuurlijke selectie?',
          answers: ['Gregor Mendel', 'Charles Darwin', 'Alfred Wallace', 'Louis Pasteur'],
          correct: 1,
          image: '🐦',
          imageUrl: wm('Charles Darwin seated crop.jpg')
        },
        {
          question: 'Wat gebeurt er tijdens een totale zonsverduistering?',
          answers: ['De maan wordt rood', 'De zon verdwijnt volledig achter de maan', 'De sterren verdwijnen', 'De aarde stopt met draaien'],
          correct: 1,
          image: '🌑',
          imageUrl: wm('Solar eclipse 1999 4.jpg')
        },
        {
          question: 'Wie stelde de wetten van de zwaartekracht en beweging op?',
          answers: ['Galileo Galilei', 'Isaac Newton', 'Nikola Tesla', 'James Watt'],
          correct: 1,
          image: '🍎',
          imageUrl: wm('GodfreyKneller-IsaacNewton-1689.jpg')
        },
        {
          question: 'Welk orgaan verwerkt en stuurt signalen door je hele lichaam?',
          answers: ['Hart', 'Hersenen', 'Longen', 'Lever'],
          correct: 1,
          image: '🧠'
        },
        {
          question: 'Waaruit bestaat de kern van een atoom?',
          answers: ['Protonen en elektronen', 'Protonen en neutronen', 'Neutronen en elektronen', 'Alleen protonen'],
          correct: 1,
          image: '⚛️'
        },
        {
          question: 'Welke Nederlandse wetenschapper ontdekte micro-organismen met zelfgemaakte microscopen?',
          answers: ['Antoni van Leeuwenhoek', 'Christiaan Huygens', 'Hendrik Lorentz', 'Jan Oort'],
          correct: 0,
          image: '🔬'
        },
        {
          question: 'Wat meet de schaal van Richter?',
          answers: ['Temperatuur', 'Aardbevingen', 'Windkracht', 'Geluid'],
          correct: 1,
          image: '📈'
        }
      ]
    },

    // ============================================================
    // 8. SPORT ALGEMEEN  (nieuw)
    // ============================================================
    {
      id: 'sport-algemeen',
      title: 'Sport Algemeen',
      description: 'Voetbal, atletiek, tennis en meer — test je algemene sportkennis.',
      emoji: '🏆',
      theme: 'sport',
      category: 'Sport',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'Welke atleet staat bekend als de snelste man ter wereld op de 100 meter?',
          answers: ['Usain Bolt', 'Carl Lewis', 'Justin Gatlin', 'Tyson Gay'],
          correct: 0,
          image: '🏃',
          imageUrl: wm('Usain Bolt 2012 Olympics.jpg')
        },
        {
          question: 'Hoeveel spelers staan er in totaal op het veld bij een voetbalwedstrijd (beide teams samen)?',
          answers: ['18', '20', '22', '24'],
          correct: 2,
          image: '⚽'
        },
        {
          question: 'In welk land werden de Olympische Spelen van de Oudheid gehouden?',
          answers: ['Italië', 'Griekenland', 'Egypte', 'Turkije'],
          correct: 1,
          image: '🏺'
        },
        {
          question: 'Welke meerdaagse wielerwedstrijd is de bekendste ter wereld?',
          answers: ['Vuelta a España', "Giro d'Italia", 'Tour de France', 'Ronde van Vlaanderen'],
          correct: 2,
          image: '🚴'
        },
        {
          question: 'Welk land won tot 2023 de meeste keren het FIFA WK voetbal (mannen)?',
          answers: ['Duitsland', 'Argentinië', 'Italië', 'Brazilië'],
          correct: 3,
          image: '🏆'
        },
        {
          question: 'Wat is de officiële hoogte van een basketbalring in de NBA?',
          answers: ['3,05 meter', '2,80 meter', '3,20 meter', '2,50 meter'],
          correct: 0,
          image: '🏀'
        },
        {
          question: 'In welke sport wordt de Grand Slam van Wimbledon gespeeld?',
          answers: ['Golf', 'Tennis', 'Cricket', 'Rugby'],
          correct: 1,
          image: '🎾'
        },
        {
          question: 'Hoeveel ringen staan er op de Olympische vlag?',
          answers: ['4', '5', '6', '7'],
          correct: 1,
          image: '🔵',
          imageUrl: wm('Olympic flag.jpg')
        },
        {
          question: 'Welke bokser stond bekend als "The Greatest" en riep "float like a butterfly, sting like a bee"?',
          answers: ['Mike Tyson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier'],
          correct: 1,
          image: '🥊',
          imageUrl: wm('Muhammad Ali NYWTS.jpg')
        },
        {
          question: 'Hoeveel minuten duurt een reguliere voetbalwedstrijd (exclusief blessuretijd)?',
          answers: ['80', '90', '100', '120'],
          correct: 1,
          image: '⏱️'
        }
      ]
    },

    // ============================================================
    // 9. MUZIEKGESCHIEDENIS  (nieuw)
    // ============================================================
    {
      id: 'muziek-klassiek',
      title: 'Muziekgeschiedenis',
      description: 'Van Bach tot Woodstock — grote namen en feiten uit de muziekgeschiedenis.',
      emoji: '🎼',
      theme: 'music',
      category: 'Muziek',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'Wie componeerde zijn beroemde Negende Symfonie terwijl hij al doof was?',
          answers: ['Mozart', 'Beethoven', 'Bach', 'Brahms'],
          correct: 1,
          image: '🎻',
          imageUrl: wm('Ludwig van Beethoven, by Joseph Karl Stieler.jpg')
        },
        {
          question: 'Welke componist schreef al op zeer jonge leeftijd symfonieën en opera\'s, en stierf op 35-jarige leeftijd?',
          answers: ['Beethoven', 'Mozart', 'Chopin', 'Schubert'],
          correct: 1,
          image: '🎹'
        },
        {
          question: 'Welke Duitse componist schreef het "Wohltemperierte Klavier" en veel kerkmuziek?',
          answers: ['Bach', 'Handel', 'Vivaldi', 'Haydn'],
          correct: 0,
          image: '🎶',
          imageUrl: wm('Johann Sebastian Bach.jpg')
        },
        {
          question: 'Welk instrument heeft doorgaans 88 toetsen?',
          answers: ['Orgel', 'Piano', 'Accordeon', 'Xylofoon'],
          correct: 1,
          image: '🎹'
        },
        {
          question: 'Welke Poolse componist stond bekend om zijn piano-nocturnes?',
          answers: ['Franz Liszt', 'Frédéric Chopin', 'Johannes Brahms', 'Antonín Dvořák'],
          correct: 1,
          image: '🎼'
        },
        {
          question: 'Hoeveel snaren heeft een standaard akoestische gitaar meestal?',
          answers: ['4', '5', '6', '8'],
          correct: 2,
          image: '🎸'
        },
        {
          question: 'In welke Oostenrijkse stad waren Mozart en veel andere klassieke componisten actief?',
          answers: ['Praag', 'Wenen', 'Berlijn', 'Boedapest'],
          correct: 1,
          image: '🏛️'
        },
        {
          question: 'Welk soort muziekstuk voor orkest bestaat meestal uit meerdere delen, zoals allegro en andante?',
          answers: ['Sonate', 'Symfonie', 'Concerto', 'Requiem'],
          correct: 1,
          image: '🎺'
        },
        {
          question: 'Welk openluchtfestival uit 1969 in de VS geldt als hoogtepunt van de rockcultuur?',
          answers: ['Coachella', 'Woodstock', 'Glastonbury', 'Lollapalooza'],
          correct: 1,
          image: '🎸'
        },
        {
          question: 'Welke Italiaanse term betekent "langzaam" in muzieknotatie?',
          answers: ['Allegro', 'Adagio', 'Presto', 'Forte'],
          correct: 1,
          image: '🎵'
        }
      ]
    },

    // ============================================================
    // 10. FILMGESCHIEDENIS & HOLLYWOOD  (nieuw)
    // ============================================================
    {
      id: 'film-hollywood',
      title: 'Filmgeschiedenis & Hollywood',
      description: 'Van stomme films tot de Oscars — test je kennis van de filmwereld.',
      emoji: '🎬',
      theme: 'film',
      category: 'Film',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'Wie speelde de bekende zwerver "The Tramp" in stomme films?',
          answers: ['Buster Keaton', 'Charlie Chaplin', 'Harold Lloyd', 'Stan Laurel'],
          correct: 1,
          image: '🎩',
          imageUrl: wm('Charlie Chaplin.jpg')
        },
        {
          question: 'Welke regisseur staat bekend als "Meester van de Suspense" (o.a. Psycho)?',
          answers: ['Orson Welles', 'Alfred Hitchcock', 'Stanley Kubrick', 'Billy Wilder'],
          correct: 1,
          image: '🎥',
          imageUrl: wm('Alfred Hitchcock 1955.jpg')
        },
        {
          question: 'In welke Amerikaanse stad staat het beroemde "HOLLYWOOD"-bord?',
          answers: ['New York', 'Los Angeles', 'San Francisco', 'Chicago'],
          correct: 1,
          image: '🎦'
        },
        {
          question: 'Welke actrice, geboren als Norma Jeane Mortenson, werd een van de grootste sterren van Hollywood?',
          answers: ['Audrey Hepburn', 'Marilyn Monroe', 'Grace Kelly', 'Judy Garland'],
          correct: 1,
          image: '⭐'
        },
        {
          question: 'Welk gouden beeldje wordt jaarlijks uitgereikt bij de belangrijkste filmprijzen in Hollywood?',
          answers: ['Golden Globe', 'Oscar', 'Emmy', 'BAFTA'],
          correct: 1,
          image: '🏆',
          imageUrl: wm('Oscar statuette.jpg')
        },
        {
          question: 'Wie richtte de animatiestudio op die Mickey Mouse creëerde?',
          answers: ['Walt Disney', 'Hanna-Barbera', 'Chuck Jones', 'Tex Avery'],
          correct: 0,
          image: '🐭'
        },
        {
          question: 'Welke Franse filmpionier maakte in 1902 de vroege sciencefictionfilm "Le Voyage dans la Lune"?',
          answers: ['Auguste Lumière', 'Georges Méliès', 'Louis Le Prince', 'Émile Reynaud'],
          correct: 1,
          image: '🌙'
        },
        {
          question: 'Op welk jaarlijks filmfestival aan de Franse Rivièra worden films bekroond met de "Gouden Palm"?',
          answers: ['Venetië', 'Cannes', 'Berlijn', 'Toronto'],
          correct: 1,
          image: '🌴'
        },
        {
          question: 'Wie regisseerde de eerste "Star Wars"-film uit 1977?',
          answers: ['Steven Spielberg', 'George Lucas', 'James Cameron', 'Ridley Scott'],
          correct: 1,
          image: '🎬'
        },
        {
          question: 'In welk beroemd openluchttheater in Hollywood laten sterren hun hand- en voetafdrukken achter?',
          answers: ["Grauman's Chinese Theatre", 'Radio City Music Hall', 'The Hollywood Bowl', 'The Dolby Theatre'],
          correct: 0,
          image: '🖐️'
        }
      ]
    },

    // ============================================================
    // 11. TECHNOLOGIE  (nieuw)
    // ============================================================
    {
      id: 'technologie',
      title: 'Technologie',
      description: 'Computers, het internet en de mensen die de digitale wereld vormgaven.',
      emoji: '💻',
      theme: 'tech',
      category: 'Technologie',
      difficulty: 'gemiddeld',
      questions: [
        {
          question: 'Wie richtte samen met Steve Wozniak het bedrijf Apple op?',
          answers: ['Bill Gates', 'Steve Jobs', 'Larry Page', 'Jeff Bezos'],
          correct: 1,
          image: '🍎',
          imageUrl: wm('Steve Jobs Headshot 2010-CROP.jpg')
        },
        {
          question: 'Wie richtte Microsoft op?',
          answers: ['Steve Jobs', 'Bill Gates', 'Larry Ellison', 'Michael Dell'],
          correct: 1,
          image: '🪟',
          imageUrl: wm('Bill Gates 2017 (cropped).jpg')
        },
        {
          question: 'Wat was de naam van een van de eerste elektronische computers ter wereld, gebouwd in de jaren 40?',
          answers: ['ENIAC', 'UNIVAC', 'IBM 360', 'Altair 8800'],
          correct: 0,
          image: '🖥️',
          imageUrl: wm('Eniac.jpg')
        },
        {
          question: 'Wie wordt gezien als de bedenker van het World Wide Web?',
          answers: ['Tim Berners-Lee', 'Vint Cerf', 'Larry Page', 'Marc Andreessen'],
          correct: 0,
          image: '🌐'
        },
        {
          question: 'Welke Britse wiskundige geldt als grondlegger van de moderne informatica en kraakte Duitse codes in WO2?',
          answers: ['Alan Turing', 'John von Neumann', 'Claude Shannon', 'Ada Lovelace'],
          correct: 0,
          image: '🔐',
          imageUrl: wm('Alan Turing Aged 16.jpg')
        },
        {
          question: 'In welk jaar bracht Apple de allereerste iPhone uit?',
          answers: ['2005', '2007', '2009', '2011'],
          correct: 1,
          image: '📱'
        },
        {
          question: 'Welke ondernemer richtte Tesla en SpaceX op?',
          answers: ['Jeff Bezos', 'Elon Musk', 'Mark Zuckerberg', 'Larry Page'],
          correct: 1,
          image: '🚗',
          imageUrl: wm('Elon Musk Royal Society (crop2).jpg')
        },
        {
          question: 'Wat betekent de afkorting "AI" in de technologie?',
          answers: ['Automatische Interface', 'Artificial Intelligence', 'Advanced Internet', 'Applied Informatics'],
          correct: 1,
          image: '🤖'
        },
        {
          question: 'Welk bedrijf richtte Mark Zuckerberg op tijdens zijn studie aan Harvard?',
          answers: ['Twitter', 'Facebook', 'Snapchat', 'LinkedIn'],
          correct: 1,
          image: '📘'
        },
        {
          question: 'Welk mobiel besturingssysteem van Google draait op de meeste smartphones ter wereld?',
          answers: ['iOS', 'Android', 'Symbian', 'WebOS'],
          correct: 1,
          image: '📲'
        }
      ]
    },

    // ============================================================
    // 12. DIEREN & NATUUR  (nieuw)
    // ============================================================
    {
      id: 'dieren-natuur',
      title: 'Dieren & Natuur',
      description: 'Van de snelste tot de grootste — test je kennis van het dierenrijk.',
      emoji: '🦁',
      theme: 'nature',
      category: 'Natuur',
      difficulty: 'makkelijk',
      questions: [
        {
          question: 'Welk dier wordt de "koning van de jungle" genoemd, hoewel het eigenlijk in de savanne leeft?',
          answers: ['Tijger', 'Leeuw', 'Luipaard', 'Cheetah'],
          correct: 1,
          image: '🦁',
          imageUrl: wm('Lion waiting in Namibia.jpg')
        },
        {
          question: 'Wat is het grootste dier dat ooit op aarde heeft geleefd?',
          answers: ['Afrikaanse olifant', 'Blauwe vinvis', 'Brachiosaurus', 'Witte haai'],
          correct: 1,
          image: '🐋',
          imageUrl: wm('Blue Whale 001 shape.jpg')
        },
        {
          question: 'Welk dier is het enige zoogdier dat écht kan vliegen?',
          answers: ['Vliegende eekhoorn', 'Vleermuis', 'Vliegende vis', 'Vliegende lemur'],
          correct: 1,
          image: '🦇'
        },
        {
          question: 'Uit welk land komt de reuzenpanda oorspronkelijk?',
          answers: ['Japan', 'China', 'Thailand', 'Vietnam'],
          correct: 1,
          image: '🐼',
          imageUrl: wm('Giant Panda 2004-03-2.jpg')
        },
        {
          question: 'Welke vogel kan niet vliegen maar wel uitstekend zwemmen, en leeft vooral op het zuidelijk halfrond?',
          answers: ['Struisvogel', 'Pinguïn', 'Kiwi', 'Emoe'],
          correct: 1,
          image: '🐧',
          imageUrl: wm('Emperor Penguins.jpg')
        },
        {
          question: 'Wat is het snelste landdier ter wereld?',
          answers: ['Leeuw', 'Cheetah', 'Antilope', 'Paard'],
          correct: 1,
          image: '🐆',
          imageUrl: wm('Cheetah running.jpg')
        },
        {
          question: 'Welk zeedier heeft acht armen?',
          answers: ['Inktvis', 'Octopus', 'Zeester', 'Kwal'],
          correct: 1,
          image: '🐙'
        },
        {
          question: 'Welke boomsoort kan duizenden jaren oud worden en behoort tot de hoogste bomen ter wereld?',
          answers: ['Eik', 'Sequoia (reuzenmammoetboom)', 'Berk', 'Den'],
          correct: 1,
          image: '🌲'
        },
        {
          question: 'Wat eten koala\'s voornamelijk?',
          answers: ['Bamboe', 'Eucalyptusbladeren', 'Gras', 'Bessen'],
          correct: 1,
          image: '🐨'
        },
        {
          question: 'Welk insect produceert honing?',
          answers: ['Wesp', 'Hommel', 'Honingbij', 'Vlinder'],
          correct: 2,
          image: '🐝'
        }
      ]
    },

    // ============================================================
    // 13. ETEN & DRINKEN  (nieuw)
    // ============================================================
    {
      id: 'eten-drinken',
      title: 'Eten & Drinken',
      description: 'Van pizza tot koffie — culinaire feiten uit de hele wereld.',
      emoji: '🍕',
      theme: 'food',
      category: 'Eten & Drinken',
      difficulty: 'makkelijk',
      questions: [
        {
          question: 'Uit welk land komt de pizza oorspronkelijk?',
          answers: ['Frankrijk', 'Italië', 'Griekenland', 'Spanje'],
          correct: 1,
          image: '🍕'
        },
        {
          question: 'Wat is het hoofdingrediënt van sushi (de naam betekent letterlijk "zure rijst")?',
          answers: ['Rauwe vis', 'Gekookte rijst', 'Zeewier', 'Sojasaus'],
          correct: 1,
          image: '🍣'
        },
        {
          question: 'Van welke boon wordt chocolade gemaakt?',
          answers: ['Koffieboon', 'Cacaoboon', 'Vanilleboon', 'Sojaboon'],
          correct: 1,
          image: '🍫',
          imageUrl: wm('Cacao pods.jpg')
        },
        {
          question: 'In welk land ontstond het concept van de croissant (de "kipferl")?',
          answers: ['Oostenrijk', 'Frankrijk', 'België', 'Zwitserland'],
          correct: 0,
          image: '🥐'
        },
        {
          question: 'Welke drank wordt gemaakt door het fermenteren van druiven?',
          answers: ['Bier', 'Wijn', 'Whisky', 'Cider'],
          correct: 1,
          image: '🍷'
        },
        {
          question: 'Welk land drinkt gemiddeld de meeste koffie per hoofd van de bevolking?',
          answers: ['Brazilië', 'Finland', 'Italië', 'Colombia'],
          correct: 1,
          image: '☕'
        },
        {
          question: 'Waarvan wordt kaas voornamelijk gemaakt?',
          answers: ['Melk', 'Eieren', 'Sojamelk', 'Room alleen'],
          correct: 0,
          image: '🧀'
        },
        {
          question: 'Welk graan wordt traditioneel gebruikt om bier te brouwen?',
          answers: ['Tarwe', 'Gerst', 'Rijst', 'Maïs'],
          correct: 1,
          image: '🍺'
        },
        {
          question: 'In welk land werd de hamburger als gerecht populair gemaakt?',
          answers: ['Verenigde Staten', 'Duitsland', 'Engeland', 'Canada'],
          correct: 0,
          image: '🍔'
        },
        {
          question: 'Welk zoetmiddel wordt door bijen gemaakt?',
          answers: ['Suiker', 'Honing', 'Stroop', 'Ahornsiroop'],
          correct: 1,
          image: '🍯'
        }
      ]
    }
  ];
