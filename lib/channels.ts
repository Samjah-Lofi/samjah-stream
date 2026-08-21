import { Channel } from "../types/channel";

export const channels: Channel[] = [
  {
    id: 1,
    slug: "coffee-morning",

    title: "Coffee Morning",

    description:
      "Warmer Café-Sound für einen entspannten Start in den Tag.",

    longDescription:
      "Coffee Morning vereint entspannte LoFi-Beats mit sanften Piano-, Rhodes- und Vinyl-Texturen. Perfekt für Cafés, Frühstückslocations und ruhige Arbeitsumgebungen.",

    image: "/covers/coffee-morning.png",

    streamUrl: "/audio/coffee-morning.mp3",

    duration: "28 min",
    tracks: 10,

    featured: true,

    perfectFor: [
      "Cafés",
      "Bäckereien",
      "Coworking",
      "Frühstück",
    ],

    tags: [
      "Coffee",
      "Morning",
      "LoFi",
      "Relax",
      "Calm",
    ],
  },

  {
    id: 2,
    slug: "lunch-lounge",

    title: "Lunch Lounge",

    description:
      "Sanfte Klänge für stilvolle Mittagspausen und entspannte Gespräche.",

    longDescription:
      "Lunch Lounge sorgt mit modernen Lounge- und LoFi-Elementen für eine angenehme Atmosphäre während der Mittagszeit.",

    image: "/covers/lunch-lounge.png",

    streamUrl: "/audio/lunch-lounge.mp3",

    duration: "31 min",
    tracks: 11,

    featured: true,

    perfectFor: [
      "Restaurants",
      "Bistros",
      "Hotels",
    ],

    tags: [
      "Lunch",
      "Lounge",
      "Restaurant",
      "Daytime",
    ],
  },

  {
    id: 3,
    slug: "afro-lounge",

    title: "Afro Lounge",

    description:
      "Warme Afro-Grooves mit entspannter Lounge-Atmosphäre.",

    longDescription:
      "Afro Lounge kombiniert organische Percussion, warme Gitarren und entspannte LoFi-Vibes zu einer sommerlichen Atmosphäre.",

    image: "/covers/afro-lounge.png",

    streamUrl: "/audio/afro-lounge.mp3",

    duration: "34 min",
    tracks: 12,

    featured: true,

    perfectFor: [
      "Beach Bars",
      "Lounges",
      "Hotels",
      "Terrassen",
    ],

    tags: [
      "Afro",
      "Summer",
      "Sunset",
      "Lounge",
    ],
  },

  {
    id: 4,
    slug: "sunset-lounge",

    title: "Sunset Lounge",

    description:
      "Goldene Abendstimmung für Rooftops, Bars und Terrassen.",

    longDescription:
      "Sanfte Gitarren, warme Keys und entspannte Grooves begleiten den Sonnenuntergang und schaffen eine stilvolle Atmosphäre.",

    image: "/covers/sunset-lounge.png",

    streamUrl: "/audio/sunset-lounge.mp3",

    duration: "30 min",
    tracks: 11,

    featured: true,

    perfectFor: [
      "Rooftops",
      "Cocktailbars",
      "Restaurants",
    ],

    tags: [
      "Sunset",
      "Golden Hour",
      "Chill",
    ],
  },

  {
    id: 5,
    slug: "late-night",

    title: "Late Night",

    description:
      "Elegante Klänge für lange Abende, Lounges und Hotelbars.",

    longDescription:
      "Late Night liefert entspannte Jazz- und LoFi-Einflüsse für hochwertige Abendstimmung in Bars, Lounges und Hotels.",

    image: "/covers/late-night.png",

    streamUrl: "/audio/late-night.mp3",

    duration: "33 min",
    tracks: 12,

    featured: false,

    perfectFor: [
      "Hotelbars",
      "Lounges",
      "Whiskey Bars",
    ],

    tags: [
      "Night",
      "Jazz",
      "Luxury",
    ],
  },

  {
    id: 6,
    slug: "rainy-day",

    title: "Rainy Day",

    description:
      "Ruhige Musik für Regentage, Bücher und eine heiße Tasse Kaffee.",

    longDescription:
      "Rainy Day verbindet ruhige LoFi-Elemente mit Vinyl-Rauschen und sanften Klavierklängen für gemütliche Regentage.",

    image: "/covers/rainy-day.png",

    streamUrl: "/audio/rainy-day.mp3",

    duration: "29 min",
    tracks: 10,

    featured: false,

    perfectFor: [
      "Cafés",
      "Bibliotheken",
      "Home Office",
    ],

    tags: [
      "Rain",
      "Cozy",
      "Relax",
    ],
  },
];