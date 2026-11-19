import type { FormulaConfig } from "../formula/config";

/**
 * Rope Spore Count. Values from sheet "60".
 * Count from 10 ml sample flask = n1+n2+n3+n4+n5
 * Count from 1 ml sample flask = (n1+n2+n3+n4+n5) × 10
 * The sheet has one RESULT line and no rule for choosing between the two counts,
 * so the 10 ml count is the main value and both are printed.
 */
export const ropeSporeConfig: FormulaConfig = {
  key: "ropeSpore",
  moduleId: "micro.ropeSpore",
  persistenceType: "ropeSpore",
  title: "Rope Spore Count",
  testName: "Rope Spore Count",
  media: "Dextrose Tryptone Agar",
  method: "APHA 5th Edition. Chapter-23",
  headerTextSteps: [{ name: "Incubation", value: "35 °C / 48 h" }],
  tables: [
    {
      key: "flasks",
      title: "Plates (heat shock at 94-100 °C for 15 min, held at about 45 °C, poured into 5 plates)",
      rows: ["10 ml Peptone water suspension in 100 ml DTA", "1 ml Peptone water suspension in 100 ml DTA"],
      columns: ["n1", "n2", "n3", "n4", "n5", "Blank"],
    },
  ],
  formulaText: "10 ml flask = n1+n2+n3+n4+n5;  1 ml flask = (n1+n2+n3+n4+n5) × 10",
  resultLabel: "Count from 10 ml sample flask",
  unit: "CFU/gm/ml",
  compute: (x) => {
    const plates = [0, 1, 2, 3, 4];
    const row = (r: number) => plates.reduce((s, c) => s + (x.cell("flasks", r, c) ?? 0), 0);
    return {
      value: row(0),
      details: [`Count from 1 ml sample flask: ${row(1) * 10} CFU/gm/ml`],
    };
  },
};
