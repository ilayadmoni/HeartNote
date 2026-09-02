import type { Template } from "../types";

export const BASE_TEMPLATES_B: Template[] = [
  {
    id: "slot-machine",
    nameKey: "templates.slotMachine.name",
    descriptionKey: "templates.slotMachine.description",
    category: "fun",
    isFree: true,
    componentKey: "SlotMachine",
    link: "/create/slot-machine",
  },
  {
    id: "punching-bag",
    nameKey: "templates.punchingBag.name",
    descriptionKey: "templates.punchingBag.description",
    category: "fun",
    isFree: true,
    componentKey: "PunchingBag",
    link: "/create/punching-bag",
  },
  {
    id: "apology-search",
    nameKey: "templates.apologySearch.name",
    descriptionKey: "templates.apologySearch.description",
    category: "romantic",
    isFree: true,
    componentKey: "ApologySearch",
    link: "/create/apology-search",
  },
  {
    id: "excuse-generator",
    nameKey: "templates.excuseGenerator.name",
    descriptionKey: "templates.excuseGenerator.description",
    category: "fun",
    isFree: true,
    componentKey: "ExcuseGenerator",
    link: "/create/excuse-generator",
  },
  {
    id: "bar-bat-mitzvah",
    nameKey: "templates.barBatMitzvah.name",
    descriptionKey: "templates.barBatMitzvah.description",
    category: "mitzvah",
    isPremium: true,
    componentKey: "BarBatMitzvah",
    link: "/create/bar-bat-mitzvah",
  },
];
