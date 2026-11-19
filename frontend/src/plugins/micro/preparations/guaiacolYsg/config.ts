import type { PlateCountConfig } from "../plateCount/config";

/** Guaiacol / thermophilic count on YSG Agar (lower section of sheet "62", SM-PR-687). Excel: SUM(D43:L44) × 100 / 2.2. */
export const guaiacolYsgConfig: PlateCountConfig = {
  key: "guaiacolYsg",
  moduleId: "micro.guaiacolYsg",
  persistenceType: "guaiacolYsg",
  title: "YSG Agar Count (SM-PR-687)",
  testName: "Guaiacol Producing Organisms on YSG Agar",
  media: "YSG Agar",
  method: "SM-PR-687",
  incubationTemp: "45 ± 2",
  incubationTime: "5 days",
  incubationTimeLabel: "Incubation Time",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  extraTextSteps: [
    { name: "Colony characteristics", value: "Off white translucent colonies" },
  ],
};
