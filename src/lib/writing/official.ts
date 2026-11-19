import type { FormTask, WritingTask } from "./types";

const DAY =
  "maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|volgende week|overmorgen|\\d{1,2}[-/ ]\\d{1,2}|\\d{1,2} (?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)";

const REASON =
  "omdat|want|ziek|koorts|werk|kind|zoon|dochter|moeder|vader|familie|dokter|huisarts|tandarts|ziekenhuis|afspraak|bruiloft|feest|verjaardag|begrafenis|verhuis";

export const officialWritingTasks: WritingTask[] = [
  {
    id: "officieel-afspraak-verzetten",
    title: "Reschedule a meeting with your teacher",
    kind: "email",
    register: "formal",
    official: true,
    situation:
      "U volgt een opleiding. U kunt morgen niet naar uw afspraak met uw docent. U wilt een andere afspraak maken. U schrijft daarom een e-mail aan uw docent.",
    situationEn:
      "You are following a course. Tomorrow you cannot go to your appointment with your teacher. You want to make a new appointment, so you write an email to your teacher.",
    recipient: "Mevrouw de Groot (a.degroot@mail.nl)",
    points: [
      {
        id: "move",
        nl: "Schrijf dat u de afspraak wilt verzetten.",
        en: "Write that you want to move the appointment.",
        pattern:
          "verzet|verplaats|andere afspraak|nieuwe afspraak|andere dag|niet komen",
      },
      {
        id: "reason",
        nl: "Schrijf waarom u dat wilt. Bedenk zelf waarom.",
        en: "Write why. Make up a reason.",
        pattern: REASON,
      },
      {
        id: "date",
        nl: "Stel een nieuwe datum voor.",
        en: "Suggest a new date.",
        pattern: DAY,
      },
    ],
    minWords: 25,
    maxWords: 90,
    phrases: [
      { nl: "Beste mevrouw de Groot,", en: "Dear Ms de Groot," },
      { nl: "Ik kan morgen helaas niet komen.", en: "Unfortunately I cannot come tomorrow." },
      { nl: "Ik wil de afspraak graag verzetten.", en: "I would like to move the appointment." },
      { nl: "Kunt u op donderdag 26 november?", en: "Are you available on Thursday 26 November?" },
      { nl: "Vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Beste mevrouw de Groot,\n\nIk heb morgen een afspraak met u, maar ik kan helaas niet komen. Mijn zoon is ziek en ik moet bij hem thuisblijven. Ik wil de afspraak daarom graag verzetten. Kunt u op donderdag 26 november om 14.00 uur?\n\nVriendelijke groet,\nAhmed",
  },
  {
    id: "officieel-dienst-ruilen",
    title: "Swap a shift with a colleague",
    kind: "email",
    register: "informal",
    official: true,
    situation:
      "U moet zondag werken maar u wilt graag vrij. U schrijft daarom een e-mail aan uw collega Farida. U vraagt of zij met u wil ruilen.",
    situationEn:
      "You have to work on Sunday but you would like the day off. You write an email to your colleague Farida and ask if she wants to swap with you.",
    recipient: "Farida (farida@mail.nl)",
    points: [
      {
        id: "why-mail",
        nl: "Schrijf waarom u mailt.",
        en: "Write why you are emailing.",
        pattern: "ruil|wissel|dienst|vrij",
      },
      {
        id: "reason",
        nl: "Schrijf waarom u wilt ruilen. Bedenk het zelf.",
        en: "Write why you want to swap. Make it up.",
        pattern: REASON,
      },
      {
        id: "other-day",
        nl: "Schrijf welke dag u wel kunt werken.",
        en: "Write which day you can work.",
        pattern: "maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag",
      },
    ],
    minWords: 25,
    maxWords: 90,
    phrases: [
      { nl: "Hallo Farida,", en: "Hello Farida," },
      { nl: "Wil jij met mij ruilen?", en: "Do you want to swap with me?" },
      { nl: "Ik moet zondag werken, maar ...", en: "I have to work on Sunday, but ..." },
      { nl: "Ik kan wel op zaterdag werken.", en: "I can work on Saturday though." },
      { nl: "Groetjes,", en: "Greetings," },
    ],
    model:
      "Hallo Farida,\n\nIk moet zondag werken, maar ik wil graag vrij. Wil jij met mij ruilen? Mijn broer gaat zondag trouwen en ik wil naar de bruiloft. Ik kan wel op zaterdag werken.\n\nGroetjes,\nSara",
  },
  {
    id: "officieel-boek-lenen",
    title: "Borrow a book",
    kind: "email",
    register: "informal",
    official: true,
    situation:
      "Voor uw opleiding Techniek heeft u het boek 'Natuurkunde 1' nodig. Een andere studente heeft het boek. U wilt het boek van haar lenen. U schrijft haar een e-mail.",
    situationEn:
      "For your Technology course you need the book 'Natuurkunde 1'. Another student has the book. You want to borrow it, so you write her an email.",
    recipient: "Wilma (wilma@mail.nl)",
    points: [
      {
        id: "book",
        nl: "U schrijft welk boek u wilt lenen.",
        en: "Write which book you want to borrow.",
        pattern: "natuurkunde",
      },
      {
        id: "why",
        nl: "U schrijft waarom u het boek van haar wilt lenen.",
        en: "Write why you want to borrow the book from her.",
        pattern:
          "omdat|want|nodig|toets|examen|opleiding|les|huiswerk|kwijt|geld|duur|winkel",
      },
      {
        id: "return",
        nl: "U schrijft wanneer ze het boek terugkrijgt. Bedenk zelf wanneer.",
        en: "Write when she gets the book back. Make it up.",
        pattern: `terug|${DAY}`,
      },
    ],
    minWords: 25,
    maxWords: 90,
    phrases: [
      { nl: "Beste Wilma,", en: "Dear Wilma," },
      { nl: "Mag ik jouw boek lenen?", en: "May I borrow your book?" },
      { nl: "Ik heb het boek nodig voor ...", en: "I need the book for ..." },
      { nl: "Je krijgt het boek vrijdag terug.", en: "You will get the book back on Friday." },
      { nl: "Groetjes,", en: "Greetings," },
    ],
    model:
      "Beste Wilma,\n\nIk wil graag jouw boek 'Natuurkunde 1' lenen. Ik heb het boek nodig voor mijn opleiding Techniek. Volgende week heb ik een toets en ik heb het boek nog niet. Je krijgt het boek vrijdag 4 december terug.\n\nGroetjes,\nKarim",
  },
  {
    id: "officieel-vrije-dag",
    title: "Ask your boss for a day off",
    kind: "email",
    register: "formal",
    official: true,
    situation:
      "U wilt volgende week een dag vrij. U schrijft een e-mail aan uw chef, meneer Jansen.",
    situationEn:
      "You want a day off next week. You write an email to your boss, Mr Jansen.",
    recipient: "Meneer Jansen (j.jansen@werk.nl)",
    points: [
      {
        id: "when",
        nl: "U schrijft wanneer u vrij wilt hebben. Bedenk zelf een dag en datum.",
        en: "Write when you want the day off. Make up a day and date.",
        pattern: DAY,
      },
      {
        id: "why",
        nl: "U schrijft waarom u vrij wilt hebben. Bedenk zelf waarom.",
        en: "Write why you want the day off. Make it up.",
        pattern: `${REASON}|haal|schiphol|gemeente|examen`,
      },
      {
        id: "colleague",
        nl: "U schrijft welke collega uw taken over kan nemen.",
        en: "Write which colleague can take over your tasks.",
        pattern: "collega|overnemen|over nemen|neemt",
      },
    ],
    minWords: 25,
    maxWords: 90,
    phrases: [
      { nl: "Beste meneer Jansen,", en: "Dear Mr Jansen," },
      { nl: "Ik wil graag een dag vrij op ...", en: "I would like a day off on ..." },
      { nl: "Mijn collega ... kan mijn taken overnemen.", en: "My colleague ... can take over my tasks." },
      { nl: "Vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Beste meneer Jansen,\n\nIk wil graag volgende week een dag vrij. Ik wil vrij op vrijdag 27 november. Mijn moeder komt die dag uit Marokko en ik haal haar op van Schiphol. Mijn collega Peter kan mijn taken overnemen.\n\nVriendelijke groet,\nYusuf",
  },
  {
    id: "officieel-toets-morgen",
    title: "Missing tomorrow's test",
    kind: "email",
    register: "formal",
    official: true,
    situation:
      "U doet een computercursus. Morgen moet u een toets maken, maar u kunt niet naar school komen. U schrijft een e-mail aan uw docent.",
    situationEn:
      "You are taking a computer course. Tomorrow you have a test, but you cannot come to school. You write an email to your teacher.",
    recipient: "Meneer Bakker (b.bakker@mail.nl)",
    points: [
      {
        id: "why-mail",
        nl: "Schrijf waarom u de e-mail stuurt.",
        en: "Write why you are sending the email.",
        pattern: "toets",
      },
      {
        id: "reason",
        nl: "Schrijf waarom u niet kunt komen. Bedenk het zelf.",
        en: "Write why you cannot come. Make it up.",
        pattern: REASON,
      },
      {
        id: "sorry",
        nl: "Bied uw excuses aan.",
        en: "Apologise.",
        pattern: "excuus|excuses|sorry|spijt",
      },
      {
        id: "ask",
        nl: "Vraag wanneer u de toets kunt maken.",
        en: "Ask when you can take the test.",
        pattern: "wanneer|andere dag|nieuwe datum|later|inhalen",
      },
    ],
    minWords: 25,
    maxWords: 90,
    phrases: [
      { nl: "Beste meneer Bakker,", en: "Dear Mr Bakker," },
      { nl: "Ik stuur u deze e-mail omdat ...", en: "I am sending you this email because ..." },
      { nl: "Mijn excuses daarvoor.", en: "My apologies for that." },
      { nl: "Wanneer kan ik de toets maken?", en: "When can I take the test?" },
      { nl: "Vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Beste meneer Bakker,\n\nIk stuur u deze e-mail omdat ik morgen de toets niet kan maken. Ik ben ziek en ik heb koorts. Ik kan daarom niet naar school komen. Mijn excuses daarvoor. Wanneer kan ik de toets maken?\n\nVriendelijke groet,\nLina",
  },
  {
    id: "officieel-bericht-collega",
    title: "Note for a colleague",
    kind: "note",
    register: "informal",
    official: true,
    situation:
      "U werkt in een kledingzaak. Straks komt uw collega Fariha. Zij moet een paar dingen doen. Kijk naar de plaatjes. Schrijf een briefje voor Fariha. Vertel wat zij moet doen. Schrijf drie dingen op.",
    situationEn:
      "You work in a clothing shop. Your colleague Fariha is coming in later and has to do a few things. Look at the pictures. Write Fariha a note telling her three things she must do.",
    pictures: [
      "een stofzuiger",
      "kleren liggen op de grond → kleren hangen netjes aan het rek",
      "een sleutel in het slot van de deur",
    ],
    recipient: "Fariha (collega)",
    points: [
      {
        id: "vacuum",
        nl: "Plaatje 1: de stofzuiger.",
        en: "Picture 1: the vacuum cleaner.",
        pattern: "stofzuig|zuig|vloer",
      },
      {
        id: "clothes",
        nl: "Plaatje 2: de kleren.",
        en: "Picture 2: the clothes.",
        pattern: "ophang|hang|rek|opruim|kleren|kleding",
      },
      {
        id: "lock",
        nl: "Plaatje 3: de deur en de sleutel.",
        en: "Picture 3: the door and the key.",
        pattern: "slot|sleutel|afsluit|sluit|deur dicht",
      },
    ],
    minWords: 20,
    maxWords: 70,
    phrases: [
      { nl: "Hallo Fariha,", en: "Hello Fariha," },
      { nl: "Wil je de winkel stofzuigen?", en: "Will you vacuum the shop?" },
      { nl: "Wil je de kleren aan het rek hangen?", en: "Will you hang the clothes on the rack?" },
      { nl: "Doe je de deur op slot?", en: "Will you lock the door?" },
      { nl: "Alvast bedankt! Groeten,", en: "Thanks in advance! Regards," },
    ],
    model:
      "Hallo Fariha,\n\nWil je vandaag de winkel stofzuigen? De kleren liggen op de grond. Wil je de kleren aan het rek hangen? Doe je om zes uur de deur op slot?\n\nAlvast bedankt!\n\nGroeten,\nMarco",
  },
  {
    id: "officieel-feest",
    title: "A yearly celebration (neighbourhood paper)",
    kind: "text",
    register: "informal",
    official: true,
    situation:
      "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over een feest dat u elk jaar viert. Schrijf minimaal drie zinnen op.",
    situationEn:
      "You get a neighbourhood paper every week. Everyone in the area may write something for it. You write about a celebration you have every year. Write at least three sentences.",
    recipient: "De wijkkrant",
    points: [
      {
        id: "why",
        nl: "Waarom viert u het feest?",
        en: "Why do you celebrate it?",
        pattern: "omdat|want|daarom|einde|voorbij|geboren|begin|nieuw jaar|bedank",
      },
      {
        id: "who",
        nl: "Wie komen er op het feest?",
        en: "Who comes to the celebration?",
        pattern:
          "familie|vrienden|ouders|kinderen|buren|broer|zus|oom|tante|opa|oma|iedereen|gasten|collega",
      },
      {
        id: "what",
        nl: "Wat doet u op het feest?",
        en: "What do you do at the celebration?",
        pattern:
          "eten|eet|dans|muziek|zing|cadeau|kado|spelletje|bid|kook|praten|drinken|vuurwerk|bezoek",
      },
    ],
    minWords: 20,
    maxWords: 90,
    minSentences: 3,
    phrases: [
      { nl: "Elk jaar vier ik ...", en: "Every year I celebrate ..." },
      { nl: "Wij vieren het feest omdat ...", en: "We celebrate it because ..." },
      { nl: "Mijn familie en vrienden komen op het feest.", en: "My family and friends come to the party." },
      { nl: "We eten samen en we dansen.", en: "We eat together and we dance." },
    ],
    model:
      "Elk jaar vier ik het Suikerfeest. Wij vieren het feest omdat de ramadan voorbij is. Mijn familie en mijn buren komen op het feest. We eten samen lekker eten en de kinderen krijgen cadeautjes. Ik vind het feest heel gezellig.",
  },
  {
    id: "officieel-mooiste-kleren",
    title: "Your favourite clothes (neighbourhood paper)",
    kind: "text",
    register: "informal",
    official: true,
    situation:
      "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over de kleren die u het liefst draagt. Schrijf minimaal drie zinnen op.",
    situationEn:
      "You get a neighbourhood paper every week. Everyone in the area may write something for it. You write about the clothes you like to wear most. Write at least three sentences.",
    recipient: "De wijkkrant",
    points: [
      {
        id: "what",
        nl: "Wat draagt u het liefst?",
        en: "What do you like to wear most?",
        pattern:
          "trui|jurk|broek|jas|shirt|rok|pak|kleren|kleding|schoenen|hoofddoek|blouse|overhemd|sjaal|jeans",
      },
      {
        id: "looks",
        nl: "Hoe zien de kleren eruit?",
        en: "What do the clothes look like?",
        pattern:
          "rood|rode|blauw|groen|geel|gele|zwart|wit|grijs|grijze|roze|paars|bruin|oranje|lang|kort|zacht|warm|kleur|bloem|streep",
      },
      {
        id: "when",
        nl: "Wanneer draagt u deze kleren?",
        en: "When do you wear these clothes?",
        pattern:
          "feest|weekend|zondag|zaterdag|elke dag|werk|winter|zomer|thuis|bruiloft|als |wanneer",
      },
    ],
    minWords: 20,
    maxWords: 90,
    minSentences: 3,
    phrases: [
      { nl: "Ik draag het liefst ...", en: "I most like to wear ..." },
      { nl: "De jurk is blauw en lang.", en: "The dress is blue and long." },
      { nl: "Ik draag de jurk op feestjes.", en: "I wear the dress to parties." },
    ],
    model:
      "Ik draag het liefst mijn blauwe jurk. De jurk is lang en heeft witte bloemen. De stof is zacht en licht. Ik draag de jurk op feestjes en in de zomer. Ik voel me mooi in deze jurk.",
  },
  {
    id: "officieel-weekend",
    title: "Your weekend (neighbourhood paper)",
    kind: "text",
    register: "informal",
    official: true,
    situation:
      "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over uw weekend. Schrijf minimaal drie zinnen op.",
    situationEn:
      "You get a neighbourhood paper every week. Everyone in the area may write something for it. You write about your weekend. Write at least three sentences.",
    recipient: "De wijkkrant",
    points: [
      {
        id: "what",
        nl: "Wat doet u graag in het weekend?",
        en: "What do you like to do at the weekend?",
        pattern:
          "graag|voetbal|wandel|fiets|zwem|kook|winkel|lees|film|sport|bezoek|slaap|uitrust",
      },
      {
        id: "who",
        nl: "Met wie doet u dat?",
        en: "Who do you do it with?",
        pattern: "met (?:mijn|m'n|onze|de|vrienden|familie)|samen|alleen",
      },
      {
        id: "where",
        nl: "Waar doet u dat?",
        en: "Where do you do it?",
        pattern:
          "park|bos|strand|thuis|stad|centrum|markt|zwembad|sportschool|sporthal|veld|winkel|bij (?:mijn|m'n|ons|vrienden|familie)",
      },
    ],
    minWords: 20,
    maxWords: 90,
    minSentences: 3,
    phrases: [
      { nl: "In het weekend ga ik graag ...", en: "At the weekend I like to ..." },
      { nl: "Ik doe dat samen met ...", en: "I do that together with ..." },
      { nl: "We gaan naar het park.", en: "We go to the park." },
    ],
    model:
      "In het weekend ga ik graag wandelen. Ik wandel samen met mijn man en onze hond. We lopen in het park bij ons huis. Op zondag drinken we daarna koffie in de stad. Ik vind het weekend heel fijn.",
  },
];

export const officialFormTasks: FormTask[] = [
  {
    id: "officieel-cursus-koken",
    title: "Sign up for a cooking course",
    formTitle: "Aanmeldformulier Gezond koken",
    official: true,
    situation:
      "U wilt een cursus gezond koken volgen. U vult een aanmeldformulier in. Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    situationEn:
      "You want to take a healthy cooking course. Fill in the sign-up form. Make up some of the details yourself.",
    fields: [
      { id: "naam", label: "Voor- en achternaam", kind: "text", answer: "Ayşe Demir", open: true },
      { id: "adres", label: "Adres", kind: "text", answer: "Lindelaan 12", open: true },
      { id: "postcode", label: "Postcode", kind: "postcode", answer: "3811 AB", placeholder: "1234 AB", open: true },
      { id: "woonplaats", label: "Woonplaats", kind: "text", answer: "Amersfoort", open: true },
      { id: "telefoon", label: "Telefoonnummer", kind: "phone", answer: "06 12345678", open: true },
      { id: "email", label: "E-mail", kind: "email", answer: "a.demir@mail.nl", open: true },
      {
        id: "groep",
        label: "Ik wil meedoen met de volgende groep:",
        kind: "choice",
        answer: "Donderdagavond 19.00 - 21.00 uur",
        options: [
          "Dinsdagavond 18.00 - 20.00 uur",
          "Donderdagavond 19.00 - 21.00 uur",
          "Vrijdagavond 18.30 - 20.30 uur",
        ],
        open: true,
      },
      {
        id: "gerecht",
        label: "Welk gerecht wilt u graag leren koken?",
        kind: "sentence",
        answer: "Ik wil graag gezonde groentesoep leren koken.",
        pattern: ".",
        open: true,
      },
      {
        id: "waarom",
        label: "Waarom wilt u naar de cursus?",
        kind: "sentence",
        answer: "Ik wil gezonder eten, want ik wil afvallen.",
        pattern: "omdat|want|gezond|leren|afval|kind|familie|eten|koken|wil",
        open: true,
      },
    ],
  },
  {
    id: "officieel-aangifte",
    title: "Report a stolen bag",
    formTitle: "Aangifteformulier",
    official: true,
    situation:
      "U gaat winkelen. Iemand steelt tijdens het winkelen uw tas met spullen. U gaat aangifte doen. U moet een formulier invullen. Vul het formulier in. Kijk naar de plaatjes. Sommige gegevens moet u zelf bedenken.",
    situationEn:
      "You go shopping. Someone steals your bag with your things. You report it to the police and fill in a form. Look at the pictures. Make up some of the details yourself.",
    pictures: ["een laptop", "een zilveren horloge"],
    fields: [
      {
        id: "wat",
        label: "Wat is er gebeurd?",
        kind: "sentence",
        answer: "Iemand heeft in de winkel mijn tas gestolen.",
        pattern: "gestolen|steel|stal|gepakt|weg|kwijt|dief",
        open: true,
      },
      {
        id: "spullen",
        label: "Welke spullen bent u kwijt?",
        kind: "sentence",
        answer: "Ik ben mijn laptop en mijn horloge kwijt.",
        pattern: "^(?=.*(?:laptop|computer))(?=.*horloge)",
        open: true,
      },
      {
        id: "uiterlijk",
        label: "Hoe zien uw spullen eruit?",
        kind: "sentence",
        answer: "De laptop is grijs en het horloge is van zilver.",
        pattern:
          "grijs|zilver|zwart|wit|nieuw|oud|groot|klein|metaal|kleur|merk|duur|blauw",
        open: true,
      },
      {
        id: "wanneer",
        label: "Wanneer is het gebeurd?",
        kind: "sentence",
        answer: "Het is gisteren om 15.00 uur gebeurd.",
        pattern: `gisteren|vandaag|uur|middag|ochtend|avond|${DAY}`,
        open: true,
      },
      { id: "naam", label: "Voor- en achternaam", kind: "text", answer: "Ayşe Demir", open: true },
      { id: "adres", label: "Adres", kind: "text", answer: "Lindelaan 12", open: true },
      { id: "postcode", label: "Postcode", kind: "postcode", answer: "3811 AB", placeholder: "1234 AB", open: true },
      { id: "woonplaats", label: "Woonplaats", kind: "text", answer: "Amersfoort", open: true },
      { id: "telefoon", label: "Telefoonnummer", kind: "phone", answer: "06 12345678", open: true },
      {
        id: "datum",
        label: "Datum aangifte",
        kind: "date",
        answer: "19-11-2026",
        placeholder: "dd-mm-jjjj",
        open: true,
      },
    ],
  },
  {
    id: "officieel-problemen-straat",
    title: "Report problems in your street",
    formTitle: "Meldingsformulier",
    official: true,
    situation:
      "In de straat waar u woont zijn twee problemen. Op de foto's ziet u wat de problemen zijn. U meldt de problemen bij de gemeente. Vul het formulier van de gemeente in. Sommige gegevens moet u zelf bedenken.",
    situationEn:
      "There are two problems in the street where you live. The photos show what they are. Report them to the municipality by filling in its form. Make up some of the details yourself.",
    pictures: [
      "vuilniszakken en afval op de stoep",
      "kapotte stoeptegels met een gat",
    ],
    fields: [
      { id: "naam", label: "Voor- en achternaam", kind: "text", answer: "Ayşe Demir", open: true },
      { id: "adres", label: "Adres", kind: "text", answer: "Kerkstraat 8", open: true },
      { id: "postcode", label: "Postcode", kind: "postcode", answer: "3811 AB", placeholder: "1234 AB", open: true },
      { id: "woonplaats", label: "Woonplaats", kind: "text", answer: "Amersfoort", open: true },
      { id: "telefoon", label: "Telefoonnummer", kind: "phone", answer: "06 12345678", open: true },
      { id: "email", label: "E-mail", kind: "email", answer: "a.demir@mail.nl", open: true },
      {
        id: "straat",
        label: "In welke straat zijn er problemen?",
        kind: "text",
        answer: "Kerkstraat",
        open: true,
      },
      {
        id: "problemen",
        label: "Wat zijn de problemen?",
        kind: "sentence",
        answer: "Er ligt veel afval op de stoep en de stoeptegels zijn kapot.",
        pattern:
          "^(?=.*(?:afval|vuil|zak|rommel|troep))(?=.*(?:tegel|stoep|kapot|gat))",
        open: true,
      },
    ],
  },
];
