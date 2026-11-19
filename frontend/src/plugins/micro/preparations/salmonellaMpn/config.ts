import type { MpnConfig } from "../mpn/config";

/** Detection and Enumeration of Salmonella by MPN. Values from sheet "84" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
const series = [
  { label: "I series (10 ml direct)", tubes: 5 },
  { label: "II series (10 ml blended mixture, 1:10)", tubes: 5 },
  { label: "III series (1 ml blended mixture, 1:10)", tubes: 5 },
] as const;

export const salmonellaMpnConfig: MpnConfig = {
  key: "salmonellaMpn",
  moduleId: "micro.salmonellaMpn",
  persistenceType: "salmonellaMpn",
  title: "Salmonella MPN (EPA Appendix F)",
  testName: "Detection and Enumeration of Salmonella by MPN",
  media:
    "Tetrathionate Broth (TTB), Brilliant green agar (BGA), Xylose lysine deoxycholate agar (XLDA), Triple sugar iron agar (TSI), Lysine iron agar (LIA)",
  method: "EPA/625/R-92/013, Appendix F",
  stages: [
    {
      title: "TTB",
      media: "Tetrathionate Broth (+ve: Turbidity, -ve: No turbidity)",
      incubation: "43 °C for 48 h",
      groups: series,
      readings: ["Turbidity"],
    },
    {
      title: "BGA",
      media: "Brilliant green agar: red to pink-white colonies surrounded by a red zone",
      incubation: "35 °C for 24 h",
      inoculation: "Streak from each tube to brilliant green agar and XLDA",
      groups: series,
      readings: ["Typical colonies"],
    },
    {
      title: "XLDA",
      media: "XLD agar: clear, pink-edged, black-centered colonies",
      incubation: "35 °C for 24 h",
      groups: series,
      readings: ["Typical colonies"],
    },
    {
      title: "Confirmation Test",
      media:
        "TSI (+ve: alkaline slant, acidic butt with H2S), LIA (+ve: purple slant and butt with H2S), Anti-O / Anti-H / Anti-Vi serum (+ve: agglutination)",
      incubation: "35 °C for 24 h",
      inoculation: "From each plate select at least 2-3 suspected colonies and inoculate on TSI agar and LIA",
      groups: series,
      readings: ["TSI", "LIA", "Anti-O", "Anti-H", "Anti-Vi", "Confirmed"],
    },
  ],
  extraTextSteps: ["Positive Control", "Blank"],
  countStage: 3,
  countReadings: ["Confirmed"],
  presence: false,
  mpn: { formula: "salmonellaSolids", unit: "MPN/4 g" },
};
