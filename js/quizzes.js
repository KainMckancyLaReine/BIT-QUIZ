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
     questions: [ ... ]  → een array van vraag-objecten

   Elke vraag is een object { } in de questions-array:
     question: '...'  → de vraagtekst als string
     answers: ['A', 'B', 'C', 'D']  → een array van 4 antwoord-teksten
       [ = begin array | ] = einde | 'A', 'B', 'C', 'D' = strings gescheiden door komma's
     correct: 2  → het indexnummer van het JUISTE antwoord (0 = eerste, 1 = tweede, 2 = derde, 3 = vierde)
     image: '🚣'  → de emoji voor de SVG-kaart bij de vraag
     imageUrl: 'https://...'  → een optionele URL naar een echte foto (Unsplash); valt terug op SVG bij laadfouten

   Komma's , scheiden elementen in arrays en objecten.
   Punten . in URLs zijn gewone tekens in een string — geen JavaScript-operator.
   =========================================================== */

   var DEFAULT_QUIZZES = [ // var = variabele declaratie | DEFAULT_QUIZZES = naam | = = toewijzen | [ = begin array van quizobjecten
    { // { = begin van het eerste quiz-object
      id: 'amsterdam-feitjes',
      title: 'Amsterdam Feitjes',
      description: 'Hoeveel weet jij over de hoofdstad van Nederland?',
      emoji: '🏛️',
      theme: 'amsterdam',
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
  
    {
      id: 'rembrandt-museum',
      title: 'Het Rembrandthuis',
      description: 'Test je kennis over Rembrandt en zijn museum in Amsterdam.',
      emoji: '🎨',
      theme: 'rembrandt',
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
  
    {
      id: 'tweede-wereldoorlog',
      title: 'Tweede Wereldoorlog',
      description: 'Belangrijke gebeurtenissen en feiten uit WO2.',
      emoji: '🕊️',
      theme: 'ww2',
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
    }
  ];
  