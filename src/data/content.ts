// All site copy lives here so it can be edited without touching layout code.

export const profile = {
  name: "Mohammed Sabith",
  firstName: "Mohammed",
  lastName: "Sabith",
  role: "Structural Design Engineer",
  location: "Doha, Qatar",
  timeZone: "Asia/Qatar",
  email: "sabithismail6679@gmail.com",
  phone: "+974 5037 1817",
  phoneHref: "tel:+97450371817",
  whatsapp: "https://wa.me/97450371817",
  linkedin: "https://www.linkedin.com/in/sabithismail/",
  cv: "/Mohammed-Sabith-CV.pdf",
  availability: "Open to new roles",
  heroLine:
    "Reinforced concrete and structural steel buildings, from villas to high-rise and industrial halls. Designed to code, checked by hand, automated where it counts.",
  statement:
    "I design reinforced concrete and steel buildings in Doha, from villas to a 2B+G+12 commercial building and 90 m industrial halls. I work in ETABS, SAFE and STAAD.Pro to ACI 318, ASCE 7, AISC and QCS, check the critical elements by hand, and write Python tools that take the repetitive work out of design.",
  facts: [
    { label: "Based in", value: "Doha, Qatar\nValid QID (transferable)\nQatar driving licence" },
    { label: "Registration", value: "UPDA / MMUP engineer registration in progress\nWorking towards IStructE and ICE membership" },
    { label: "Languages", value: "English (professional)\nMalayalam (native)\nHindi (fluent)\nArabic (basic)" },
  ],
};

export const stats = [
  { value: "50+", label: "Villa design packages" },
  { value: "10", label: "Commercial buildings" },
  { value: "90×47", unit: "m", label: "Steel factory, clear-span portals" },
  { value: "15", unit: "m", label: "Post-tensioned slab spans" },
];

export type Project = {
  slug: string;
  title: string;
  /** Shown on the work panel; leave out for buildings. Use "Plugin" for software tools. */
  kind?: "Building" | "Plugin";
  summary: string;
  sector: string;
  system: string;
  software: string[];
  /** Photo or render. Leave out for plugins and give `code` instead. */
  hero?: string;
  /** Which part of the hero stays in view when it is cropped; screenshots keep their top (title bar, dialogs). */
  heroFocus?: "top";
  /** Big headline number on the phone work panel, shown when there is spare height. */
  figure?: { value: string; caption: string };
  /** Simplified code excerpt drawn as the visual when there is no photo. */
  code?: CodeLine[];
  sections: { title: string; text: string; images: string[] }[];
};

/** [tone, text]: "c" comment, "k" code, "s" result line. */
export type CodeLine = ["c" | "k" | "s" | "", string];

/** Labels for the third and fourth spec rows (buildings vs plugins). */
export const specLabels = (p: Project) =>
  p.kind === "Plugin" ? { sector: "Used by", system: "Impact" } : { sector: "Sector", system: "System" };

