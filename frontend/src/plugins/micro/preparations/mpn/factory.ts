import type { MpnConfig, TubeGroupConfig, TubeStageConfig } from "./config";
import type { MpnResultValue, MpnStep, SamplePreparationMpn } from "./models";
import { countPositiveTubes } from "./calculation";

export const MPN_STEP_NAMES = {
  nature: "Nature of the Sample",
  media: "Media Required",
  quantity: "Sample Quantity",
  method: "Test Method Followed",
  instrument: "Instrument Used",
  started: "Analysis Started",
  completed: "Analysis Completed",
  observations: "Observations",
  result: "Result",
} as const;

export const TUBE_OPTIONS = ["+", "-"] as const;
export const RESULT_OPTIONS = ["Absent", "Present"] as const;

export const getTubeStepName = (stage: TubeStageConfig, group: TubeGroupConfig): string =>
  `${stage.title} › ${group.label}`;

export const cellCount = (stage: TubeStageConfig, group: TubeGroupConfig): number =>
  stage.readings.length * group.tubes;

/** e.g. "24 h: + + - - -; 48 h: + + + - -". Empty readings are left out. */
export function summarizeTubes(
  stage: TubeStageConfig,
  group: TubeGroupConfig,
  cells: readonly string[] | undefined,
): string {
  return stage.readings
    .map((reading, r) => {
      const values = Array.from({ length: group.tubes }, (_, t) =>
        String(cells?.[r * group.tubes + t] ?? "").trim(),
      );
      return values.some((v) => v !== "")
        ? `${reading}: ${values.map((v) => v || "·").join(" ")}`
        : "";
    })
    .filter((x) => x !== "")
    .join("; ");
}

/** Positive tubes per group of the counting stage, e.g. [{label:"D1", positive:5, tubes:5}, ...]. */
export function getPositiveCombination(
  config: MpnConfig,
  preparation: SamplePreparationMpn,
): Array<{ label: string; positive: number; tubes: number }> {
  const stage = config.stages[config.countStage];
  if (!stage) return [];
  const wanted = config.countReadings;
  const readingIndexes = stage.readings
    .map((r, i) => ({ r, i }))
    .filter((x) => !wanted || wanted.includes(x.r))
    .map((x) => x.i);
  return stage.groups.map((group) => {
    const step = preparation.steps.find((s) => s.name === getTubeStepName(stage, group));
    return {
      label: group.label,
      tubes: group.tubes,
      positive: countPositiveTubes(step?.tubes, group.tubes, readingIndexes),
    };
  });
}

export const summarizeResult = (config: MpnConfig, result: MpnResultValue | undefined): string => {
  const parts: string[] = [];
  const status = String(result?.status ?? "").trim();
  const per = String(result?.per ?? "").trim();
  if (config.presence && status) parts.push(per ? `${status} in ${per}` : status);
  if (config.mpn) {
    if (String(result?.mpnIndex ?? "").trim()) parts.push(`MPN Index/100 mL: ${result?.mpnIndex}`);
    if (String(result?.mpnResult ?? "").trim())
      parts.push(`MPN: ${result?.mpnResult} ${config.mpn.unit}`);
  }
  return parts.join("; ");
};

const emptyResult = (): MpnResultValue => ({
  status: "",
  per: "",
  mpnIndex: "",
  largestVolume: "",
  drySolids: "",
  mpnResult: "",
});

const createStep = (name: string, extra: Partial<MpnStep> = {}): MpnStep => ({
  name,
  value1: "",
  unit1: "",
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
  ...extra,
});

export function createMpnSteps(config: MpnConfig): MpnStep[] {
  const n = MPN_STEP_NAMES;
  return [
    createStep(n.nature),
    createStep(n.media, { value1: config.media }),
    createStep(n.quantity),
    createStep(n.method, { value1: config.method }),
    createStep(n.instrument),
    createStep(n.started),
    createStep(n.completed),
    ...config.stages.flatMap((stage) =>
      stage.groups.map((group) =>
        createStep(getTubeStepName(stage, group), {
          tubes: Array.from({ length: cellCount(stage, group) }, () => ""),
        }),
      ),
    ),
    ...(config.extraTextSteps ?? []).map((name) => createStep(name)),
    createStep(n.observations),
    createStep(n.result, { result: emptyResult() }),
  ];
}

const createId = (index: number) => Date.now() + index;

export const createSamplePreparationMpn = (config: MpnConfig, index: number): SamplePreparationMpn => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: createMpnSteps(config),
});

const normalizeList = (value: unknown, length: number): string[] => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) =>
    source[i] === null || source[i] === undefined ? "" : String(source[i]),
  );
};

export function restoreSamplePreparationMpn(
  config: MpnConfig,
  value: unknown,
  index = 0,
): SamplePreparationMpn {
  const created = createSamplePreparationMpn(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationMpn>;
  const raw: MpnStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, MpnStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, MpnStep]),
  );

  const tubeStages = new Map<string, { stage: TubeStageConfig; group: TubeGroupConfig }>();
  for (const stage of config.stages)
    for (const group of stage.groups) tubeStages.set(getTubeStepName(stage, group), { stage, group });

  return {
    ...created,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((d) => {
      const r = byName.get(d.name.toLowerCase());
      const tube = tubeStages.get(d.name);
      if (tube && d.tubes) {
        const tubes = normalizeList(r?.tubes, d.tubes.length);
        return { ...d, tubes, value1: summarizeTubes(tube.stage, tube.group, tubes) };
      }
      if (d.result) {
        const saved = (r?.result ?? {}) as Partial<Record<keyof MpnResultValue, unknown>>;
        const result = Object.fromEntries(
          Object.keys(d.result).map((k) => [k, saved[k as keyof MpnResultValue] == null ? "" : String(saved[k as keyof MpnResultValue])]),
        ) as unknown as MpnResultValue;
        return { ...d, result, value1: summarizeResult(config, result) };
      }
      return {
        ...d,
        value1: r?.value1 ?? d.value1,
        value2: r?.value2 ?? d.value2,
        value3: r?.value3 ?? d.value3,
        unit1: r?.unit1 ?? d.unit1,
        unit2: r?.unit2 ?? d.unit2,
        unit3: r?.unit3 ?? d.unit3,
        logBookID: r?.logBookID ?? d.logBookID,
      };
    }),
  };
}

/** Why the preparation cannot be completed yet, or "" when it can. */
export function getMissingResult(config: MpnConfig, preparation: SamplePreparationMpn): string {
  const result = preparation.steps.find((s) => s.name === MPN_STEP_NAMES.result)?.result;
  if (config.presence && !String(result?.status ?? "").trim()) return "Present / Absent";
  if (config.mpn && !config.presence && !String(result?.mpnResult ?? "").trim()) return "MPN result";
  return "";
}
