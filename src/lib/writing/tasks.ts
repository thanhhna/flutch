import type { WritingTask } from "./types";

export const writingTasks: WritingTask[] = [
  {
    id: "huisarts-verzetten",
    title: "Move a doctor's appointment",
    kind: "email",
    register: "formal",
    situation:
      "U heeft morgen om 10.00 uur een afspraak bij de huisarts. U kunt niet komen. Schrijf een e-mail aan de assistente van de huisarts.",
    situationEn:
      "You have a doctor's appointment tomorrow at 10:00. You cannot come. Write an email to the doctor's assistant.",
    recipient: "Assistente huisartsenpraktijk",
    points: [
      {
        id: "cancel",
        nl: "Zeg dat u de afspraak wilt verzetten.",
        en: "Say you want to move the appointment.",
        pattern: "verzet|verplaats|andere afspraak|nieuwe afspraak|andere dag|ander tijdstip",
      },
      {
        id: "reason",
        nl: "Zeg waarom u niet kunt komen.",
        en: "Say why you cannot come.",
        pattern: "omdat|want|ziek|werk|kind|moet|kan niet|kan helaas niet|kan ik niet",
      },
      {
        id: "when",
        nl: "Vraag om een afspraak op donderdag of vrijdag.",
        en: "Ask for an appointment on Thursday or Friday.",
        pattern: "donderdag|vrijdag",
      },
    ],
    minWords: 30,
    maxWords: 70,
    phrases: [
      { nl: "Geachte heer/mevrouw,", en: "Dear Sir/Madam," },
      { nl: "Ik schrijf u omdat ...", en: "I am writing to you because ..." },
      { nl: "Ik wil mijn afspraak graag verzetten.", en: "I would like to move my appointment." },
      { nl: "Kan ik een nieuwe afspraak maken op ...?", en: "Can I make a new appointment on ...?" },
      { nl: "Alvast bedankt.", en: "Thanks in advance." },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte heer/mevrouw,\n\nIk heb morgen om 10.00 uur een afspraak bij de huisarts. Ik kan helaas niet komen, omdat ik moet werken. Ik wil mijn afspraak daarom graag verzetten. Kan ik een nieuwe afspraak maken op donderdag of vrijdag?\n\nAlvast bedankt.\n\nMet vriendelijke groet,\nAnna de Vries",
  },
  {
    id: "buurman-lawaai",
    title: "Noise from the neighbour",
    kind: "note",
    register: "informal",
    situation:
      "Uw buurman maakt elke avond veel lawaai. Schrijf een briefje aan uw buurman.",
    situationEn:
      "Your neighbour makes a lot of noise every evening. Write a note to your neighbour.",
    recipient: "Buurman",
    points: [
      {
        id: "problem",
        nl: "Zeg wat het probleem is.",
        en: "Say what the problem is.",
        pattern: "lawaai|muziek|herrie|geluid|luid|hard",
      },
      {
        id: "time",
        nl: "Zeg wanneer het probleem is.",
        en: "Say when the problem happens.",
        pattern: "avond|nacht|elke dag|iedere dag|'s avonds|na \\d",
      },
      {
        id: "ask",
        nl: "Vraag of hij het wil stoppen of zachter wil doen.",
        en: "Ask him to stop or turn it down.",
        pattern: "zachter|stop|minder|kun je|kan je|wil je|wilt u|alsjeblieft|alstublieft",
      },
    ],
    minWords: 25,
    maxWords: 60,
    phrases: [
      { nl: "Ik heb last van ...", en: "I am bothered by ..." },
      { nl: "Elke avond hoor ik ...", en: "Every evening I hear ..." },
      { nl: "Kun je de muziek zachter zetten?", en: "Can you turn the music down?" },
      { nl: "Alvast bedankt.", en: "Thanks in advance." },
      { nl: "Groetjes,", en: "Greetings," },
    ],
    model:
      "Hoi buurman,\n\nIk woon boven je. Elke avond hoor ik veel muziek en ik kan dan niet slapen. Ik heb last van het lawaai na tien uur. Kun je de muziek zachter zetten, alsjeblieft?\n\nAlvast bedankt.\n\nGroetjes,\nTom",
  },
  {
    id: "kind-ziek-school",
    title: "Child is sick",
    kind: "email",
    register: "formal",
    situation:
      "Uw zoon Daan zit in groep 5. Hij is ziek en kan niet naar school. Schrijf een e-mail aan de leraar.",
    situationEn:
      "Your son Daan is in group 5. He is sick and cannot go to school. Write an email to the teacher.",
    recipient: "Meester Peter",
    points: [
      {
        id: "who",
        nl: "Zeg wie ziek is.",
        en: "Say who is sick.",
        pattern: "daan|mijn zoon",
      },
      {
        id: "sick",
        nl: "Zeg dat hij ziek is of koorts heeft.",
        en: "Say he is sick or has a fever.",
        pattern: "ziek|koorts|buikpijn|hoofdpijn|griep|verkouden",
      },
      {
        id: "days",
        nl: "Zeg hoe lang hij thuisblijft.",
        en: "Say how long he stays at home.",
        pattern: "dag|dagen|morgen|woensdag|donderdag|vrijdag|week|maandag|dinsdag",
      },
      {
        id: "homework",
        nl: "Vraag naar het huiswerk.",
        en: "Ask about the homework.",
        pattern: "huiswerk|opdracht|les",
      },
    ],
    minWords: 30,
    maxWords: 70,
    phrases: [
      { nl: "Mijn zoon is ziek.", en: "My son is sick." },
      { nl: "Hij heeft koorts.", en: "He has a fever." },
      { nl: "Hij blijft twee dagen thuis.", en: "He stays at home for two days." },
      { nl: "Kunt u mij het huiswerk sturen?", en: "Can you send me the homework?" },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte meester Peter,\n\nMijn zoon Daan is ziek. Hij heeft koorts en hij kan niet naar school. Hij blijft twee dagen thuis. Kunt u mij het huiswerk sturen?\n\nMet vriendelijke groet,\nFatima Yilmaz",
  },
  {
    id: "uitnodiging-verjaardag",
    title: "Birthday invitation",
    kind: "message",
    register: "informal",
    situation:
      "U wordt zaterdag 35 jaar. U geeft een feestje. Schrijf een bericht aan een vriend en nodig hem uit.",
    situationEn:
      "You turn 35 on Saturday. You are having a party. Write a message to a friend and invite him.",
    recipient: "Vriend",
    points: [
      {
        id: "invite",
        nl: "Nodig hem uit voor het feestje.",
        en: "Invite him to the party.",
        pattern: "feest|uitnodig|verjaardag|kom je|kun je komen|kan je komen",
      },
      {
        id: "when",
        nl: "Zeg wanneer het feestje is.",
        en: "Say when the party is.",
        pattern: "zaterdag|\\d+[.:]\\d+|\\d+ uur|om \\d",
      },
      {
        id: "where",
        nl: "Zeg waar het feestje is.",
        en: "Say where the party is.",
        pattern: "bij mij|thuis|straat|adres|huis|café|restaurant|park",
      },
      {
        id: "bring",
        nl: "Zeg dat hij iets mee moet nemen.",
        en: "Say he should bring something.",
        pattern: "meenemen|mee te nemen|neem|breng|drinken|eten",
      },
    ],
    minWords: 30,
    maxWords: 70,
    phrases: [
      { nl: "Ik word zaterdag 35 jaar.", en: "I turn 35 on Saturday." },
      { nl: "Ik geef een feestje bij mij thuis.", en: "I am having a party at my place." },
      { nl: "Het feest begint om 8 uur.", en: "The party starts at 8." },
      { nl: "Kun je ook iets te drinken meenemen?", en: "Can you also bring something to drink?" },
      { nl: "Tot zaterdag!", en: "See you Saturday!" },
    ],
    model:
      "Hoi Mark,\n\nIk word zaterdag 35 jaar en ik geef een feestje. Het feest is bij mij thuis en begint om 8 uur. Kun je komen? Je mag ook iets te drinken meenemen.\n\nTot zaterdag!\n\nGroetjes,\nSanne",
  },
  {
    id: "ziek-melden-werk",
    title: "Call in sick at work",
    kind: "email",
    register: "formal",
    situation:
      "U bent ziek en kunt vandaag niet werken. Schrijf een e-mail aan uw baas, mevrouw Jansen.",
    situationEn:
      "You are sick and cannot work today. Write an email to your boss, Mrs Jansen.",
    recipient: "Mevrouw Jansen",
    points: [
      {
        id: "sick",
        nl: "Zeg dat u ziek bent.",
        en: "Say you are sick.",
        pattern: "ziek|koorts|griep|verkouden|hoofdpijn|buikpijn",
      },
      {
        id: "cannot",
        nl: "Zeg dat u vandaag niet kunt werken.",
        en: "Say you cannot work today.",
        pattern: "niet (kunnen|kan|kom)|kan.*niet|niet.*werken",
      },
      {
        id: "back",
        nl: "Zeg wanneer u terugkomt.",
        en: "Say when you come back.",
        pattern: "terug|weer|woensdag|donderdag|vrijdag|maandag|dinsdag|volgende week|morgen",
      },
    ],
    minWords: 25,
    maxWords: 60,
    phrases: [
      { nl: "Ik ben ziek.", en: "I am sick." },
      { nl: "Ik kan vandaag helaas niet werken.", en: "Unfortunately I cannot work today." },
      { nl: "Ik hoop dat ik maandag weer kan komen.", en: "I hope I can come back on Monday." },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte mevrouw Jansen,\n\nIk ben ziek en ik heb koorts. Ik kan vandaag helaas niet werken. Ik hoop dat ik maandag weer kan komen. Ik bel u als dat niet lukt.\n\nMet vriendelijke groet,\nAhmed Hassan",
  },
  {
    id: "verwarming-kapot",
    title: "Broken heating",
    kind: "email",
    register: "formal",
    situation:
      "De verwarming in uw huurwoning is kapot. Schrijf een e-mail aan de woningcorporatie.",
    situationEn:
      "The heating in your rental home is broken. Write an email to the housing association.",
    recipient: "Woningcorporatie",
    points: [
      {
        id: "problem",
        nl: "Zeg wat er kapot is.",
        en: "Say what is broken.",
        pattern: "verwarming|kapot|werkt niet",
      },
      {
        id: "since",
        nl: "Zeg sinds wanneer het kapot is.",
        en: "Say since when it is broken.",
        pattern: "sinds|al \\w+ dag|vorige week|gisteren|zondag|maandag|twee dagen|drie dagen|een week",
      },
      {
        id: "address",
        nl: "Geef uw adres.",
        en: "Give your address.",
        pattern: "\\b\\d+\\b.*(straat|laan|weg|plein)|(straat|laan|weg|plein).*\\b\\d+\\b|adres",
      },
      {
        id: "repair",
        nl: "Vraag of iemand het snel kan repareren.",
        en: "Ask someone to repair it soon.",
        pattern: "repar|monteur|maken|langskomen|komen kijken",
      },
    ],
    minWords: 35,
    maxWords: 80,
    phrases: [
      { nl: "De verwarming werkt niet.", en: "The heating does not work." },
      { nl: "Het is al drie dagen koud in huis.", en: "It has been cold in the house for three days." },
      { nl: "Ik woon op het adres ...", en: "I live at the address ..." },
      { nl: "Kunt u zo snel mogelijk een monteur sturen?", en: "Can you send a mechanic as soon as possible?" },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte heer/mevrouw,\n\nDe verwarming in mijn huis is kapot. Het is al drie dagen koud en ik heb twee kleine kinderen. Ik woon in de Lindelaan 12 in Utrecht. Kunt u zo snel mogelijk een monteur sturen om de verwarming te repareren?\n\nMet vriendelijke groet,\nPiotr Nowak",
  },
  {
    id: "cursus-info",
    title: "Ask about a course",
    kind: "email",
    register: "formal",
    situation:
      "U wilt een cursus fotografie volgen bij het buurthuis. Schrijf een e-mail en stel vragen.",
    situationEn:
      "You want to take a photography course at the community centre. Write an email and ask questions.",
    recipient: "Buurthuis",
    points: [
      {
        id: "interest",
        nl: "Zeg dat u de cursus wilt volgen.",
        en: "Say you want to take the course.",
        pattern: "cursus|les|volgen|meedoen|aanmelden|inschrijven",
      },
      {
        id: "price",
        nl: "Vraag hoeveel de cursus kost.",
        en: "Ask how much the course costs.",
        pattern: "kost|prijs|euro|betalen|hoeveel",
      },
      {
        id: "start",
        nl: "Vraag wanneer de cursus begint.",
        en: "Ask when the course starts.",
        pattern: "begin|start|wanneer|hoe laat|welke dag",
      },
    ],
    minWords: 30,
    maxWords: 70,
    phrases: [
      { nl: "Ik wil graag de cursus fotografie volgen.", en: "I would like to take the photography course." },
      { nl: "Hoeveel kost de cursus?", en: "How much does the course cost?" },
      { nl: "Wanneer begint de cursus?", en: "When does the course start?" },
      { nl: "Kunt u mij meer informatie sturen?", en: "Can you send me more information?" },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte heer/mevrouw,\n\nIk wil graag de cursus fotografie volgen. Ik heb een paar vragen. Hoeveel kost de cursus? En wanneer begint de cursus? Kunt u mij ook meer informatie sturen?\n\nMet vriendelijke groet,\nLinh Tran",
  },
  {
    id: "adreswijziging",
    title: "Change of address",
    kind: "email",
    register: "formal",
    situation:
      "U gaat verhuizen. Schrijf een e-mail aan de gemeente om uw nieuwe adres door te geven.",
    situationEn:
      "You are moving. Write an email to the municipality to give your new address.",
    recipient: "Gemeente",
    points: [
      {
        id: "move",
        nl: "Zeg dat u gaat verhuizen.",
        en: "Say you are moving.",
        pattern: "verhuis|verhuizen|nieuw huis|nieuwe woning",
      },
      {
        id: "date",
        nl: "Zeg op welke datum u verhuist.",
        en: "Say the date you move.",
        pattern: "januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|\\d+[-/]\\d+|volgende maand|volgende week",
      },
      {
        id: "newaddress",
        nl: "Geef uw nieuwe adres.",
        en: "Give your new address.",
        pattern: "\\b\\d+\\b.*(straat|laan|weg|plein)|(straat|laan|weg|plein).*\\b\\d+\\b|nieuwe adres",
      },
    ],
    minWords: 25,
    maxWords: 60,
    phrases: [
      { nl: "Ik ga verhuizen.", en: "I am going to move." },
      { nl: "Ik verhuis op 1 november.", en: "I move on 1 November." },
      { nl: "Mijn nieuwe adres is ...", en: "My new address is ..." },
      { nl: "Wilt u mijn adres veranderen?", en: "Will you change my address?" },
      { nl: "Met vriendelijke groet,", en: "Kind regards," },
    ],
    model:
      "Geachte heer/mevrouw,\n\nIk ga verhuizen. Ik verhuis op 1 november. Mijn nieuwe adres is Kerkstraat 45, 3511 AB Utrecht. Wilt u mijn adres veranderen?\n\nMet vriendelijke groet,\nMaria Silva",
  },
  {
    id: "bedankt-collega",
    title: "Thank a colleague",
    kind: "message",
    register: "informal",
    situation:
      "Uw collega Lisa heeft u gisteren geholpen met uw werk. Schrijf een bericht en bedank haar.",
    situationEn:
      "Your colleague Lisa helped you with your work yesterday. Write a message and thank her.",
    recipient: "Lisa",
    points: [
      {
        id: "thanks",
        nl: "Bedank Lisa.",
        en: "Thank Lisa.",
        pattern: "bedankt|dank|bedank",
      },
      {
        id: "what",
        nl: "Zeg waarmee zij u heeft geholpen.",
        en: "Say what she helped you with.",
        pattern: "geholpen|hulp|werk|computer|rapport|taak|project",
      },
      {
        id: "offer",
        nl: "Nodig haar uit voor koffie of lunch.",
        en: "Invite her for coffee or lunch.",
        pattern: "koffie|lunch|thee|eten|drinken|taart",
      },
    ],
    minWords: 25,
    maxWords: 60,
    phrases: [
      { nl: "Hartelijk bedankt voor je hulp.", en: "Thank you very much for your help." },
      { nl: "Je hebt mij gisteren geholpen met ...", en: "You helped me yesterday with ..." },
      { nl: "Zullen we samen koffie drinken?", en: "Shall we have coffee together?" },
      { nl: "Groetjes,", en: "Greetings," },
    ],
    model:
      "Hoi Lisa,\n\nHartelijk bedankt voor je hulp gisteren. Je hebt mij geholpen met mijn rapport. Dat was erg aardig van je. Zullen we morgen samen koffie drinken? Ik trakteer.\n\nGroetjes,\nOmar",
  },
  {
    id: "vakantie-kaart",
    title: "Holiday postcard",
    kind: "note",
    register: "informal",
    situation:
      "U bent op vakantie in Spanje. Schrijf een kaart aan een vriendin.",
    situationEn:
      "You are on holiday in Spain. Write a postcard to a female friend.",
    recipient: "Vriendin",
    points: [
      {
        id: "where",
        nl: "Zeg waar u bent.",
        en: "Say where you are.",
        pattern: "spanje|hotel|strand|stad|zee",
      },
      {
        id: "weather",
        nl: "Vertel over het weer.",
        en: "Tell about the weather.",
        pattern: "weer|zon|warm|heet|regen|koud|mooi",
      },
      {
        id: "doing",
        nl: "Vertel wat u doet.",
        en: "Tell what you do.",
        pattern: "zwem|eet|wandel|ga naar|bezoek|lees|ontspan|strand|ik doe",
      },
      {
        id: "back",
        nl: "Zeg wanneer u terugkomt.",
        en: "Say when you come back.",
        pattern: "terug|thuis|volgende week|zaterdag|zondag|tot ziens|tot snel",
      },
    ],
    minWords: 30,
    maxWords: 70,
    phrases: [
      { nl: "Ik zit nu in Spanje.", en: "I am in Spain now." },
      { nl: "Het weer is heel mooi en warm.", en: "The weather is very nice and warm." },
      { nl: "Ik zwem elke dag in de zee.", en: "I swim in the sea every day." },
      { nl: "Ik kom zaterdag weer thuis.", en: "I come home again on Saturday." },
      { nl: "Tot snel!", en: "See you soon!" },
    ],
    model:
      "Lieve Emma,\n\nIk zit nu in Spanje. Het weer is heel mooi en het is warm. Ik zwem elke dag in de zee en ik eet lekker. Ik kom zaterdag weer thuis. Tot snel!\n\nGroetjes,\nNadia",
  },
];