export const projects: Project[] = [
  {
    slug: "commercial-building",
    figure: { value: "2B+G+7", caption: "Two basements, ground and seven floors" },
    title: "Commercial Building",
    summary:
      "Structural design of a 2B+G+7 commercial building, covering the full analysis of the superstructure and foundation systems.",
    sector: "Commercial real estate",
    system: "RC frame with shear walls",
    software: ["ETABS", "SAFE", "SAP2000", "AutoCAD", "Revit"],
    hero: "/images/projects/buildings_hero.webp",
    sections: [
      {
        title: "Superstructure analysis",
        text: "The superstructure was modelled and analysed in ETABS, with dynamic analysis for seismic and wind loads and particular attention to shear wall placement.",
        images: ["/images/projects/buildings_analysis_1.webp", "/images/projects/buildings_analysis_2.webp"],
      },
      {
        title: "Slab design",
        text: "Slabs were designed for gravity and lateral load distribution, with the reinforcement layout optimised to control deflection.",
        images: ["/images/projects/buildings_slab.webp"],
      },
      {
        title: "Foundation system",
        text: "The two basement levels needed a raft foundation designed in SAFE for the vertical loads and the lateral earth pressure on the basement walls.",
        images: ["/images/projects/buildings_foundation.webp"],
      },
    ],
  },
  {
    slug: "industrial-warehouse",
    figure: { value: "Long-span", caption: "Steel portal frames with IDEA StatiCa connections" },
    title: "Industrial Warehouse",
    summary:
      "Structural design and optimisation of a large industrial warehouse with long-span steel members and heavy-duty flooring.",
    sector: "Logistics & warehousing",
    system: "Structural steel portal frames",
    software: ["STAAD.Pro", "IDEA StatiCa", "PROKON", "AutoCAD"],
    hero: "/images/projects/warehouse_hero.webp",
    sections: [
      {
        title: "Frame analysis",
        text: "The frame was modelled in STAAD.Pro for heavy industrial loads and wind pressure, with long-span members optimised for material efficiency and stability.",
        images: ["/images/projects/warehouse_analysis_1.webp", "/images/projects/warehouse_analysis_2.webp"],
      },
      {
        title: "Connection design",
        text: "Connections and base plates were designed in IDEA StatiCa for reliable load transfer through the steel frame.",
        images: ["/images/projects/warehouse_slab_1.webp", "/images/projects/warehouse_slab_2.webp"],
      },
      {
        title: "Foundations",
        text: "Isolated and combined footings were designed in PROKON from the soil bearing capacity and the column reactions of the steel frame.",
        images: ["/images/projects/warehouse_foundation.webp"],
      },
    ],
  },
  {
    slug: "structural-retrofit",
    figure: { value: "G+11", caption: "Failing slabs and columns strengthened" },
    title: "G+11 Structural Retrofit",
    summary:
      "Assessment and strengthening of a G+11 residential tower with failing slabs and columns.",
    sector: "Residential",
    system: "CFRP, jacketing & steel beams",
    software: ["ETABS", "SAFE", "AutoCAD"],
    hero: "/images/slab retrofitting.webp",
    sections: [
      {
        title: "Assessment model",
        text: "The existing structure was modelled in ETABS to find the critical elements, then the retrofit schemes were analysed to confirm the improved performance.",
        images: ["/images/projects/retrofitting_analysis_1.webp", "/images/projects/retrofitting_analysis_2.webp"],
      },
      {
        title: "Slab strengthening",
        text: "Existing slabs were strengthened with slab jacketing and carbon fibre reinforced polymer (CFRP) to raise their load-carrying capacity.",
        images: ["/images/projects/retrofitting_slab.webp"],
      },
      {
        title: "Column jacketing",
        text: "Concrete jacketing increased the axial and shear capacity of the existing columns for the upgraded design loads.",
        images: ["/images/projects/retrofitting_foundation.webp"],
      },
    ],
  },
  {
    slug: "residential-villas",
    figure: { value: "50+", caption: "Villa design packages, PT slabs up to 15 m" },
    title: "Residential Villas",
    summary:
      "Structural design of more than 50 villas, including post-tensioned slabs, large cantilevers and raft foundations.",
    sector: "Residential",
    system: "RC frame, PT slabs",
    software: ["SAFE", "ETABS", "PROKON", "AutoCAD", "Revit"],
    hero: "/images/projects/residential_hero.webp",
    sections: [
      {
        title: "Analysis model",
        text: "Complex villa geometry with large cantilevers needed careful finite element analysis for deflection control and safety.",
        images: ["/images/model.webp"],
      },
      {
        title: "Post-tensioned slabs",
        text: "Post-tensioned slabs gave the long spans and thin profiles the architecture asked for, with spans up to 15 m.",
        images: ["/images/slab.webp"],
      },
      {
        title: "Foundations",
        text: "A combined raft foundation took the varying column loads and kept settlement even across the site.",
        images: ["/images/piles.webp"],
      },
    ],
  },
  {
    slug: "etabs-safe-footing-plugin",
    figure: { value: "2–3 h", caption: "Saved on every project" },
    title: "ETABS → SAFE Footing Plugin",
    kind: "Plugin",
    summary:
      "A Python plugin on the CSI API that pulls column reactions from the ETABS model, calculates the load resultant centre and places combined footings in SAFE from shapes drawn in AutoCAD.",
    sector: "5 engineers in the office",
    system: "Saves 2–3 hours per project",
    software: ["Python", "CSI API", "ETABS", "SAFE", "AutoCAD"],
    hero: "/images/plugins/safe-result.webp",
    heroFocus: "top",
    sections: [
      {
        title: "The problem",
        text: "Modelling combined footings in SAFE by hand meant copying column reactions out of ETABS, working out where the load resultant falls and redrawing each footing around it, on every project.",
        images: [],
      },
      {
        title: "How it works",
        text: "Draw the footing outline in AutoCAD, export it as a DXF and point the plugin at the layer. It reads the reactions straight from the model, finds the load resultant centre and imports the shape into SAFE exactly where it needs to be.",
        images: ["/images/plugins/footing-dialog-full.webp"],
      },
      {
        title: "Result",
        text: "The footings appear in SAFE ready for analysis, and the difference between the geometric centre and the resultant centre shows on screen. It saves 2–3 hours per project and is used by five engineers in the office.",
        images: ["/images/plugins/safe-result-full.webp"],
      },
    ],
  },
  {
    slug: "autocad-column-detailer",
    figure: { value: "Seconds", caption: "Instead of about 1.5 h of drafting" },
    title: "AutoCAD Column Detailer",
    kind: "Plugin",
    summary:
      "A Python tool that identifies columns and walls from code formulas, tags them to the grid and compiles a formatted column details schedule in AutoCAD in seconds.",
    sector: "5 engineers in the office",
    system: "≈1.5 h of drafting → seconds",
    software: ["Python", "AutoCAD"],
    hero: "/images/plugins/detailer.webp",
    heroFocus: "top",
    sections: [
      {
        title: "The problem",
        text: "Detailing columns and building schedules by hand for every building took about an hour and a half of repetitive drafting each time.",
        images: [],
      },
      {
        title: "How it works",
        text: "The tool uses code length-to-thickness ratios to tell a wall from a column, aligns each one with the grid and generates the dimension tags (C1, C2 and so on).",
        images: ["/images/plugins/detailer-full.webp"],
      },
      {
        title: "Result",
        text: "A fully formatted column details schedule is compiled instantly. It is used by five engineers in the office and is still being developed.",
        images: [],
      },
    ],
  },
];

