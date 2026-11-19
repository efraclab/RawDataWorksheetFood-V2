import type { PlateCountConfig } from "../plateCount/config";

/** Guaiacol Producing Organisms (upper section of sheet "62"). Excel sums only the BAT Agar rows (E12:H13). */
export const guaiacolConfig: PlateCountConfig = {
  key: "guaiacol",
  moduleId: "micro.guaiacol",
  persistenceType: "guaiacol",
  title: "Guaiacol Producing Organisms (APHA)",
  testName: "Guaiacol Producing Organisms",
  media: "ALI Broth, BAT Agar, K Agar",
  method: "APHA 5th Edition Chapter 25",
  incubationTemp: "43-50",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  timePoints: [
    { label: "BAT Agar", counted: true },
    { label: "K Agar", counted: false },
  ],
  extraTextSteps: [
    {
      name: "Sample Preparation",
      value: "10 gm of sample in 90 ml ALI Broth, heat shock at 80 °C for 10 min. Pour 1 ml sample on agar plates.",
    },
  ],
  confirmationTests: [
    { name: "Endospore staining" },
    { name: "Growth on PDA", temp: "43", time: "5 days" },
    { name: "Guaiacol Production" },
  ],
};
