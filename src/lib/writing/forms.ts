import type { FormTask } from "./types";

export const formTasks: FormTask[] = [
  {
    id: "form-gemeente",
    title: "Register at the municipality",
    formTitle: "Gemeente Utrecht - Inschrijving nieuwe inwoner",
    situation:
      "U gaat verhuizen naar Utrecht. Lees de tekst en vul het formulier in.",
    situationEn:
      "You are moving to Utrecht. Read the text and fill in the form.",
    source:
      "Mijn naam is Maria Silva. Ik ben op 14 maart 1990 geboren in Lissabon. Ik heb de Portugese nationaliteit. Vanaf 1 november woon ik in de Kerkstraat 45, 3511 AB Utrecht. Mijn telefoonnummer is 06 12345678 en mijn e-mailadres is maria.silva@mail.com.",
    fields: [
      { id: "voornaam", label: "Voornaam", kind: "text", answer: "Maria" },
      { id: "achternaam", label: "Achternaam", kind: "text", answer: "Silva" },
      {
        id: "geboortedatum",
        label: "Geboortedatum",
        kind: "date",
        answer: "14-03-1990",
        placeholder: "dd-mm-jjjj",
      },
      {
        id: "geboorteplaats",
        label: "Geboorteplaats",
        kind: "text",
        answer: "Lissabon",
        accept: ["Lisboa"],
      },
      {
        id: "nationaliteit",
        label: "Nationaliteit",
        kind: "text",
        answer: "Portugese",
        accept: ["Portugees"],
      },
      {
        id: "straat",
        label: "Straat en huisnummer",
        kind: "text",
        answer: "Kerkstraat 45",
      },
      {
        id: "postcode",
        label: "Postcode",
        kind: "postcode",
        answer: "3511AB",
        placeholder: "1234 AB",
      },
      { id: "woonplaats", label: "Woonplaats", kind: "text", answer: "Utrecht" },
      {
        id: "verhuisdatum",
        label: "Datum verhuizing",
        kind: "text",
        answer: "1 november",
        accept: ["1 November"],
      },
      {
        id: "telefoon",
        label: "Telefoonnummer",
        kind: "phone",
        answer: "0612345678",
      },
      {
        id: "email",
        label: "E-mailadres",
        kind: "email",
        answer: "maria.silva@mail.com",
      },
    ],
  },
  {
    id: "form-bibliotheek",
    title: "Library membership",
    formTitle: "Bibliotheek Haarlem - Aanmeldformulier",
    situation:
      "U wilt lid worden van de bibliotheek. Lees de tekst en vul het formulier in.",
    situationEn:
      "You want to join the library. Read the text and fill in the form.",
    source:
      "Ik ben Jan de Boer. Ik ben geboren op 2 mei 1978. Ik woon in de Nieuwstraat 8, 2011 CD Haarlem. Ik ben 47 jaar oud, dus ik ben volwassen. Mijn telefoonnummer is 06 98765432. Ik wil graag een abonnement voor boeken en tijdschriften.",
    fields: [
      { id: "naam", label: "Naam", kind: "text", answer: "Jan de Boer" },
      {
        id: "geboortedatum",
        label: "Geboortedatum",
        kind: "date",
        answer: "02-05-1978",
        placeholder: "dd-mm-jjjj",
      },
      {
        id: "adres",
        label: "Adres",
        kind: "text",
        answer: "Nieuwstraat 8",
      },
      {
        id: "postcode",
        label: "Postcode",
        kind: "postcode",
        answer: "2011CD",
        placeholder: "1234 AB",
      },
      { id: "plaats", label: "Plaats", kind: "text", answer: "Haarlem" },
      {
        id: "telefoon",
        label: "Telefoonnummer",
        kind: "phone",
        answer: "0698765432",
      },
      {
        id: "lidmaatschap",
        label: "Soort lidmaatschap",
        kind: "choice",
        answer: "Volwassene",
        options: ["Kind (0-17 jaar)", "Volwassene", "Senior (65+)"],
      },
      {
        id: "abonnement",
        label: "Wat wilt u lenen?",
        kind: "choice",
        answer: "Boeken en tijdschriften",
        options: ["Alleen boeken", "Boeken en tijdschriften", "Films en muziek"],
      },
    ],
  },
  {
    id: "form-sportschool",
    title: "Join a gym",
    formTitle: "FitPlus Rotterdam - Inschrijfformulier",
    situation:
      "U wilt naar de sportschool. Lees de tekst en vul het formulier in. Schrijf ook een zin bij de laatste vraag.",
    situationEn:
      "You want to join a gym. Read the text and fill in the form. Also write one sentence for the last question.",
    source:
      "Hallo, ik ben Fatima Yilmaz. Mijn geboortedatum is 23 juli 1995. Ik woon aan de Havenweg 102 in Rotterdam. De postcode is 3011 EF. Mijn e-mailadres is fatima.yilmaz@mail.nl. Ik werk de hele dag, dus ik kom alleen in de avond. Ik wil graag per 1 december beginnen, want ik wil afvallen.",
    fields: [
      { id: "naam", label: "Naam", kind: "text", answer: "Fatima Yilmaz" },
      {
        id: "geboortedatum",
        label: "Geboortedatum",
        kind: "date",
        answer: "23-07-1995",
        placeholder: "dd-mm-jjjj",
      },
      {
        id: "adres",
        label: "Straat en huisnummer",
        kind: "text",
        answer: "Havenweg 102",
      },
      {
        id: "postcode",
        label: "Postcode",
        kind: "postcode",
        answer: "3011EF",
        placeholder: "1234 AB",
      },
      { id: "plaats", label: "Woonplaats", kind: "text", answer: "Rotterdam" },
      {
        id: "email",
        label: "E-mailadres",
        kind: "email",
        answer: "fatima.yilmaz@mail.nl",
      },
      {
        id: "tijd",
        label: "Wanneer wilt u sporten?",
        kind: "choice",
        answer: "In de avond",
        options: ["In de ochtend", "In de middag", "In de avond"],
      },
      {
        id: "start",
        label: "Startdatum",
        kind: "text",
        answer: "1 december",
        accept: ["1 December"],
      },
      {
        id: "reden",
        label: "Waarom wilt u lid worden? (schrijf een zin)",
        kind: "sentence",
        answer: "Ik wil afvallen.",
        pattern: "afval|gewicht|fit|gezond|sport",
      },
    ],
  },
  {
    id: "form-huisarts",
    title: "Register with a doctor",
    formTitle: "Huisartsenpraktijk De Linde - Inschrijving patiënt",
    situation:
      "U wilt zich inschrijven bij een nieuwe huisarts. Lees de tekst en vul het formulier in.",
    situationEn:
      "You want to register with a new doctor. Read the text and fill in the form.",
    source:
      "Ik heet Omar Haddad en ik ben geboren op 9 september 1985. Mijn BSN is 123456782. Ik ben verzekerd bij Zilveren Kruis. Mijn telefoonnummer is 06 55512345. Ik heb sinds drie dagen hoofdpijn en ik wil graag snel een afspraak.",
    fields: [
      { id: "naam", label: "Naam", kind: "text", answer: "Omar Haddad" },
      {
        id: "geboortedatum",
        label: "Geboortedatum",
        kind: "date",
        answer: "09-09-1985",
        placeholder: "dd-mm-jjjj",
      },
      { id: "bsn", label: "BSN", kind: "number", answer: "123456782" },
      {
        id: "verzekering",
        label: "Zorgverzekeraar",
        kind: "text",
        answer: "Zilveren Kruis",
      },
      {
        id: "telefoon",
        label: "Telefoonnummer",
        kind: "phone",
        answer: "0655512345",
      },
      {
        id: "klacht",
        label: "Wat is uw klacht? (schrijf een zin)",
        kind: "sentence",
        answer: "Ik heb hoofdpijn.",
        pattern: "hoofdpijn",
      },
      {
        id: "duur",
        label: "Hoe lang heeft u de klacht?",
        kind: "choice",
        answer: "3 dagen",
        options: ["1 dag", "3 dagen", "1 week", "1 maand"],
      },
    ],
  },
  {
    id: "form-telefoon",
    title: "Phone subscription",
    formTitle: "BelNu - Aanvraag abonnement",
    situation:
      "U wilt een nieuw telefoonabonnement. Lees de tekst en vul het formulier in.",
    situationEn:
      "You want a new phone subscription. Read the text and fill in the form.",
    source:
      "Mijn naam is Ahmed Hassan en ik woon in de Beukenlaan 7, 5611 GH Eindhoven. Mijn e-mailadres is ahmed.hassan@mail.com. Ik wil een abonnement van 10 GB. Het abonnement moet op 15 januari beginnen. Mijn rekeningnummer is NL91 ABNA 0417 1643 00.",
    fields: [
      { id: "naam", label: "Naam", kind: "text", answer: "Ahmed Hassan" },
      {
        id: "adres",
        label: "Straat en huisnummer",
        kind: "text",
        answer: "Beukenlaan 7",
      },
      {
        id: "postcode",
        label: "Postcode",
        kind: "postcode",
        answer: "5611GH",
        placeholder: "1234 AB",
      },
      { id: "plaats", label: "Woonplaats", kind: "text", answer: "Eindhoven" },
      {
        id: "email",
        label: "E-mailadres",
        kind: "email",
        answer: "ahmed.hassan@mail.com",
      },
      {
        id: "bundel",
        label: "Kies uw bundel",
        kind: "choice",
        answer: "10 GB",
        options: ["2 GB", "10 GB", "Onbeperkt"],
      },
      {
        id: "iban",
        label: "IBAN (rekeningnummer)",
        kind: "iban",
        answer: "NL91ABNA0417164300",
        placeholder: "NL00 BANK 0000 0000 00",
      },
    ],
  },
  {
    id: "form-verloren",
    title: "Lost property report",
    formTitle: "NS Klantenservice - Verloren voorwerp melden",
    situation:
      "U bent uw tas vergeten in de trein. Lees de tekst en vul het formulier in.",
    situationEn:
      "You forgot your bag on the train. Read the text and fill in the form.",
    source:
      "Ik ben Linh Tran. Op 5 oktober was ik in de trein van Amsterdam naar Utrecht. Ik ben mijn zwarte rugzak vergeten. In de rugzak zitten mijn laptop en mijn sleutels. Bel mij op 06 44455566 of stuur een e-mail naar linh.tran@mail.com.",
    fields: [
      { id: "naam", label: "Naam", kind: "text", answer: "Linh Tran" },
      {
        id: "datum",
        label: "Datum",
        kind: "text",
        answer: "5 oktober",
        accept: ["5 Oktober"],
      },
      { id: "van", label: "Trein van", kind: "text", answer: "Amsterdam" },
      { id: "naar", label: "Trein naar", kind: "text", answer: "Utrecht" },
      {
        id: "voorwerp",
        label: "Wat bent u kwijt?",
        kind: "choice",
        answer: "Rugzak",
        options: ["Paraplu", "Rugzak", "Jas", "Portemonnee"],
      },
      {
        id: "kleur",
        label: "Welke kleur?",
        kind: "choice",
        answer: "Zwart",
        options: ["Zwart", "Blauw", "Rood", "Groen"],
      },
      {
        id: "inhoud",
        label: "Wat zit erin? (schrijf een zin)",
        kind: "sentence",
        answer: "In de rugzak zitten mijn laptop en mijn sleutels.",
        pattern: "laptop|sleutel",
      },
      {
        id: "telefoon",
        label: "Telefoonnummer",
        kind: "phone",
        answer: "0644455566",
      },
      {
        id: "email",
        label: "E-mailadres",
        kind: "email",
        answer: "linh.tran@mail.com",
      },
    ],
  },
];
