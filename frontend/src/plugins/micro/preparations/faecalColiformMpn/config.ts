import type { MpnConfig } from "../mpn/config";

/** Determination and Enumeration of Faecal coliform by Multiple Tube Fermentation Method. Values from sheet "83". */
export const faecalColiformMpnConfig: MpnConfig = {
  key: "faecalColiformMpn",
  moduleId: "micro.faecalColiformMpn",
  persistenceType: "faecalColiformMpn",
  title: "Faecal Coliform MPN (APHA 9221 E)",
  testName: "Determination and Enumeration of Faecal coliform by Multiple Tube Fermentation Method",
  media: "Lauryl Tryptose Broth, EC broth",
  method: "APHA 9221 E (23rd Edition) / EPA/625/R-92/013, Appendix F",
  stages: [
    {
      title: "Presumptive Test",
      media: "Lauryl Tryptose Broth (D.S: Double Strength, S.S: Single Strength)",
      incubation: "35 ± 0.5 °C for 48 ± 3 h",
      groups: [
        { label: "D1 (10 ml of 1.0×10⁻⁴ dilution / dilution B) in 10 ml D.S", tubes: 5 },
        { label: "D2 (1 ml of dilution B) in 10 ml S.S", tubes: 5 },
        { label: "D3 (10 ml of 1.0×10⁻⁶ dilution / dilution C) in 10 ml S.S", tubes: 5 },
        { label: "D4 (1 ml of dilution C) in 10 ml S.S", tubes: 5 },
      ],
      readings: ["24 h", "48 h"],
    },
    {
      title: "Confirmatory Test",
      media: "EC broth",
      incubation: "44.5 ± 0.2 °C for 24 ± 2 h",
      inoculation: "Subculture all positive tubes of Presumptive test",
      groups: [
        { label: "D1", tubes: 5 },
        { label: "D2", tubes: 5 },
        { label: "D3", tubes: 5 },
        { label: "D4", tubes: 5 },
      ],
      readings: ["24 h", "48 h"],
    },
  ],
  extraTextSteps: ["Positive Control", "Blank"],
  countStage: 1,
  presence: false,
  mpn: { formula: "faecalSolids", unit: "MPN/g" },
};
