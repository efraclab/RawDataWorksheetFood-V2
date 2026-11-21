import type { ResidueSectionConfig } from "./config";

/** Sections shared by several RA tests. Text comes from the "Raw Data for Steps" sheet. */

export const DILUENT: ResidueSectionConfig = {
  title: "Diluent Preparation",
  steps: ["Diluent Preparation"],
};

/** Only the LC tests (Parameters sheet rows 6 to 9). */
export const MOBILE_PHASE: ResidueSectionConfig = {
  title: "Mobile Phase Preparation",
  steps: ["Weighing", "pH Adjustment", "Filtration", "Sonication"],
};

export const STANDARD: ResidueSectionConfig = {
  title: "Standard Preparation",
  steps: [
    "Weighing (CRM)",
    "Stock Standard",
    "Intermediate Standard",
    "Working Standard",
    {
      name: "Linearity Standards",
      template:
        "Preparation from working standards: ( ___ , ___ , ___ , ___ , ___ , ___ )",
    },
  ],
};

const EVAPORATION = {
  name: "Evaporation",
  template:
    "Take ___ ml of cleaned up sample for evaporation and reconstitute with suitable diluent ___ ml",
} as const;

/** Weighing, Extraction, Cleanup, Evaporation, Dilution Factor (most tests). */
export const sampleStandard = (title: string): ResidueSectionConfig => ({
  title,
  steps: ["Weighing", "Extraction", "Cleanup", EVAPORATION, "Dilution Factor"],
});

export const SAMPLE_DITHIOCARBAMATES: ResidueSectionConfig = {
  title: "Sample Preparation for Dithiocarbamates",
  steps: [
    "Weighing",
    "Extraction",
    {
      name: "Filtration",
      value:
        "After this keep it for cooling and filter 1 ml sample for injection in instrument.",
    },
    "Dilution Factor",
  ],
};

export const SAMPLE_RESIDUAL_SOLVENTS: ResidueSectionConfig = {
  title: "Sample Preparation for Residual Solvents",
  steps: [
    { name: "Weighing", template: "Weigh accurately ___ mg of ___ (Sample Name)" },
    {
      name: "Dilution",
      template:
        "Add ___ ml of Diluent and crimp it, vortex for ___ min. and inject in instrument.",
    },
    "Dilution Factor",
  ],
};

export const SAMPLE_VOCS: ResidueSectionConfig = {
  title: "Sample Preparation for VOCs & THM",
  steps: [
    {
      name: "Sample",
      template: "Take ___ ml sample in 40 ml amber color Vial and run in Instrument",
    },
    "Dilution Factor",
  ],
};

export const SAMPLE_VITAMINS: ResidueSectionConfig = {
  title: "Sample Preparation for Vitamin B9, B12, B7",
  steps: ["Weighing", "Extraction", "Sonication", EVAPORATION, "Dilution Factor"],
};

/** Instrumental run, pre-filled from the Parameters sheet (rows 89 to 93). Editable. */
export const instrumentRun = (instrument: string): ResidueSectionConfig => ({
  title: "Instrumental Run",
  steps: [{ name: "Instrument", value: instrument }],
});