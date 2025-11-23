export interface LocalArea {
  slug: string;
  name: string;
  displayName: string;
  intro: string;
  highlights: string[];
  miniCase: {
    area: string;
    team: string;
    hours: string;
    damages: string;
    description: string;
  };
  priceExample: {
    title: string;
    size: string;
    price: string;
    details: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  nearby: Array<{
    name: string;
    slug: string;
  }>;
}

export const localAreas: Record<string, LocalArea> = {
  "alvsjo": {
    slug: "alvsjo",
    name: "Älvsjö",
    displayName: "Älvsjö",
    intro: "Behöver du hjälp med flytt i Älvsjö? Flyttbas är ditt lokala flyttföretag med lång erfarenhet av att hjälpa privatpersoner och företag i området. Vi känner till Älvsjös gator, parkeringsmöjligheter och vilka bostadsområden som kräver extra omsorg.",
    highlights: [
      "Lokalkännedom i Älvsjö och omnejd",
      "Snabb respons – ofta samma dag",
      "RUT-avdrag 50% på arbetskostnad",
      "Försäkrade och erfarna flyttare"
    ],
    miniCase: {
      area: "65 m²",
      team: "2 flyttare",
      hours: "4 timmar",
      damages: "0 skador",
      description: "Lägenhetsflytt från Älvsjö centrum till Stuvsta. Inklusive packning av känsliga föremål och montering av möbler."
    },
    priceExample: {
      title: "Prisexempel för lägenhet i Älvsjö",
      size: "2:a på 60 m²",
      price: "3 980 kr",
      details: "Pris efter RUT-avdrag. Inklusive 2 flyttare, lastbil och grundläggande packmaterial."
    },
    faq: [
      {
        question: "Hur snabbt kan ni komma till Älvsjö?",
        answer: "Vi har regelbundet uppdrag i Älvsjö och kan ofta hjälpa till redan samma vecka. Kontakta oss för aktuell tillgänglighet."
      },
      {
        question: "Vilka bostadsområden i Älvsjö täcker ni?",
        answer: "Vi täcker hela Älvsjö inklusive Älvsjö centrum, Herrängen, Örby slott och angränsande områden."
      },
      {
        question: "Finns det parkeringsmöjligheter för flyttbilen?",
        answer: "Ja, de flesta områden i Älvsjö har bra parkeringsmöjligheter. Vi hjälper till att ordna flyttillstånd om det behövs."
      },
      {
        question: "Vad ingår i priset för flytt i Älvsjö?",
        answer: "I priset ingår erfarna flyttare, lastbil med utrustning, grundläggande packmaterial, försäkring och RUT-avdrag på arbetskostnaden."
      }
    ],
    nearby: [
      { name: "Årsta", slug: "arsta" },
      { name: "Bandhagen", slug: "bandhagen" },
      { name: "Enskede", slug: "enskede" },
      { name: "Hägersten", slug: "hagersten" }
    ]
  },
  "arsta": {
    slug: "arsta",
    name: "Årsta",
    displayName: "Årsta",
    intro: "Flyttbas är ditt pålitliga flyttföretag i Årsta. Vi har hjälpt hundratals hushåll och företag i området med professionella flyttjänster. Med vår lokalkännedom och erfarenhet garanterar vi en smidig flytt till fast pris.",
    highlights: [
      "Specialiserade på Årsta och Söderort",
      "Transparenta priser med RUT-avdrag",
      "Fullständig försäkring enligt Bohag 2010",
      "Flexibla tider även kvällar och helger"
    ],
    miniCase: {
      area: "78 m²",
      team: "3 flyttare",
      hours: "5 timmar",
      damages: "0 skador",
      description: "Villaflytt i Årsta med packning av vardagsrum och tunga möbler. Professionell hantering av antika möbler."
    },
    priceExample: {
      title: "Prisexempel för boende i Årsta",
      size: "3:a på 75 m²",
      price: "8 060 kr",
      details: "Efter RUT-avdrag. Inkluderar 3 flyttare, lastbil, packmaterial och montering."
    },
    faq: [
      {
        question: "Täcker ni hela Årsta?",
        answer: "Ja, vi täcker hela Årsta inklusive Årsta centrum, Årsta havsbad, Årstadal och Årstaberg."
      },
      {
        question: "Kan ni hjälpa till med packning?",
        answer: "Absolut! Vi erbjuder professionell packhjälp till 695 kr/h (347,50 kr efter RUT). Vi packar allt från porslin till tavlor."
      },
      {
        question: "Hur lång tid tar en flytt i Årsta?",
        answer: "Det beror på storleken på bostaden och hur mycket som ska flyttas. En vanlig 2:a tar ca 4-5 timmar, en 3:a 6-7 timmar."
      },
      {
        question: "Vad händer om något går sönder?",
        answer: "Vi har full ansvarsförsäkring som täcker eventuella skador. Vi följer Bohag 2010 och dokumenterar noggrant."
      }
    ],
    nearby: [
      { name: "Älvsjö", slug: "alvsjo" },
      { name: "Johanneshov", slug: "johanneshov" },
      { name: "Enskede", slug: "enskede" },
      { name: "Hammarbyhöjden", slug: "hammarbyhojen" }
    ]
  },
  "ostermalm": {
    slug: "ostermalm",
    name: "Östermalm",
    displayName: "Östermalm",
    intro: "Professionell flytthjälp på Östermalm med specialistkunskap om områdets exklusiva fastigheter och historiska byggnader. Flyttbas erbjuder diskret och omsorgsfull service anpassad för Östermalms unika förutsättningar.",
    highlights: [
      "Erfarenhet av altanvåningar och höga tak",
      "Diskret service i exklusiva miljöer",
      "Specialutrustning för antika möbler",
      "Trappservice utan hiss – ingen extra kostnad"
    ],
    miniCase: {
      area: "95 m²",
      team: "3 flyttare",
      hours: "6 timmar",
      damages: "0 skador",
      description: "Altanvåning vid Stureplan med kristallkronor och antika möbler. Extra skyddsmaterial och omsorgsfull hantering."
    },
    priceExample: {
      title: "Prisexempel för lägenhet på Östermalm",
      size: "3:a på 85 m²",
      price: "9 540 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 3 flyttare, extra skyddsmaterial och specialhantering."
    },
    faq: [
      {
        question: "Hur hanterar ni värdefulla möbler och konst?",
        answer: "Vi använder specialmaterial som möbelfilt, skyddande bubbelplast och emballage. Alla känsliga föremål hanteras med extra försiktighet och dokumenteras."
      },
      {
        question: "Kan ni hjälpa med flytt i fastigheter utan hiss?",
        answer: "Ja, vårt team är tränat för trappflytt och vi tar inte ut extra avgift för våningar utan hiss på Östermalm."
      },
      {
        question: "Finns parkeringstillstånd på Östermalm?",
        answer: "Vi ordnar alltid flyttillstånd i förväg för att säkerställa att flyttbilen kan parkera nära entrén."
      },
      {
        question: "Hur lång tid tar en flytt på Östermalm?",
        answer: "En 3:a tar typiskt 6-7 timmar inklusive packning. Tid kan variera beroende på våning och hur mycket som ska flyttas."
      }
    ],
    nearby: [
      { name: "Vasastan", slug: "vasastan" },
      { name: "Gärdet", slug: "gardet" },
      { name: "Hjorthagen", slug: "hjorthagen" },
      { name: "Kungsholmen", slug: "kungsholmen" }
    ]
  },
  "sodermalm": {
    slug: "sodermalm",
    name: "Södermalm",
    displayName: "Södermalm",
    intro: "Flyttbas är ditt lokala val för flytt på Södermalm. Med omfattande erfarenhet av områdets smala trappor, kullersten och unika arkitektur, ser vi till att din flytt går smidigt oavsett förutsättningar.",
    highlights: [
      "Expertis på Södermalms äldre fastigheter",
      "Vana vid smala trapphus och trånga utrymmen",
      "Snabb respons för SoFo, Nytorget och Hornstull",
      "Specialutrustning för trappflytt"
    ],
    miniCase: {
      area: "58 m²",
      team: "2 flyttare",
      hours: "5 timmar",
      damages: "0 skador",
      description: "Flytt på Södermalm från 4:e våning utan hiss till nybygge vid Hammarby Sjöstad. Smala trapphus krävde extra planering."
    },
    priceExample: {
      title: "Prisexempel för lägenhet på Södermalm",
      size: "2:a på 55 m²",
      price: "4 475 kr",
      details: "Pris efter RUT-avdrag. Inklusive 2 flyttare, lastbil och trappservice."
    },
    faq: [
      {
        question: "Hur hanterar ni smala trapphus på Södermalm?",
        answer: "Våra flyttare har stor erfarenhet av Södermalms äldre fastigheter. Vi använder specialtekniker och skyddsmaterial för att navigera trånga utrymmen säkert."
      },
      {
        question: "Kostar det extra att flytta från våning utan hiss?",
        answer: "Nej, trappservice ingår alltid i vårt pris. Vi tar inte ut extra avgifter för våningar utan hiss."
      },
      {
        question: "Vilka områden på Södermalm täcker ni?",
        answer: "Vi täcker hela Södermalm inklusive SoFo, Nytorget, Hornstull, Zinkensdamm, Mariatorget och Medborgarplatsen."
      },
      {
        question: "Kan ni parkera på Södermalms smala gator?",
        answer: "Vi ordnar alltid flyttillstånd och planerar logistiken i förväg för att minimera bärvägar och tid."
      }
    ],
    nearby: [
      { name: "Hammarby Sjöstad", slug: "hammarby-sjostad" },
      { name: "Johanneshov", slug: "johanneshov" },
      { name: "Årsta", slug: "arsta" },
      { name: "Hägersten", slug: "hagersten" }
    ]
  },
  "vasastan": {
    slug: "vasastan",
    name: "Vasastan",
    displayName: "Vasastan",
    intro: "Professionella flyttjänster i Vasastan med stor erfarenhet av områdets stadsdelsmiljö. Vi känner till alla smarta körvägar, parkeringsmöjligheter och lokala förutsättningar för en effektiv flytt.",
    highlights: [
      "Lokalkännedom runt Odenplan och S:t Eriksplan",
      "Vana vid äldre funkisfastigheter",
      "Flexibla tider för centrala Stockholm",
      "Fullservice från packning till städning"
    ],
    miniCase: {
      area: "72 m²",
      team: "2 flyttare",
      hours: "5 timmar",
      damages: "0 skador",
      description: "Lägenhetsflytt i funkisbyggnad vid Rörstrandsgatan. Professionell packning av kök och vardagsrum."
    },
    priceExample: {
      title: "Prisexempel för lägenhet i Vasastan",
      size: "3:a på 70 m²",
      price: "6 475 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare, lastbil och grundmaterial."
    },
    faq: [
      {
        question: "Hur fungerar parkering i centrala Vasastan?",
        answer: "Vi ordnar flyttillstånd i god tid och känner till alla smarta körvägar. Våra flyttare är vana vid centrala Stockholm."
      },
      {
        question: "Täcker ni hela Vasastan?",
        answer: "Ja, vi täcker hela Vasastan från Odenplan till S:t Eriksplan, inklusive Observatorielunden och Karlbergskanalen."
      },
      {
        question: "Kan ni hjälpa med funkisbyggnaders speciella krav?",
        answer: "Absolut! Vi har stor erfarenhet av Vasastans funkisfastigheter och vet hur man hanterar höga tak och stora fönsterpartier."
      },
      {
        question: "Erbjuder ni flyttstädning i Vasastan?",
        answer: "Ja, vi samarbetar med professionella städfirmor och kan ordna RUT-godkänd flyttstädning."
      }
    ],
    nearby: [
      { name: "Östermalm", slug: "ostermalm" },
      { name: "Kungsholmen", slug: "kungsholmen" },
      { name: "Solna", slug: "solna" },
      { name: "Hagastaden", slug: "hagastaden" }
    ]
  },
  "kungsholmen": {
    slug: "kungsholmen",
    name: "Kungsholmen",
    displayName: "Kungsholmen",
    intro: "Flyttbas erbjuder pålitlig flytthjälp på Kungsholmen. Med god kännedom om ön och dess särskilda förutsättningar garanterar vi en effektiv flytt till fast pris med RUT-avdrag.",
    highlights: [
      "Lokalkännedom från Fridhemsplan till Stadshagen",
      "Erfarenhet av moderna och äldre fastigheter",
      "Snabb respons – ofta inom 24 timmar",
      "Fullständig försäkring och trygg hantering"
    ],
    miniCase: {
      area: "68 m²",
      team: "2 flyttare",
      hours: "4 timmar",
      damages: "0 skador",
      description: "Flytt från Kungsholmen till Bromma. Inklusive demontering och montering av köksstomme."
    },
    priceExample: {
      title: "Prisexempel för lägenhet på Kungsholmen",
      size: "2:a på 65 m²",
      price: "4 475 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare och lastbil."
    },
    faq: [
      {
        question: "Vilka områden på Kungsholmen täcker ni?",
        answer: "Vi täcker hela Kungsholmen inklusive Fridhemsplan, Stadshagen, Kristineberg, Marieberg och Fredhäll."
      },
      {
        question: "Hur snabbt kan ni komma?",
        answer: "Vi har ofta tillgänglighet inom 24-48 timmar på Kungsholmen. Kontakta oss för exakt tid."
      },
      {
        question: "Ingår montering av möbler?",
        answer: "Ja, grundläggande montering och demontering ingår alltid i priset."
      },
      {
        question: "Kan ni hjälpa med magasinering?",
        answer: "Ja, vi erbjuder magasinering från 995 kr/månad i samarbete med säkra magasin."
      }
    ],
    nearby: [
      { name: "Vasastan", slug: "vasastan" },
      { name: "Solna", slug: "solna" },
      { name: "Bromma", slug: "bromma" },
      { name: "Östermalm", slug: "ostermalm" }
    ]
  },
  "enskede": {
    slug: "enskede",
    name: "Enskede",
    displayName: "Enskede",
    intro: "Behöver du hjälp med flytt i Enskede? Flyttbas är ditt lokala flyttbolag med gedigen erfarenhet av området. Vi hjälper både privatpersoner i villaområden och lägenhetsflytt i Enskede-Årsta.",
    highlights: [
      "Specialist på villaflytt i Enskede",
      "Lokalkännedom i Enskede-Årsta-Vantör",
      "Professionell utrustning för stora flytt",
      "RUT-avdrag 50% direkt vid betalning"
    ],
    miniCase: {
      area: "125 m²",
      team: "3 flyttare",
      hours: "8 timmar",
      damages: "0 skador",
      description: "Villaflytt i Enskede från 2-plans villa till radhus. Inklusive packning av källare och vind."
    },
    priceExample: {
      title: "Prisexempel för villa i Enskede",
      size: "Villa 120 m²",
      price: "10 120 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 3 flyttare, lastbil och packmaterial."
    },
    faq: [
      {
        question: "Har ni erfarenhet av villaflytt i Enskede?",
        answer: "Ja, vi har lång erfarenhet av villaflytt i Enskede-Årsta och känner till områdets förutsättningar väl."
      },
      {
        question: "Ingår packning av källare och vind?",
        answer: "Packning kan tillkomma som tilläggstjänst för 695 kr/h (347,50 kr efter RUT). Vi hjälper gärna till med källare och vindar."
      },
      {
        question: "Hur lång tid tar en villaflytt?",
        answer: "En typisk villa på 120 m² tar 7-9 timmar beroende på hur mycket som ska flyttas och antal våningar."
      },
      {
        question: "Kan ni hjälpa med tunga möbler?",
        answer: "Absolut! Vi har specialutrustning och erfarenhet av tunga lyft som pianon, kassaskåp och stora skåp."
      }
    ],
    nearby: [
      { name: "Älvsjö", slug: "alvsjo" },
      { name: "Årsta", slug: "arsta" },
      { name: "Bandhagen", slug: "bandhagen" },
      { name: "Johanneshov", slug: "johanneshov" }
    ]
  },
  "bandhagen": {
    slug: "bandhagen",
    name: "Bandhagen",
    displayName: "Bandhagen",
    intro: "Flyttbas erbjuder professionell flytthjälp i Bandhagen med fokus på trygghet och transparenta priser. Vi känner till området väl och ser till att din flytt blir så smidig som möjligt.",
    highlights: [
      "Lokalkännedom i Bandhagen och Söderort",
      "Flexibla tider anpassade efter dina behov",
      "Erfarna flyttare med fullständig försäkring",
      "Transparenta priser med RUT-avdrag"
    ],
    miniCase: {
      area: "62 m²",
      team: "2 flyttare",
      hours: "4 timmar",
      damages: "0 skador",
      description: "Lägenhetsflytt i Bandhagen från 3:e våning till markplan. Smidig flytt med god planering."
    },
    priceExample: {
      title: "Prisexempel för lägenhet i Bandhagen",
      size: "2:a på 60 m²",
      price: "3 980 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare och lastbil."
    },
    faq: [
      {
        question: "Täcker ni hela Bandhagen?",
        answer: "Ja, vi täcker hela Bandhagen inklusive Bandhagens centrum och alla bostadsområden."
      },
      {
        question: "Hur snabbt kan ni hjälpa till?",
        answer: "Vi har ofta tillgänglighet samma vecka i Bandhagen. Kontakta oss för aktuell tid."
      },
      {
        question: "Vad ingår i grundpriset?",
        answer: "I priset ingår flyttare, lastbil, grundläggande packmaterial, försäkring och RUT-avdrag."
      },
      {
        question: "Kan ni hjälpa med packning?",
        answer: "Ja, vi erbjuder packhjälp som tilläggstjänst för 695 kr/h (347,50 kr efter RUT)."
      }
    ],
    nearby: [
      { name: "Högdalen", slug: "hogdalen" },
      { name: "Enskede", slug: "enskede" },
      { name: "Stureby", slug: "stureby" },
      { name: "Älvsjö", slug: "alvsjo" }
    ]
  },
  "hagersten": {
    slug: "hagersten",
    name: "Hägersten",
    displayName: "Hägersten",
    intro: "Professionell flytthjälp i Hägersten med lokal närvaro och gedigen erfarenhet. Flyttbas erbjuder trygg och effektiv service till fast pris med RUT-avdrag.",
    highlights: [
      "Specialister på Hägersten-Liljeholmen",
      "Snabb respons och flexibla tider",
      "Fullständig försäkring enligt Bohag 2010",
      "Erfarenhet av både lägenhet och villa"
    ],
    miniCase: {
      area: "70 m²",
      team: "2 flyttare",
      hours: "5 timmar",
      damages: "0 skador",
      description: "Flytt från Hägersten till Liljeholmen. Professionell hantering av stora möbler."
    },
    priceExample: {
      title: "Prisexempel för boende i Hägersten",
      size: "3:a på 70 m²",
      price: "5 475 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare och lastbil."
    },
    faq: [
      {
        question: "Vilka delar av Hägersten täcker ni?",
        answer: "Vi täcker hela Hägersten inklusive Västertorp, Västberga, Midsommarkransen och Hägerstensåsen."
      },
      {
        question: "Hur fungerar RUT-avdraget?",
        answer: "RUT-avdraget på 50% dras automatiskt av från arbetskostnaden. Du betalar bara det reducerade priset."
      },
      {
        question: "Ingår försäkring?",
        answer: "Ja, vi har fullständig ansvarsförsäkring som täcker eventuella skador under flytten."
      },
      {
        question: "Kan ni hjälpa samma vecka?",
        answer: "Vi har ofta tillgänglighet inom några dagar i Hägersten. Kontakta oss för aktuell tid."
      }
    ],
    nearby: [
      { name: "Liljeholmen", slug: "liljeholmen" },
      { name: "Älvsjö", slug: "alvsjo" },
      { name: "Aspudden", slug: "aspudden" },
      { name: "Södermalm", slug: "sodermalm" }
    ]
  },
  // Add more areas...
  "johanneshov": {
    slug: "johanneshov",
    name: "Johanneshov",
    displayName: "Johanneshov",
    intro: "Flyttbas är ditt lokala flyttföretag i Johanneshov med mångårig erfarenhet av området. Vi erbjuder professionell flytthjälp till fast pris med RUT-avdrag.",
    highlights: [
      "Lokalkännedom i Johanneshov och Globenområdet",
      "Snabb service – ofta samma dag",
      "Transparenta priser utan dolda kostnader",
      "Fullständig försäkring och trygghet"
    ],
    miniCase: {
      area: "55 m²",
      team: "2 flyttare",
      hours: "4 timmar",
      damages: "0 skador",
      description: "Lägenhetsflytt i Johanneshov med packning och montering. Smidig och snabb flytt."
    },
    priceExample: {
      title: "Prisexempel för lägenhet i Johanneshov",
      size: "2:a på 55 m²",
      price: "3 480 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare och lastbil."
    },
    faq: [
      {
        question: "Täcker ni Globenområdet?",
        answer: "Ja, vi täcker hela Johanneshov inklusive Globenområdet, Gullmarsplan och Johannelund."
      },
      {
        question: "Hur snabbt kan ni komma?",
        answer: "Vi har ofta tillgänglighet redan samma dag eller nästa dag i Johanneshov."
      },
      {
        question: "Vad ingår i priset?",
        answer: "I priset ingår flyttare, lastbil, grundmaterial, försäkring och RUT-avdrag."
      },
      {
        question: "Kan ni hjälpa med montering?",
        answer: "Ja, grundläggande montering och demontering ingår alltid."
      }
    ],
    nearby: [
      { name: "Södermalm", slug: "sodermalm" },
      { name: "Årsta", slug: "arsta" },
      { name: "Enskede", slug: "enskede" },
      { name: "Hammarby Sjöstad", slug: "hammarby-sjostad" }
    ]
  },
  "hammarby-sjostad": {
    slug: "hammarby-sjostad",
    name: "Hammarby Sjöstad",
    displayName: "Hammarby Sjöstad",
    intro: "Professionell flytthjälp i Hammarby Sjöstad med erfarenhet av områdets moderna arkitektur och miljökrav. Flyttbas erbjuder effektiv service anpassad för Sjöstaden.",
    highlights: [
      "Erfarenhet av Sjöstadens miljökrav",
      "Vana vid moderna fastigheter och parker",
      "Specialutrustning för långa bärvägar",
      "Flexibla tider för ditt schema"
    ],
    miniCase: {
      area: "75 m²",
      team: "2 flyttare",
      hours: "5 timmar",
      damages: "0 skador",
      description: "Flytt i modern lägenhet vid Sickla kanal. Professionell packning av designmöbler."
    },
    priceExample: {
      title: "Prisexempel för lägenhet i Hammarby Sjöstad",
      size: "3:a på 75 m²",
      price: "5 475 kr",
      details: "Pris efter RUT-avdrag. Inkluderar 2 flyttare och lastbil."
    },
    faq: [
      {
        question: "Kan ni navigera Sjöstadens parkeringsregler?",
        answer: "Ja, vi känner väl till området och ordnar alltid flyttillstånd i god tid."
      },
      {
        question: "Hur hanterar ni långa bärvägar?",
        answer: "Vi har specialutrustning och planerar alltid för att minimera bärvägar och tid."
      },
      {
        question: "Täcker ni hela Hammarby Sjöstad?",
        answer: "Ja, vi täcker hela området från Sickla kanal till Lugnetgatan."
      },
      {
        question: "Erbjuder ni miljövänlig flytt?",
        answer: "Vi arbetar miljömedvetet och återvinner packmaterial där det är möjligt."
      }
    ],
    nearby: [
      { name: "Södermalm", slug: "sodermalm" },
      { name: "Johanneshov", slug: "johanneshov" },
      { name: "Nacka", slug: "nacka" },
      { name: "Enskede", slug: "enskede" }
    ]
  }
};

// Helper function to get area by slug
export const getAreaBySlug = (slug: string): LocalArea | undefined => {
  return localAreas[slug];
};

// Get all area slugs for routing
export const getAllAreaSlugs = (): string[] => {
  return Object.keys(localAreas);
};