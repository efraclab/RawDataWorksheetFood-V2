import type { CalculationHCLStack } from "./models/CalculationHCLStack";
import type { HCLStackSection, SamplePreparationHCLStack, SamplePreparationHCLStackStep } from "./models/SamplePreparationHCLStack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const sectionSteps = (
  section: HCLStackSection,
  volume: string,
): SamplePreparationHCLStackStep[] => [
  { name: "Volume of Absorbence", section, value1: volume, unit1: "ml", logBookID: "" },
  { name: "Instrument Reading", section, value1: "", unit1: "", logBookID: "" },
  { name: "Factor", section, value1: "1.028", unit1: "", logBookID: "" },
  { name: "Dilution Factor", section, value1: "1", unit1: "", logBookID: "" },
  { name: "Volume of Gas Drawn", section, value1: "2", unit1: "Nm³", logBookID: "" },
];

export const createSamplePreparationHCLStack = (index: number): SamplePreparationHCLStack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    ...sectionSteps("particulate", "25"),
    ...sectionSteps("h2so4", "30"),
    ...sectionSteps("naoh", "30"),
  ],
});

const emptySection = () => ({ result: null, acceptanceLimitMin: "", acceptanceLimitMax: "" });

export const createCalculationHCLStack = (index: number): CalculationHCLStack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  particulate: emptySection(),
  h2so4: emptySection(),
  naoh: emptySection(),
});

const restoreSection = (value: unknown) => {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    result: typeof source.result === "number" ? source.result : null,
    acceptanceLimitMin: typeof source.acceptanceLimitMin === "string" ? source.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof source.acceptanceLimitMax === "string" ? source.acceptanceLimitMax : "",
  };
};

export const restoreCalculationHCLStack = (value: unknown): CalculationHCLStack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationHCLStack> : {};
  const legacy = source && typeof source === "object" ? source as Record<string, unknown> : {};

  // Backward compatibility with the earlier single-result HCl implementation.
  const legacyResult = typeof legacy.calculationResult === "number" ? legacy.calculationResult : null;
  const legacyMin = typeof legacy.acceptanceLimitMin === "string" ? legacy.acceptanceLimitMin : "";
  const legacyMax = typeof legacy.acceptanceLimitMax === "string" ? legacy.acceptanceLimitMax : "";

  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    particulate: data.particulate ? restoreSection(data.particulate) : { result: legacyResult, acceptanceLimitMin: legacyMin, acceptanceLimitMax: legacyMax },
    h2so4: restoreSection(data.h2so4),
    naoh: restoreSection(data.naoh),
  };
};

const normalized = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const restoreSamplePreparationHCLStack = (value: unknown, index: number): SamplePreparationHCLStack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationHCLStack>;
  const defaults = createSamplePreparationHCLStack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationHCLStackStep[] : [];

  const hasSectionData = saved.some((item) => item.section === "particulate" || item.section === "h2so4" || item.section === "naoh");
  const steps = defaults.steps.map((defaultStep, index) => {
    const restored = hasSectionData
      ? saved.find((item) =>
        normalized(String(item.name ?? "")) === normalized(defaultStep.name) &&
        item.section === defaultStep.section,
      )
      : saved[index];
    return restored ? { ...defaultStep, ...restored, section: defaultStep.section } : defaultStep;
  });

  return {
    ...defaults,
    ...source,
    id: typeof source.id === "number" ? source.id : defaults.id,
    label: typeof source.label === "string" ? source.label : defaults.label,
    steps,
  };
};