export const experience = [
  {
    period: "Feb 2025 — Present",
    role: "Structural Design Engineer",
    company: "Sketch Engineering Consulting",
    place: "Doha, Qatar",
    points: [
      "Full structural design packages for 50+ villas and 10 commercial buildings, including PT slabs spanning up to 15 m.",
      "Shear walls, flat slabs and raft foundation of a 2B+G+12 commercial building in ETABS and SAFE.",
      "90 m × 47 m steel factory in STAAD.Pro with crane runway beams, plus warehouses and pipe supports.",
      "Audits of 2 buildings and the retrofit design of a G+11 residential block (CFRP, jacketing, steel beams).",
      "Built two Python tools (CSI API and AutoCAD) now used by 5 engineers; supervise BIM modellers and CAD technicians.",
    ],
  },
  {
    period: "May 2024 — Nov 2024",
    role: "Structural Designer (Apprenticeship)",
    company: "Techmaghi",
    place: "Kerala, India",
    points: [
      "Multi-storey RC buildings from analysis model to reinforcement detailing: seismic loads, ductile shear walls, flat slabs and raft foundations.",
    ],
  },
  {
    period: "2020 — 2024",
    role: "B.Tech, Civil Engineering",
    company: "MEA Engineering College (APJ Abdul Kalam Technological University)",
    place: "Kerala, India",
    points: [],
  },
];

export const toolkit = [
  { label: "Main software", items: ["ETABS", "CSI SAFE", "STAAD.Pro", "Autodesk Revit"] },
  { label: "Working knowledge", items: ["IDEA StatiCa", "AutoCAD", "Tekla Structures", "SAP2000", "Robot Structural Analysis", "PROKON"] },
  { label: "Codes & standards", items: ["ACI 318", "ASCE 7", "AISC", "Eurocodes", "QCS"] },
  { label: "Automation", items: ["Python", "CSI API (ETABS, SAFE)", "AutoCAD automation"] },
];

export const designAreas = [
  "RC design", "Structural steel", "Portal frames", "PT slabs", "Flat slabs", "Shear walls",
  "Raft & pile foundations", "Seismic & wind", "Retrofitting",
];

export const credentials = [
  { title: "Structural Design and Analysis (STAAD.Pro)", by: "Bentley Systems & Arabian Infotech", date: "Oct 2025" },
  { title: "UPDA / MMUP Engineer Registration", by: "Qatar", date: "In progress" },
  { title: "IStructE & ICE Graduate Membership", by: "Towards chartership", date: "In progress" },
];
