import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import WorksheetShell from "./WorksheetShell";
import {
  worksheetService,
  type WorksheetDetail as WorksheetDetailData,
  type FetchWorksheetRequest,
} from "../worksheetService";
import FoodWorksheetHeader from "../../../plugins/food/components/worksheet/FoodWorksheetHeader";
import FoodWorksheetInfo from "../../../plugins/food/components/worksheet/FoodWorksheetInfo";
import FoodParameterManager from "../../../plugins/food/components/worksheet/FoodParameterManager";
import FoodParameterOverview from "../../../plugins/food/components/worksheet/FoodParameterOverview";
import AnalystSelectionDialog from "../../../plugins/food/components/dialogs/AnalystSelectionDialog";
import type { ParameterDetail } from "../../../plugins/food/models/ParameterDetail";
import type { SampleData } from "../../../plugins/food/models/SampleData";
import type { Analyst } from "../../../plugins/food/models/Analyst";
import FoodSystemSuitability from "../../../plugins/food/components/worksheet/FoodSystemSuitability";
import FoodParameterFiles from "../../../plugins/food/components/worksheet/FoodParameterFiles";
import type { SystemSuitability } from "../../../plugins/food/models/SystemSuitability";
import type { AttachedFile } from "../../../plugins/food/models/AttachedFile";
import FoodAdditionalInfo from "../../../plugins/food/components/worksheet/FoodAdditionalInfo";
import FoodInstrumentSection from "../../../plugins/food/components/worksheet/FoodInstrumentSection";
import FoodChemicalSection from "../../../plugins/food/components/worksheet/FoodChemicalSection";
import FoodStandardSection from "../../../plugins/food/components/worksheet/FoodStandardSection";
import FoodBufferPreparation from "../../../plugins/food/components/worksheet/FoodBufferPreparation";
import FoodMobilePhasePreparation from "../../../plugins/food/components/worksheet/FoodMobilePhasePreparation";
import FoodDiluentPreparation from "../../../plugins/food/components/worksheet/FoodDiluentPreparation";
import PreparationEditorDialog from "../../../plugins/food/components/worksheet/PreparationEditorDialog";
import type { Instrument } from "../../../plugins/food/models/Instrument";
import type { Chemical } from "../../../plugins/food/models/Chemical";
import type { Standard } from "../../../plugins/food/models/Standard";
import type { WorksheetInstrument } from "../../../plugins/food/models/WorksheetInstrument";
import type { WorksheetChemical } from "../../../plugins/food/models/WorksheetChemical";
import type { WorksheetStandard } from "../../../plugins/food/models/WorksheetStandard";
import type { BufferPreparation } from "../../../plugins/food/models/BufferPreparation";
import type { MobilePhasePreparation } from "../../../plugins/food/models/MobilePhasePreparation";
import type { DiluentPreparation } from "../../../plugins/food/models/DiluentPreparation";
import CopyFromWorksheetDialog from "../../../plugins/food/components/worksheet/Copyfromworksheetdialog";
import PreparationEngine, { type PreparationEngineHandle } from "../../preparation-engine/components/PreparationEngine";
import { foodPreparationModuleRegistry } from "../../../plugins/food/preparation-engine/foodPreparationModuleRegistry";

interface WorksheetDetailsProps {
  worksheetId: string;
  lab?: string;
}


interface PersistedFilePayload {
  id: number;
  parameterId?: number;
  preparationType: string;
  label: string;
  fileName: string;
  fileDataBase64?: string;
}

function normalizeBase64(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const base64 = trimmed
    .replace(/^data:[^;]+;base64,/i, "")
    .trim();

  if (!base64 || base64.length % 4 !== 0) return null;
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) return null;

  return base64;
}

/**
 * Existing files returned by the API have an id > 0. They are already
 * persisted on the server, so Save Draft must not send their possibly
 * missing/legacy fileDataBase64 back to the API.
 *
 * New files are created by WorksheetFileAttacher with id === 0 and must
 * contain a real Base64 payload.
 */
function toFilePayload(
  file: any,
  defaults: {
    id?: number;
    parameterId?: number;
    preparationType: string;
    label: string;
    fileName?: string;
  }
): PersistedFilePayload | null {
  const originalId =
    typeof file?.id === "number" && Number.isFinite(file.id)
      ? file.id
      : typeof defaults.id === "number"
        ? defaults.id
        : 0;

  const isExistingServerFile = originalId > 0;
  const base64 = normalizeBase64(file?.fileDataBase64);

  const fileName = String(
    file?.fileName ??
      file?.name ??
      defaults.fileName ??
      ""
  ).trim();

  if (!fileName) return null;

  const payload: PersistedFilePayload = {
    id: isExistingServerFile ? originalId : 0,
    ...(typeof defaults.parameterId === "number"
      ? { parameterId: defaults.parameterId }
      : {}),
    preparationType:
      String(file?.preparationType ?? defaults.preparationType),
    label: String(file?.label ?? defaults.label),
    fileName,
  };

  if (base64) {
    payload.fileDataBase64 = base64;
  } else if (!isExistingServerFile) {
    // A newly added file cannot be persisted without its actual contents.
    return null;
  }

  return payload;
}


export default function WorksheetDetails({
  worksheetId,
  lab,
}: WorksheetDetailsProps) {
  // ============================================================
  // STATE
  // ============================================================

  const [worksheet, setWorksheet] =
    useState<WorksheetDetailData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // FOOD PARAMETER MANAGEMENT
  // ============================================================

  const [addedParameters, setAddedParameters] =
    useState<ParameterDetail[]>([]);

  const [expandedParameterId, setExpandedParameterId] =
    useState<number | null>(null);

  const [preparationLockedPerParam, setPreparationLockedPerParam] =
    useState<Record<number, boolean>>({});

  const [availableParameters, setAvailableParameters] =
    useState<SampleData[]>([]);

  const [showCopyWorksheetDialog, setShowCopyWorksheetDialog] = useState(false);

  const preparationEngineRef = useRef<PreparationEngineHandle | null>(null);

  // ============================================================
  // V1 ANALYST ASSIGNMENT WORKFLOW
  // A newly selected parameter is kept pending until an analyst
  // is selected and confirmed.
  // ============================================================

  const [showAnalystDialog, setShowAnalystDialog] =
    useState(false);

  const [pendingParameter, setPendingParameter] =
    useState<ParameterDetail | null>(null);

  const [analysts, setAnalysts] =
    useState<Analyst[]>([]);

  // ============================================================
  // V1 SYSTEM SUITABILITY / PARAMETER FILES
  // State is maintained per parameter exactly like V1.
  // ============================================================

  const [systemSuitabilityPerParam, setSystemSuitabilityPerParam] =
    useState<Record<number, SystemSuitability[]>>({});

  const [showSystemSuitability, setShowSystemSuitability] =
    useState<Record<number, boolean>>({});

  const [showParamFiles, setShowParamFiles] =
    useState<Record<number, boolean>>({});

  const showParamFilesForParameter = (parameterId: number) =>
    Boolean(showParamFiles[parameterId]);

  const [filesPerParam, setFilesPerParam] =
    useState<Record<number, Record<string, AttachedFile[]>>>({});

  const PARAM_LEVEL_KEY = "param_level";

  const getParamLevelFiles = (parameterId: number): AttachedFile[] =>
    (filesPerParam[parameterId] ?? {})[PARAM_LEVEL_KEY] ?? [];

  const updateFilesForSlot = (
    parameterId: number,
    slotKey: string,
    updater: (prev: AttachedFile[]) => AttachedFile[]
  ) => {
    setFilesPerParam((prev) => ({
      ...prev,
      [parameterId]: {
        ...(prev[parameterId] ?? {}),
        [slotKey]: updater(
          (prev[parameterId] ?? {})[slotKey] ?? []
        ),
      },
    }));
  };

  const handleAddParamFiles = (
    parameterId: number,
    newFiles: AttachedFile[]
  ) => {
    updateFilesForSlot(
      parameterId,
      PARAM_LEVEL_KEY,
      (prev) => [...prev, ...newFiles]
    );
  };

  const handleRemoveParamFile = (
    parameterId: number,
    index: number
  ) => {
    updateFilesForSlot(
      parameterId,
      PARAM_LEVEL_KEY,
      (prev) => prev.filter((_, i) => i !== index)
    );
  };

  const createNewSystemSuitability = (
    index: number
  ): SystemSuitability => ({
    id: Date.now() + index,
    label: `System Suitability ${index + 1}`,
    steps: [
      { name: "RSD Area", value1: "", value2: "", value3: "", value4: "" },
      { name: "RSD Retention time", value1: "", value2: "", value3: "", value4: "" },
      { name: "Tailing factor", value1: "", value2: "", value3: "", value4: "" },
      { name: "Resolution", value1: "", value2: "", value3: "", value4: "" },
      { name: "Theorital Plate count", value1: "", value2: "", value3: "", value4: "" },
      { name: "Peak to Valley ratio", value1: "", value2: "", value3: "", value4: "" },
    ],
  });

  const handleAddSystemSuitability = (parameterId: number) => {
    setSystemSuitabilityPerParam((prev) => {
      const current = prev[parameterId] || [];
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewSystemSuitability(current.length),
        ],
      };
    });
  };

  const handleRemoveSystemSuitability = (
    parameterId: number,
    suitabilityId: number
  ) => {
    setSystemSuitabilityPerParam((prev) => {
      const updated = (prev[parameterId] || [])
        .filter((ss) => ss.id !== suitabilityId)
        .map((ss, index) => ({
          ...ss,
          label: `System Suitability ${index + 1}`,
        }));

      return { ...prev, [parameterId]: updated };
    });
  };

  const handleSystemSuitabilityStepChange = (
    parameterId: number,
    suitabilityId: number,
    stepName: string,
    field: "value1" | "value2" | "value3" | "value4",
    newValue: string
  ) => {
    setSystemSuitabilityPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((ss) =>
        ss.id !== suitabilityId
          ? ss
          : {
              ...ss,
              steps: ss.steps.map((step) =>
                step.name === stepName
                  ? { ...step, [field]: newValue }
                  : step
              ),
            }
      ),
    }));
  };

  const handleAddSystemSuitabilityStep = (
    parameterId: number,
    suitabilityId: number,
    stepName: string,
    limitType?: string
  ) => {
    setSystemSuitabilityPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((ss) => {
        if (ss.id !== suitabilityId) return ss;
        if (ss.steps.some((step) => step.name === stepName)) return ss;

        return {
          ...ss,
          steps: [
            ...ss.steps,
            {
              name: stepName,
              limitType,
              value1: "",
              value2: "",
              value3: "",
              value4: "",
            },
          ],
        };
      }),
    }));
  };

  const handleRemoveSystemSuitabilityStep = (
    parameterId: number,
    suitabilityId: number,
    stepName: string
  ) => {
    setSystemSuitabilityPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((ss) =>
        ss.id !== suitabilityId
          ? ss
          : {
              ...ss,
              steps: ss.steps.filter((step) => step.name !== stepName),
            }
      ),
    }));
  };

  // ============================================================
  // V1 REFERENCE DATA / PARAMETER SECTION STATE
  // ============================================================

  const [addedInstruments, setAddedInstruments] =
    useState<Record<number, WorksheetInstrument[]>>({});
  const [addedChemicals, setAddedChemicals] =
    useState<Record<number, WorksheetChemical[]>>({});
  const [addedStandards, setAddedStandards] =
    useState<Record<number, WorksheetStandard[]>>({});

  const [showInstrumentDropdown, setShowInstrumentDropdown] =
    useState(false);
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const instrumentRef = useRef<HTMLDivElement>(null);

  const [showChemicalDropdown, setShowChemicalDropdown] =
    useState(false);
  const [chemicalSearch, setChemicalSearch] = useState("");
  const chemicalRef = useRef<HTMLDivElement>(null);

  const [showStandardDropdown, setShowStandardDropdown] =
    useState(false);
  const [standardSearch, setStandardSearch] = useState("");
  const standardRef = useRef<HTMLDivElement>(null);

  const [showAdditionalInfo, setShowAdditionalInfo] =
    useState<Record<number, boolean>>({});
  const [additionalInfoPerParam, setAdditionalInfoPerParam] =
    useState<Record<number, string>>({});

  const [bufferPreparationPerParam, setBufferPreparationPerParam] =
    useState<Record<number, BufferPreparation[]>>({});
  const [showBufferPreparation, setShowBufferPreparation] =
    useState<Record<number, boolean>>({});

  const [mobilePhasePerParam, setMobilePhasePerParam] =
    useState<Record<number, MobilePhasePreparation[]>>({});
  const [showMobilePhasePreparation, setShowMobilePhasePreparation] =
    useState<Record<number, boolean>>({});
  const [showMobilePhaseDialog, setShowMobilePhaseDialog] =
    useState<Record<number, boolean>>({});
  const [editingMobilePhasePrepId, setEditingMobilePhasePrepId] =
    useState<string | null>(null);

  const [diluentPreparationsPerParam, setDiluentPreparationsPerParam] =
    useState<Record<number, DiluentPreparation[]>>({});
  const [showDiluentPreparation, setShowDiluentPreparation] =
    useState<Record<number, boolean>>({});
  const [showDiluentPrepDialog, setShowDiluentPrepDialog] =
    useState<Record<number, boolean>>({});
  const [editingDiluentPrepId, setEditingDiluentPrepId] =
    useState<string | null>(null);

  // ============================================================
  // REFERENCE DATA
  //
  // These catalogues are worksheet-independent master/reference data.
  // V1 loads them from the existing reference-data endpoints.
  // V2 therefore loads them here rather than expecting WorksheetDetails'
  // parent route to pass them as props.
  // ============================================================

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isReferenceDataLoading, setIsReferenceDataLoading] = useState(true);
  const [referenceDataError, setReferenceDataError] =
    useState<string | null>(null);

  const searchFilteredInstruments = instruments.filter((item) =>
    String(item.name ?? "")
      .toLowerCase()
      .includes(instrumentSearch.toLowerCase())
  );

  const searchFilteredChemicals = chemicals.filter((item) =>
    String(item.name ?? "")
      .toLowerCase()
      .includes(chemicalSearch.toLowerCase())
  );

  const searchFilteredStandards = standards.filter((item) =>
    String(item.name ?? "")
      .toLowerCase()
      .includes(standardSearch.toLowerCase())
  );

  // Load the three V1 reference-data catalogues once when the worksheet
  // opens. Promise.all preserves the independent catalogue semantics while
  // keeping the UI responsive.
  useEffect(() => {
    let cancelled = false;

    const loadReferenceData = async () => {
      setIsReferenceDataLoading(true);
      setReferenceDataError(null);

      try {
        const [instrumentData, chemicalData, standardData] =
          await Promise.all([
            worksheetService.getInstruments(),
            worksheetService.getChemicals(),
            worksheetService.getStandards(),
          ]);

        if (cancelled) return;

        setInstruments(instrumentData);
        setChemicals(chemicalData);
        setStandards(standardData);
      } catch (err: any) {
        if (cancelled) return;

        console.error("Error loading worksheet reference data:", err);
        setReferenceDataError(
          err?.message ?? "Failed to load reference data."
        );
      } finally {
        if (!cancelled) {
          setIsReferenceDataLoading(false);
        }
      }
    };

    loadReferenceData();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString();
  };


  // ============================================================
  // LOAD ANALYSTS
  // V1 loads the analyst catalogue when the worksheet page opens.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadAnalysts = async () => {
      try {
        const result = await worksheetService.getAnalysts();

        if (!cancelled) {
          setAnalysts(result);
        }
      } catch (err) {
        console.error("Error loading analysts:", err);
      }
    };

    loadAnalysts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // LOAD WORKSHEET
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadWorksheet = async () => {
      if (!worksheetId) {
        setError("No worksheet ID provided.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const request: FetchWorksheetRequest = {
          employeeId:
            localStorage.getItem("EmployeeId") ?? "",

          role:
            localStorage.getItem("Role") ?? "",
        };

        const worksheetData =
          await worksheetService.getById(
            worksheetId,
            request
          );

        if (cancelled) {
          return;
        }

        if (!worksheetData) {
          setWorksheet(null);
          setError("Worksheet not found.");
          return;
        }

        setWorksheet(worksheetData);

        // ============================================================
        // LOAD AVAILABLE FOOD PARAMETERS
        //
        // V1 uses a separate /sample-details request to populate
        // the parameter catalogue. Do NOT use worksheet.sample.parameters
        // for this purpose.
        // ============================================================

        const availableSamples =
  await worksheetService.getAvailableParameters({
    regNo:
      worksheetData.sample?.registrationNo ?? "",
    lab: displayLab,
  });

        if (cancelled) {
          return;
        }

        setAvailableParameters(availableSamples);

        // Preserve all parameter data returned by the existing V2 API.
        // The manager receives the V1-compatible ParameterDetail shape.
        const restoredParameters = (worksheetData.parameters ?? []).map(
          (parameter: any, index: number) => ({
            ...parameter,
            id:
              typeof parameter?.id === "number"
                ? parameter.id
                : typeof parameter?.parameterId === "number"
                  ? parameter.parameterId
                  : Date.now() + index,
            preparationCompletedBy:
              parameter?.preparationCompletedBy ?? null,
            preparationCompletedAt:
              parameter?.preparationCompletedAt ?? null,
            remarksByAnalyst:
              parameter?.remarksByAnalyst ?? null,
            paraCode:
              parameter?.paraCode ??
              parameter?.parameterCode ??
              null,
            parameterName:
              parameter?.parameterName ??
              parameter?.name ??
              parameter?.parameter ??
              null,
            methodCode:
              parameter?.methodCode ?? null,
            methodName:
              parameter?.methodName ??
              parameter?.method ??
              null,
            analyzedBy:
              parameter?.analyzedBy ?? null,
            approvedByReviewer:
              parameter?.approvedByReviewer ?? null,
            analyzedByName:
              parameter?.analyzedByName ?? null,
            approvedByReviewerName:
              parameter?.approvedByReviewerName ?? null,
            analysisStartDate:
              parameter?.analysisStartDate ?? null,
            analysisCompletionDate:
              parameter?.analysisCompletionDate ?? null,
            analysisObservationDate:
              parameter?.analysisObservationDate ?? null,
            approvedAtReviewer:
              parameter?.approvedAtReviewer ?? null,
            approvedByQAName:
              parameter?.approvedByQAName ?? null,
            approvedByQA:
              parameter?.approvedByQA ?? null,
            approvedAtQA:
              parameter?.approvedAtQA ?? null,
            remarksByReviewer:
              parameter?.remarksByReviewer ?? null,
            remarksByQA:
              parameter?.remarksByQA ?? null,
            submittedQaByName:
              parameter?.submittedQaByName ?? null,
            submittedQaBy:
              parameter?.submittedQaBy ?? null,
            status:
              parameter?.status ?? "CREATED",
            additional_info:
              parameter?.additional_info ?? null,
            other_info:
              parameter?.other_info ?? null,
            instruments:
              parameter?.instruments ?? [],
            chemicals:
              parameter?.chemicals ?? [],
            standards:
              parameter?.standards ?? [],
            internalStandards:
              parameter?.internalStandards ?? [],
            media:
              parameter?.media ?? [],
            preparations:
              parameter?.preparations ?? [],
            calculations:
              parameter?.calculations ?? [],
            files:
              parameter?.files ?? [],
          })
        ) as ParameterDetail[];

        
    const restoredInstruments: Record<number, WorksheetInstrument[]> = {};
    const restoredChemicals: Record<number, WorksheetChemical[]> = {};
    const restoredStandards: Record<number, WorksheetStandard[]> = {};
    const restoredAdditionalInfo: Record<number, string> = {};
    const restoredShowAdditionalInfo: Record<number, boolean> = {};
    const restoredBuffers: Record<number, BufferPreparation[]> = {};
    const restoredShowBuffer: Record<number, boolean> = {};
    const restoredMobiles: Record<number, MobilePhasePreparation[]> = {};
    const restoredShowMobile: Record<number, boolean> = {};
    const restoredDiluents: Record<number, DiluentPreparation[]> = {};
    const restoredShowDiluent: Record<number, boolean> = {};
    const restoredShowSystemSuitability: Record<number, boolean> = {};

    const restoredSuitabilities: Record<number, SystemSuitability[]> = {};
    const restoredParamFiles: Record<number, Record<string, AttachedFile[]>> = {};

    restoredParameters.forEach((parameter: any) => {
      const parameterId = parameter.id as number;
      // V1 stores System Suitability inside the generic
      // `preparations` collection using preparationCategory
      // `system_suitability`. Some older responses may also expose
      // systemSuitabilities/systemSuitability directly, so support both.
      const preparationsForParameter = Array.isArray(parameter?.preparations)
        ? parameter.preparations
        : [];

      const rawSuitabilitiesFromPreparations = preparationsForParameter
        .filter(
          (item: any) =>
            String(item?.preparationCategory ?? "").toLowerCase() ===
            "system_suitability"
        )
        .map((item: any, index: number) => {
          let steps = item?.steps;

          if (typeof steps === "string") {
            try {
              steps = JSON.parse(steps);
            } catch {
              steps = [];
            }
          }

          return {
            id: Number(item?.id ?? Date.now() + index),
            label: item?.label ?? `System Suitability ${index + 1}`,
            steps: Array.isArray(steps) ? steps : [],
          } as SystemSuitability;
        });

      const rawSuitabilities =
        rawSuitabilitiesFromPreparations.length > 0
          ? rawSuitabilitiesFromPreparations
          : (parameter?.systemSuitabilities ??
            parameter?.systemSuitability ??
            []);

      if (Array.isArray(rawSuitabilities)) {
        restoredSuitabilities[parameterId] =
          rawSuitabilities as SystemSuitability[];
      }

      if (Array.isArray(parameter?.files)) {
        restoredParamFiles[parameterId] = {
          [PARAM_LEVEL_KEY]: parameter.files.map((file: any) => ({
            id: typeof file?.id === "number" ? file.id : 0,
            fileName: file?.fileName ?? "",
            fileDataBase64: file?.fileDataBase64 ?? null,
            preparationType: file?.preparationType ?? null,
            label: file?.label ?? "Other Files",
          })),
        };
      }
    });

    setSystemSuitabilityPerParam(restoredSuitabilities);
    setFilesPerParam(restoredParamFiles);

    restoredParameters.forEach((parameter: ParameterDetail) => {
      restoredInstruments[parameter.id] = parameter.instruments ?? [];
      restoredChemicals[parameter.id] = parameter.chemicals ?? [];
      restoredStandards[parameter.id] = parameter.standards ?? [];

      restoredAdditionalInfo[parameter.id] =
        (parameter as any).additionalInfo ??
        (parameter as any).additional_info ??
        "";
      const restoredAdditionalInfoValue =
        (parameter as any).additionalInfo ??
        (parameter as any).additional_info ??
        (parameter as any).other_info ??
        "";

      restoredAdditionalInfo[parameter.id] =
        typeof restoredAdditionalInfoValue === "string"
          ? restoredAdditionalInfoValue
          : String(restoredAdditionalInfoValue ?? "");

      // If the API does not return the UI toggle flag, infer Active from
      // persisted text. This is required for the existing V1 backend
      // response, which returns additional_info but may omit the flag.
      restoredShowAdditionalInfo[parameter.id] =
        Boolean(
          (parameter as any).showAdditionalInfo ??
          (parameter as any).show_additional_info ??
          String(restoredAdditionalInfo[parameter.id]).trim().length > 0
        );

      const preparations = Array.isArray(parameter.preparations)
        ? parameter.preparations
        : [];

      const buffers = preparations
        .filter((item: any) => item?.preparationCategory === "buffer")
        .map((item: any, index: number) => ({
          id: Number(item?.id ?? Math.floor(Math.random() * 1000000) + index),
          label: item?.label ?? `Buffer Preparation ${index + 1}`,
          steps:
            typeof item?.steps === "string"
              ? (() => {
                  try {
                    return JSON.parse(item.steps);
                  } catch {
                    return [];
                  }
                })()
              : Array.isArray(item?.steps)
                ? item.steps
                : [],
        }));

      const mobiles = preparations
        .filter((item: any) => item?.preparationCategory === "mobile_phase")
        .map((item: any, index: number) => ({
          id: String(item?.id ?? `${parameter.id}-mobile-${index}`),
          label: item?.label ?? `Mobile Phase Preparation ${index + 1}`,
          content: item?.content ?? "",
        }));

      const diluents = preparations
        .filter((item: any) => item?.preparationCategory === "diluent")
        .map((item: any, index: number) => ({
          id: String(item?.id ?? `${parameter.id}-diluent-${index}`),
          label: item?.label ?? `Diluent Preparation ${index + 1}`,
          content: item?.content ?? "",
        }));

      restoredBuffers[parameter.id] = buffers;
      restoredShowBuffer[parameter.id] = buffers.length > 0;
      restoredMobiles[parameter.id] = mobiles;
      restoredShowMobile[parameter.id] = mobiles.length > 0;
      restoredDiluents[parameter.id] = diluents;
      restoredShowDiluent[parameter.id] = diluents.length > 0;

      restoredShowAdditionalInfo[parameter.id] =
        Boolean(
          (parameter as any).showAdditionalInfo ??
          (parameter as any).show_additional_info ??
          String(restoredAdditionalInfo[parameter.id] ?? "").trim().length > 0
        );

      restoredShowSystemSuitability[parameter.id] =
        Boolean(
          (parameter as any).showSystemSuitability ??
          (parameter as any).show_system_suitability ??
          (restoredSuitabilities[parameter.id] ?? []).length > 0
        );
    });

    setAddedInstruments(restoredInstruments);
    setAddedChemicals(restoredChemicals);
    setAddedStandards(restoredStandards);
    setAdditionalInfoPerParam(restoredAdditionalInfo);
    setShowAdditionalInfo(restoredShowAdditionalInfo);
    setBufferPreparationPerParam(restoredBuffers);
    setShowBufferPreparation(restoredShowBuffer);
    setMobilePhasePerParam(restoredMobiles);
    setShowMobilePhasePreparation(restoredShowMobile);
    setDiluentPreparationsPerParam(restoredDiluents);
    setShowDiluentPreparation(restoredShowDiluent);
    setShowSystemSuitability(restoredShowSystemSuitability);

    setAddedParameters(restoredParameters);

    // V1 behavior: after restoring a worksheet with parameters,
    // automatically open the first parameter. This also gives the
    // PreparationEngine a mounted parameter context so restored LOD
    // state can be displayed.
    setExpandedParameterId(
      restoredParameters.length > 0
        ? restoredParameters[0].id
        : null
    );
      } catch (err: any) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error loading worksheet:",
          err
        );

        setError(
          err?.message ??
            "Failed to load worksheet."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWorksheet();

    return () => {
      cancelled = true;
    };
  }, [worksheetId]);

  // ============================================================
  // BASIC WORKSHEET DATA
  // ============================================================

  const sample = worksheet?.sample;
  const sampleData = sample as any;

  const displayWorksheetId =
    typeof sample?.worksheetId === "string"
      ? sample.worksheetId
      : worksheetId;

  const displayLab =
    typeof sample?.lab === "string"
      ? sample.lab
      : lab ?? "Food Lab";

  const registrationNo =
    typeof sample?.registrationNo === "string"
      ? sample.registrationNo
      : "";

  const sampleName =
    typeof sample?.sampleName === "string"
      ? sample.sampleName
      : "";

  const worksheetStatus =
    typeof sample?.status === "string"
      ? sample.status
      : "Draft";

  const dueDate =
    typeof sampleData?.dueDate === "string"
      ? sampleData.dueDate
      : typeof sampleData?.due_date === "string"
        ? sampleData.due_date
        : "—";

  // ============================================================
  // PARAMETERS
  // ============================================================

  

  const parameterCount =
    addedParameters.length;

  // V1 filters the separately-loaded /sample-details catalogue
  // so parameters already on this worksheet are not offered again.
  const availableToAdd = useMemo(() => {
    return availableParameters.filter(
      (parameter) =>
        !addedParameters.some(
          (added) =>
            added.paraCode === parameter.paraCode
        )
    );
  }, [availableParameters, addedParameters]);

  // V1 selects the parameter whose card is currently expanded.
  // The overview is rendered below the parameter manager.
  const selectedParameter =
    expandedParameterId === null
      ? null
      : addedParameters.find(
          (parameter) => parameter.id === expandedParameterId
        ) ?? null;

  const normalizeSectionStatus = (value: string | null | undefined) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const normalizedRole = normalizeSectionStatus(
    localStorage.getItem("Role") ?? ""
  );

  const selectedParameterStatus = normalizeSectionStatus(
    selectedParameter?.status ?? "created"
  );

  const isAnalystRevisionStarted =
    normalizedRole === "analyst" &&
    selectedParameterStatus === "analysis revision started";

  const workflowPreparationLocked = Boolean(
    selectedParameter &&
      !isAnalystRevisionStarted &&
      [
        "analysis pending",
        "analysis completed",
        "analysis revision",
        "analysis revision started",
        "approved",
      ].includes(selectedParameterStatus)
  );

  const isPreparationLocked = Boolean(
    workflowPreparationLocked ||
    (selectedParameter && preparationLockedPerParam[selectedParameter.id])
  );

  const canUnlockPreparation =
    (normalizedRole === "reviewer" &&
      selectedParameterStatus === "created") ||
    (normalizedRole === "analyst" &&
      isAnalystRevisionStarted);

  const canEditCalculations =
    (normalizedRole === "reviewer" &&
      selectedParameterStatus === "created") ||
    (normalizedRole === "analyst" &&
      (
        selectedParameterStatus === "analysis started" ||
        isAnalystRevisionStarted
      ));

  const handleAddParameter = (parameter: SampleData) => {
    // V1 rule: never add the same parameter twice.
    if (
      addedParameters.some(
        (added) => added.paraCode === parameter.paraCode
      )
    ) {
      return;
    }

    // V1 rule: create the parameter first, but do NOT add it to
    // addedParameters until an analyst has been selected.
    const newParameter: ParameterDetail = {
      preparationCompletedBy: null,
      preparationCompletedAt: null,
      remarksByAnalyst: null,
      id: Math.floor(Math.random() * 1000000),
      paraCode: parameter.paraCode,
      parameterName: parameter.parameter,
      methodCode: parameter.methodCode,
      methodName: parameter.methodName,
      analyzedBy: null,
      approvedByReviewer: null,
      analyzedByName: null,
      approvedByReviewerName: null,
      analysisStartDate: null,
      analysisCompletionDate: null,
      analysisObservationDate: null,
      approvedAtReviewer: null,
      approvedByQAName: null,
      approvedByQA: null,
      approvedAtQA: null,
      remarksByReviewer: null,
      remarksByQA: null,
      submittedQaByName: null,
      submittedQaBy: null,
      status: "CREATED",
      additional_info: null,
      other_info: null,
      instruments: [],
      chemicals: [],
      standards: [],
      internalStandards: [],
      media: [],
      preparations: [],
      calculations: [],
      files: [],
    };

    setPendingParameter(newParameter);
    setShowAnalystDialog(true);
  };

  // V1 rule: the parameter is committed only after the analyst
  // selection is confirmed. Both employee ID and employee name
  // are stored on the parameter.
  const handleAnalystSelected = (
    employeeId: string,
    employeeName: string
  ) => {
    if (!pendingParameter) {
      return;
    }

    const parameter: ParameterDetail = {
      ...pendingParameter,
      analyzedBy: employeeId,
      analyzedByName: employeeName,
      status: "CREATED",
    };

    setAddedParameters((current) => [
      ...current,
      parameter,
    ]);

    setPendingParameter(null);
    setShowAnalystDialog(false);
  };

  const handleToggleParameter = (
    parameter: ParameterDetail
  ) => {
    setExpandedParameterId((current) =>
      current === parameter.id
        ? null
        : parameter.id
    );
  };

  const handleDeleteParameter = (
    parameter: ParameterDetail
  ) => {
    setAddedParameters((current) =>
      current.filter(
        (item) => item.id !== parameter.id
      )
    );

    setExpandedParameterId((current) =>
      current === parameter.id
        ? null
        : current
    );
  };


  // ============================================================
  // V1 reference-data section handlers
  // ============================================================

  const handleRemoveInstrument = (parameterId: number, instrumentId: string) => {
    setAddedInstruments((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (item) => item.instrumentId !== instrumentId
      ),
    }));
  };

  const handleAddInstrument = (instrument: WorksheetInstrument) => {
    const normalized: WorksheetInstrument = {
      ...instrument,
      calibrationDoneDate: instrument.calibrationDoneDate
        ? formatDate(instrument.calibrationDoneDate)
        : instrument.calibrationDoneDate,
      calibrationDueDate: instrument.calibrationDueDate
        ? formatDate(instrument.calibrationDueDate)
        : instrument.calibrationDueDate,
    };

    setAddedInstruments((prev) => ({
      ...prev,
      [instrument.parameterId]: [
        ...(prev[instrument.parameterId] || []),
        normalized,
      ],
    }));
    setShowInstrumentDropdown(false);
    setInstrumentSearch("");
  };

  const handleAddChemical = (chemical: WorksheetChemical) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [chemical.parameterId]: [
        ...(prev[chemical.parameterId] || []),
        chemical,
      ],
    }));
    setShowChemicalDropdown(false);
    setChemicalSearch("");
  };

  const handleRemoveChemical = (parameterId: number, chemicalId: string) => {
    setAddedChemicals((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (item) => item.slno !== chemicalId
      ),
    }));
  };

  const handleAddStandard = (standard: WorksheetStandard) => {
    setAddedStandards((prev) => ({
      ...prev,
      [standard.parameterId]: [
        ...(prev[standard.parameterId] || []),
        standard,
      ],
    }));
    setShowStandardDropdown(false);
    setStandardSearch("");
  };

  const handleRemoveStandard = (parameterId: number, standardId: string) => {
    setAddedStandards((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).filter(
        (item) => item.serialNo !== standardId
      ),
    }));
  };

  const createNewBufferPreparation = (index: number): BufferPreparation => ({
    id: Math.floor(Math.random() * 1000000),
    label: `Buffer Preparation ${index + 1}`,
    steps: [
      {
        name: "Weighing/Measuring",
        value1: "",
        unit1: "g",
        logBookID: "",
        solventChemical: "",
      },
      { name: "PH", value1: "", unit1: "", logBookID: "" },
    ],
  });

  const handleAddBufferPreparation = (parameterId: number) => {
    setBufferPreparationPerParam((prev) => {
      const current = prev[parameterId] || [];
      return {
        ...prev,
        [parameterId]: [
          ...current,
          createNewBufferPreparation(current.length),
        ],
      };
    });
  };

  const handleRemoveBufferPreparation = (
    parameterId: number,
    bufferPrepId: number
  ) => {
    setBufferPreparationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || [])
        .filter((item) => item.id !== bufferPrepId)
        .map((item, index) => ({
          ...item,
          label: `Buffer Preparation ${index + 1}`,
        })),
    }));
  };

  const handleBufferPreparationStepChange = (
    parameterId: number,
    bufferPrepId: number,
    stepName: string,
    field: "value1" | "unit1" | "logBookID" | "solventChemical",
    newValue: string
  ) => {
    setBufferPreparationPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || []).map((item) =>
        item.id !== bufferPrepId
          ? item
          : {
              ...item,
              steps: item.steps.map((step) =>
                step.name === stepName
                  ? { ...step, [field]: newValue }
                  : step
              ),
            }
      ),
    }));
  };

  const handleAddMobilePhase = (parameterId: number) => {
    setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: true }));
    setEditingMobilePhasePrepId(null);
  };

  const handleEditMobilePhase = (parameterId: number, id: string) => {
    setEditingMobilePhasePrepId(id);
    setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: true }));
  };

  const handleSaveMobilePhase = (
    parameterId: number,
    _label: string,
    content: string
  ) => {
    if (editingMobilePhasePrepId) {
      setMobilePhasePerParam((prev) => ({
        ...prev,
        [parameterId]: (prev[parameterId] || []).map((item) =>
          item.id === editingMobilePhasePrepId ? { ...item, content } : item
        ),
      }));
    } else {
      setMobilePhasePerParam((prev) => {
        const current = prev[parameterId] || [];
        return {
          ...prev,
          [parameterId]: [
            ...current,
            {
              id: String(Date.now()),
              label: `Mobile Phase Preparation ${current.length + 1}`,
              content,
            },
          ],
        };
      });
    }

    setShowMobilePhaseDialog((prev) => ({ ...prev, [parameterId]: false }));
    setEditingMobilePhasePrepId(null);
  };

  const handleRemoveMobilePhase = (parameterId: number, id: string) => {
    setMobilePhasePerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || [])
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          label: `Mobile Phase Preparation ${index + 1}`,
        })),
    }));
  };

  const handleAddDiluentPreparation = (parameterId: number) => {
    setShowDiluentPrepDialog((prev) => ({ ...prev, [parameterId]: true }));
    setEditingDiluentPrepId(null);
  };

  const handleEditDiluentPreparation = (parameterId: number, id: string) => {
    setEditingDiluentPrepId(id);
    setShowDiluentPrepDialog((prev) => ({ ...prev, [parameterId]: true }));
  };

  const handleSaveDiluentPreparation = (
    parameterId: number,
    _label: string,
    content: string
  ) => {
    if (editingDiluentPrepId) {
      setDiluentPreparationsPerParam((prev) => ({
        ...prev,
        [parameterId]: (prev[parameterId] || []).map((item) =>
          item.id === editingDiluentPrepId ? { ...item, content } : item
        ),
      }));
    } else {
      setDiluentPreparationsPerParam((prev) => {
        const current = prev[parameterId] || [];
        return {
          ...prev,
          [parameterId]: [
            ...current,
            {
              id: String(Date.now()),
              label: `Diluent Preparation ${current.length + 1}`,
              content,
            },
          ],
        };
      });
    }

    setShowDiluentPrepDialog((prev) => ({ ...prev, [parameterId]: false }));
    setEditingDiluentPrepId(null);
  };

  const handleRemoveDiluentPreparation = (parameterId: number, id: string) => {
    setDiluentPreparationsPerParam((prev) => ({
      ...prev,
      [parameterId]: (prev[parameterId] || [])
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          label: `Diluent Preparation ${index + 1}`,
        })),
    }));
  };

  const handleImportFromWorksheet = (
    parameterId: number,
    data: {
      instruments: WorksheetInstrument[];
      chemicals: WorksheetChemical[];
      standards: WorksheetStandard[];
    }
  ) => {
    if (!parameterId) return;

    setAddedInstruments((prev) => {
      const existing = new Set(
        (prev[parameterId] || []).map((item) => item.instrumentId)
      );
      return {
        ...prev,
        [parameterId]: [
          ...(prev[parameterId] || []),
          ...data.instruments.filter((item) => !existing.has(item.instrumentId)),
        ],
      };
    });

    setAddedChemicals((prev) => {
      const existing = new Set(
        (prev[parameterId] || []).map((item) => item.slno)
      );
      return {
        ...prev,
        [parameterId]: [
          ...(prev[parameterId] || []),
          ...data.chemicals.filter((item) => !existing.has(item.slno)),
        ],
      };
    });

    setAddedStandards((prev) => {
      const existing = new Set(
        (prev[parameterId] || []).map((item) => item.serialNo)
      );
      return {
        ...prev,
        [parameterId]: [
          ...(prev[parameterId] || []),
          ...data.standards.filter((item) => !existing.has(item.serialNo)),
        ],
      };
    });
  };


  // ============================================================
  // V1 REFERENCE-DATA / SECTION HANDLERS
  // ============================================================

  // ============================================================
  // V1 WORKSHEET INFORMATION
  // ============================================================

  const sampleParticulars =
    sampleName || "—";

  const testsRequired =
    addedParameters
      .map((parameter: any) => {
        return (
          parameter?.parameterName ||
          parameter?.name ||
          parameter?.parameter ||
          parameter?.parameterCode ||
          ""
        );
      })
      .filter(
        (value: string) =>
          String(value).trim().length > 0
      )
      .join(", ") || "—";

  const methodsRequired =
    addedParameters
      .map((parameter: any) => {
        return (
          parameter?.method ||
          parameter?.methodName ||
          parameter?.methodCode ||
          ""
        );
      })
      .filter(
        (value: string) =>
          String(value).trim().length > 0
      )
      .join(", ") || "No methods";

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleBack = () => {
    window.history.back();
  };

  /*
   * V1-compatible Save Draft.
   *
   * IMPORTANT: WorksheetDetails owns several parameter-local state
   * collections. Save must merge ALL of them into the single parameter
   * payload before calling the existing worksheet API.
   */
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftToast, setDraftToast] = useState<string | null>(null);

  const handleSaveDraft = async () => {
    if (!worksheet || !displayWorksheetId || isSavingDraft) return;

    setIsSavingDraft(true);
    setDraftToast(null);
    setSaveSuccess(false);

    try {
      const currentParameterId = expandedParameterId;

      let parameters = addedParameters.map((parameter: any) => {
        const parameterId = parameter.id as number;

        const parameterFiles = (
          filesPerParam[parameterId]?.[PARAM_LEVEL_KEY] ?? []
        )
          .map((file: any) =>
            toFilePayload(file, {
              parameterId,
              preparationType: "parameter_file",
              label: "Other Files",
            })
          )
          .filter((file: PersistedFilePayload | null): file is PersistedFilePayload => file !== null);

        const existingPreparations = Array.isArray(parameter.preparations)
          ? parameter.preparations
          : [];

        // Rebuild these V1 categories from their dedicated V2 state.
        // This prevents duplicates and guarantees edits/deletes are saved.
        const nonBufferPreparations = existingPreparations.filter(
          (item: any) =>
            String(item?.preparationCategory ?? "").toLowerCase() !== "buffer"
        );
        const nonMobilePreparations = nonBufferPreparations.filter(
          (item: any) =>
            String(item?.preparationCategory ?? "").toLowerCase() !== "mobile_phase"
        );
        const nonDiluentPreparations = nonMobilePreparations.filter(
          (item: any) =>
            String(item?.preparationCategory ?? "").toLowerCase() !== "diluent"
        );
        const nonSystemPreparations = nonDiluentPreparations.filter(
          (item: any) =>
            String(item?.preparationCategory ?? "").toLowerCase() !==
            "system_suitability"
        );

        const sectionPreparations: any[] = [];

        (bufferPreparationPerParam[parameterId] ?? []).forEach(
          (buffer: any) => {
            sectionPreparations.push({
              id: typeof buffer?.id === "number" ? buffer.id : undefined,
              label: buffer?.label,
              preparationCategory: "buffer",
              preparationType: null,
              assignedStandardId: null,
              steps: JSON.stringify(buffer?.steps ?? []),
              content: null,
            });
          }
        );

        (mobilePhasePerParam[parameterId] ?? []).forEach(
          (mobile: any) => {
            sectionPreparations.push({
              id: mobile?.id,
              label: mobile?.label,
              preparationCategory: "mobile_phase",
              preparationType: null,
              assignedStandardId: null,
              steps: null,
              content: mobile?.content ?? "",
            });
          }
        );

        (diluentPreparationsPerParam[parameterId] ?? []).forEach(
          (diluent: any) => {
            sectionPreparations.push({
              id: diluent?.id,
              label: diluent?.label,
              preparationCategory: "diluent",
              preparationType: null,
              assignedStandardId: null,
              steps: null,
              content: diluent?.content ?? "",
            });
          }
        );

        (systemSuitabilityPerParam[parameterId] ?? []).forEach(
          (suitability: SystemSuitability) => {
            sectionPreparations.push({
              id: suitability.id,
              label: suitability.label,
              preparationCategory: "system_suitability",
              preparationType: null,
              assignedStandardId: null,
              steps: JSON.stringify(suitability.steps ?? []),
              content: null,
            });
          }
        );

        return {
          ...parameter,
          instruments:
            addedInstruments[parameterId] ?? parameter.instruments ?? [],
          chemicals:
            addedChemicals[parameterId] ?? parameter.chemicals ?? [],
          standards:
            addedStandards[parameterId] ?? parameter.standards ?? [],
          internalStandards: parameter.internalStandards ?? [],
          media: parameter.media ?? [],

          additional_info:
            additionalInfoPerParam[parameterId] ??
            parameter.additional_info ??
            parameter.additionalInfo ??
            null,
          additionalInfo:
            additionalInfoPerParam[parameterId] ??
            parameter.additionalInfo ??
            parameter.additional_info ??
            null,
          other_info:
            parameter.other_info ??
            parameter.otherInfo ??
            null,
          showAdditionalInfo:
            showAdditionalInfo[parameterId] ??
            Boolean(
              parameter.showAdditionalInfo ??
              parameter.show_additional_info ??
              String(
                additionalInfoPerParam[parameterId] ??
                parameter.additional_info ??
                ""
              ).trim()
            ),
          showSystemSuitability:
            showSystemSuitability[parameterId] ??
            (systemSuitabilityPerParam[parameterId] ?? []).length > 0,

          preparations: [
            ...nonSystemPreparations,
            ...sectionPreparations,
          ],

          // Always rebuild parameter-level files from V2 state.
          // This also persists deleting the last parameter file.
          files: [
            ...((parameter.files ?? []) as any[]).filter(
              (file: any) =>
                String(file?.preparationType ?? "").toLowerCase() !==
                "parameter_file"
            ),
            ...parameterFiles,
          ],
        };
      });

      // ============================================================
      // CURRENT PREPARATION ENGINE MODULE
      // ============================================================
      // LOD currently lives inside Core PreparationEngine. Collect its
      // draft only for the expanded parameter and merge it with all the
      // other parameter-local sections above.
      if (currentParameterId !== null && preparationEngineRef.current) {
        const preparationDraft = preparationEngineRef.current.collectDraft();
        const modules = (preparationDraft?.modules ?? {}) as Record<string, any>;

        // PreparationEngine.collectDraft() stores the result of each
        // module's getDraft(). The current LOD module itself returns a
        // module-shaped draft, so support both shapes here:
        //   modules["food.lod"] = { samplePreparations, ... }
        // and
        //   modules["food.lod"] = { activeGroups, modules: { "food.lod": {...} } }
        const rawLod = modules["food.lod"] ?? modules["lod"];
        const lod =
          rawLod?.modules?.["food.lod"] ??
          rawLod?.modules?.lod ??
          rawLod;

        if (lod && (
          Array.isArray(lod.samplePreparations) ||
          Array.isArray(lod.calculations) ||
          Array.isArray(lod.files)
        )) {
          const mappedPreparations = (lod.samplePreparations ?? []).map(
            (sample: any) => ({
              label: sample?.label,
              preparationCategory: "sample",
              preparationType: "lod",
              assignedStandardId: null,
              steps: JSON.stringify(sample?.steps ?? []),
              content: null,
              isPreparationCompleted: Boolean(lod?.completed),
              completedAt: lod?.completedAt ?? null,
            })
          );

          const mappedFiles = (lod.files ?? [])
            .map((file: any) =>
              toFilePayload(file, {
                id:
                  typeof file?.id === "number"
                    ? file.id
                    : 0,
                parameterId: currentParameterId,
                preparationType: "lod",
                label: "Preparation Files",
                fileName: file?.name ?? file?.fileName ?? "",
              })
            )
            .filter((file: PersistedFilePayload | null): file is PersistedFilePayload => file !== null);

          const mappedCalculations = (lod.calculations ?? []).map(
            (calculation: any) => ({
              label: calculation?.label,
              calculationType: "lod",
              data: calculation,
            })
          );

          parameters = parameters.map((parameter: any) => {
            if (parameter.id !== currentParameterId) return parameter;

            const existingPreparations = Array.isArray(parameter.preparations)
              ? parameter.preparations
              : [];
            const existingFiles = Array.isArray(parameter.files)
              ? parameter.files
              : [];
            const existingCalculations = Array.isArray(parameter.calculations)
              ? parameter.calculations
              : [];

            return {
              ...parameter,
              preparations: [
                ...existingPreparations.filter(
                  (item: any) =>
                    String(item?.preparationType ?? "").toLowerCase() !==
                    "lod"
                ),
                ...mappedPreparations,
              ],
              calculations: [
                ...existingCalculations.filter(
                  (item: any) =>
                    String(item?.calculationType ?? "").toLowerCase() !==
                    "lod"
                ),
                ...mappedCalculations,
              ],
              files: [
                ...existingFiles.filter(
                  (item: any) =>
                    String(item?.preparationType ?? "").toLowerCase() !==
                    "lod"
                ),
                ...mappedFiles,
              ],
              preparationCompletedAt:
                lod?.completedAt ?? parameter.preparationCompletedAt ?? null,
            };
          });
        }
      }

      // Keep the payload strictly compatible with WorksheetRequest.
      // Some WorksheetDetail variants expose natureOfSample/dueDate as
      // unknown-ish values, while WorksheetRequest expects strings.
      const natureOfSample =
        typeof worksheet.sample?.natureOfSample === "string"
          ? worksheet.sample.natureOfSample
          : undefined;

      const dueDate =
        typeof worksheet.sample?.dueDate === "string"
          ? worksheet.sample.dueDate
          : undefined;

      const payload = {
        role: localStorage.getItem("Role") ?? "",
        worksheetId: displayWorksheetId,
        registrationInfo: {
          registrationNo:
            typeof worksheet.sample?.registrationNo === "string"
              ? worksheet.sample.registrationNo
              : "",
          sampleName:
            typeof worksheet.sample?.sampleName === "string"
              ? worksheet.sample.sampleName
              : "",
          sampleCode:
            typeof worksheet.sample?.sampleCode === "string"
              ? worksheet.sample.sampleCode
              : "",
          sampleQuantity: Number(worksheet.sample?.sampleQuantity ?? 0),
          natureOfSample,
          numberOfParameters: parameters.length,
          dueDate,
          lab:
            typeof worksheet.sample?.lab === "string"
              ? worksheet.sample.lab
              : displayLab,
        },
        documentInfo: {
          status:
            typeof worksheet.sample?.status === "string"
              ? worksheet.sample.status
              : "Draft",
        },
        parameters,
      };

      const response = await worksheetService.update(
        displayWorksheetId,
        payload
      );

      if (!response?.worksheetId && response !== undefined) {
        // Some deployments return an empty 204-like body. A successful
        // HTTP response is still treated as success by worksheetService.
      }

      // Refresh only the worksheet container. The local parameter state is
      // deliberately preserved so the just-entered UI does not disappear
      // while the backend response is being normalized.
      const refreshed = await worksheetService.getById(displayWorksheetId, {
        employeeId: localStorage.getItem("EmployeeId") ?? "",
        role: localStorage.getItem("Role") ?? "",
      });
      if (refreshed) setWorksheet(refreshed);

      setSaveSuccess(true);
      setDraftToast(`Draft saved successfully: ${displayWorksheetId}`);
    } catch (error: any) {
      console.error("Save draft error:", error);
      setSaveSuccess(false);
      setDraftToast(
        error?.message ?? "Failed to save worksheet."
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  // ============================================================
  // SHELL
  // ============================================================

  // ============================================================
  // WORKSHEET ACTION VISIBILITY
  //
  // These rules are worksheet-level workflow rules.
  //
  // IMPORTANT:
  // They do NOT depend on LOD, Protein, Assay, Preparation
  // Management, or any preparation-specific implementation.
  //
  // V1-aligned workflow:
  //
  //   Draft
  //      -> Reviewer assigns analyst(s)
  //      -> Submit for Analysis
  //
  //   Submitted For Analysis
  //      -> parameters move through analysis/reviewer approval
  //      -> all parameters Approved
  //      -> Submit for QA Review
  //
  //   Submitted For QA Review
  //      -> QA validates/approves worksheet
  //      -> Approved
  //      -> Print Report
  //
  // The click/API implementations are intentionally NOT connected
  // at this migration stage.
  // ============================================================

  const normalizeStatus = (value: string | null | undefined) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const normalizedWorksheetStatus =
    normalizeStatus(worksheetStatus);

  const areAllParametersApproved =
    addedParameters.length > 0 &&
    addedParameters.every(
      (parameter) =>
        normalizeStatus(parameter.status) === "approved"
    );

  // Save Draft remains available until the worksheet is finally
  // approved.
  const showSaveDraft =
    normalizedWorksheetStatus !== "approved";

  // V1:
  // - Reviewer only
  // - worksheet must be Draft or already Submitted For Analysis
  // - at least one newly-created parameter must exist
  //
  // A parameter only enters addedParameters in our current V2 flow
  // after analyst selection, so this also satisfies the requirement
  // that an analyst has been assigned.
  const showSubmitForAnalysis =
    normalizedRole === "reviewer" &&
    (
      normalizedWorksheetStatus === "draft" ||
      normalizedWorksheetStatus === "submitted for analysis"
    ) &&
    addedParameters.some(
      (parameter) =>
        normalizeStatus(parameter.status) === "created"
    );

  // V1:
  // Submit for QA Review must NOT appear immediately after
  // Submit for Analysis. It appears only after every parameter
  // has been Reviewer-approved.
  const showSubmitForQA =
    normalizedRole === "reviewer" &&
    normalizedWorksheetStatus === "submitted for analysis" &&
    areAllParametersApproved;

  // V1:
  // QA can approve the worksheet only while it is waiting for
  // QA validation.
  const showApproveWorksheet =
    normalizedRole === "qa" &&
    normalizedWorksheetStatus === "submitted for qa review";

  // V1:
  // Print Report is available ONLY after QA has approved the
  // worksheet and the worksheet status is Approved.
  const showPrintReport =
    normalizedWorksheetStatus === "approved";

  // ============================================================
  // ACTION STATE
  //
  // The actual persistence/workflow implementations will be
  // connected to the V2 workflow layer later.
  //
  // For this migration stage we deliberately do NOT make fake
  // API calls. The buttons and their correct visibility are
  // implemented now.
  // ============================================================

  const isSaving = isSavingDraft;
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!draftToast) return;

    const timer = window.setTimeout(() => {
      setDraftToast(null);
      setSaveSuccess(false);
    }, saveSuccess ? 3000 : 4000);

    return () => window.clearTimeout(timer);
  }, [draftToast, saveSuccess]);

  const [isSubmitting] = useState(false);
  const [isSubmittingForQA] = useState(false);
  const [isApprovingWorksheet] = useState(false);

  const handleSubmitForAnalysis = () => {
    console.log(
      "Submit for Analysis requested:",
      displayWorksheetId
    );
  };

  const handleSubmitForQA = () => {
    console.log(
      "Submit for QA Review requested:",
      displayWorksheetId
    );
  };

  const handleApproveWorksheet = () => {
    console.log(
      "Approve Worksheet requested:",
      displayWorksheetId
    );
  };

  const handlePrintReport = () => {
    console.log(
      "Print Report requested:",
      displayWorksheetId
    );
  };

  const shellProps = {
    worksheetId: displayWorksheetId,
    status: worksheetStatus,
    role: localStorage.getItem("Role") ?? "",
    registrationNo,
    sampleName,

    onBack: handleBack,
    onSaveDraft: handleSaveDraft,

    isSaving,
    saveSuccess,
    isSubmitting,
    isSubmittingForQA,
    isApprovingWorksheet,

    showSaveDraft,
    showSubmitForAnalysis,
    showSubmitForQA,
    showApproveWorksheet,
    showPrintReport,

    onSubmitForAnalysis: handleSubmitForAnalysis,
    onSubmitForQA: handleSubmitForQA,
    onApproveWorksheet: handleApproveWorksheet,
    onPrintReport: handlePrintReport,
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <WorksheetShell {...shellProps}>
        <div
          className="
            min-h-full
            bg-[#10182d]
            px-4
            py-8
            md:px-6
          "
        >
          <div
            className="
              mx-auto
              max-w-[1000px]
              rounded-[14px]
              bg-white
              p-10
              text-center
              shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            "
          >
            <div
              className="
                text-[14px]
                font-semibold
                text-slate-700
              "
            >
              Loading worksheet...
            </div>
          </div>
        </div>
      </WorksheetShell>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !worksheet) {
    return (
      <WorksheetShell {...shellProps}>
        <div
          className="
            min-h-full
            bg-[#10182d]
            px-4
            py-8
            md:px-6
          "
        >
          <div
            className="
              mx-auto
              max-w-[1000px]
              rounded-[14px]
              bg-white
              p-8
              shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            "
          >
            <h1
              className="
                text-[21px]
                font-bold
                text-red-700
              "
            >
              Unable to load worksheet
            </h1>

            <p
              className="
                mt-3
                text-[13px]
                text-slate-600
              "
            >
              {error ?? "Worksheet not found."}
            </p>
          </div>
        </div>
      </WorksheetShell>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <WorksheetShell {...shellProps}>
      <div
        className="
          min-h-full
          bg-[#10182d]
          px-4
          py-6
          md:px-6
          md:py-8
        "
      >
        {/* ======================================================
            V1 MAIN WHITE WORKSHEET CARD
           ====================================================== */}

        <div
          className="
            mx-auto
            max-w-[1000px]
            rounded-[14px]
            bg-white
            px-7
            pb-10
            pt-7
            shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            md:px-8
          "
        >

        <FoodWorksheetHeader
            worksheetId={displayWorksheetId}
            registrationNo={registrationNo}
            sampleName={sampleName}
            parameterCount={parameterCount}
            dueDate={dueDate}
            displayStatus={worksheetStatus}
        />

          {/* ====================================================
              V1 WORKSHEET INFORMATION
             ==================================================== */}

          <FoodWorksheetInfo
            sampleName={sampleParticulars}
            parameterName={testsRequired}
            methodName={methodsRequired}
          />

          {/* ====================================================
              FOOD PARAMETER MANAGEMENT

              V1 parameter-management behavior is now handled by
              the Food plugin component. Preparation Management is
              intentionally excluded from this migration phase.
             ==================================================== */}

          <FoodParameterManager
            parameterCount={parameterCount}
            addedParameters={addedParameters}
            availableParameters={availableToAdd}
            expandedParameterId={expandedParameterId}
            worksheetStatus={worksheetStatus}
            role={localStorage.getItem("Role") ?? ""}
            onAddParameter={handleAddParameter}
            onToggleParameter={handleToggleParameter}
            onDeleteParameter={handleDeleteParameter}
          />

          {/* ====================================================
              V1 PARAMETER OVERVIEW

              Shown when the user clicks CLICK TO VIEW on a
              parameter card. Closing the overview collapses the
              same parameter card.
             ==================================================== */}

          {selectedParameter && (
            <FoodParameterOverview
              parameter={selectedParameter}
              onClose={() => setExpandedParameterId(null)}
              role={localStorage.getItem("Role") ?? ""}
              isReviewerApprovedForQA={
                ["reviewer", "qa"].includes(
                  (localStorage.getItem("Role") ?? "").toLowerCase()
                ) &&
                (selectedParameter.status ?? "")
                  .trim()
                  .toLowerCase() === "approved" &&
                [
                  "submitted for qa review",
                  "pending qa validation",
                ].includes(
                  (worksheetStatus ?? "")
                    .trim()
                    .toLowerCase()
                )
              }
              approvedByReviewer={
                selectedParameter.approvedByReviewer ?? null
              }
              approvedByReviewerName={
                selectedParameter.approvedByReviewerName ?? null
              }
              reviewerRemarks={
                selectedParameter.remarksByReviewer ?? null
              }
              analystComment={
                selectedParameter.remarksByAnalyst ?? null
              }
            />
          )}


          {selectedParameter && (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  disabled={isPreparationLocked}
                  onClick={() => setShowCopyWorksheetDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-400 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-sm text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy from Worksheet
                </button>
              </div>

              <FoodInstrumentSection
                isLocked={isPreparationLocked}
                role={localStorage.getItem("Role") ?? ""}
                parameterId={selectedParameter.id}
                instruments={instruments ?? []}
                addedInstruments={addedInstruments}
                showInstrumentDropdown={showInstrumentDropdown}
                instrumentSearch={instrumentSearch}
                searchFilteredInstruments={searchFilteredInstruments}
                instrumentRef={instrumentRef}
                isReferenceDataLoading={isReferenceDataLoading}
                referenceDataError={referenceDataError}
                formatDate={formatDate}
                onToggleDropdown={() =>
                  setShowInstrumentDropdown((value) => !value)
                }
                onSearch={setInstrumentSearch}
                onAddInstrument={handleAddInstrument}
                onRemoveInstrument={(instrumentId) =>
                  handleRemoveInstrument(
                    selectedParameter.id,
                    instrumentId
                  )
                }
              />

              <FoodChemicalSection
                isLocked={isPreparationLocked}
                role={localStorage.getItem("Role") ?? ""}
                parameterId={selectedParameter.id}
                chemicals={chemicals ?? []}
                addedChemicals={addedChemicals}
                showChemicalDropdown={showChemicalDropdown}
                chemicalSearch={chemicalSearch}
                searchFilteredChemicals={searchFilteredChemicals}
                chemicalRef={chemicalRef}
                isReferenceDataLoading={isReferenceDataLoading}
                referenceDataError={referenceDataError}
                formatDate={formatDate}
                onToggleDropdown={() =>
                  setShowChemicalDropdown((value) => !value)
                }
                onSearch={setChemicalSearch}
                onAddChemical={handleAddChemical}
                onRemoveChemical={(chemicalId) =>
                  handleRemoveChemical(
                    selectedParameter.id,
                    chemicalId
                  )
                }
              />

              <FoodStandardSection
                isLocked={isPreparationLocked}
                role={localStorage.getItem("Role") ?? ""}
                parameterId={selectedParameter.id}
                standards={standards ?? []}
                addedStandards={addedStandards}
                showStandardDropdown={showStandardDropdown}
                standardSearch={standardSearch}
                searchFilteredStandards={searchFilteredStandards}
                standardRef={standardRef}
                isReferenceDataLoading={isReferenceDataLoading}
                referenceDataError={referenceDataError}
                formatDate={formatDate}
                onToggleDropdown={() =>
                  setShowStandardDropdown((value) => !value)
                }
                onSearch={setStandardSearch}
                onAddStandard={handleAddStandard}
                onRemoveStandard={(standardId) =>
                  handleRemoveStandard(
                    selectedParameter.id,
                    standardId
                  )
                }
              />

              <FoodAdditionalInfo
                parameterId={selectedParameter.id}
                enabled={
                  showAdditionalInfo[selectedParameter.id] ?? false
                }
                value={
                  additionalInfoPerParam[selectedParameter.id] ?? ""
                }
                isLocked={isPreparationLocked}
                onToggle={(checked) => {
                  if (isPreparationLocked) return;

                  setShowAdditionalInfo((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }));

                  if (!checked) {
                    setAdditionalInfoPerParam((prev) => ({
                      ...prev,
                      [selectedParameter.id]: "",
                    }));
                  }
                }}
                onChange={(value) => {
                  if (isPreparationLocked) return;

                  setAdditionalInfoPerParam((prev) => ({
                    ...prev,
                    [selectedParameter.id]: value,
                  }));
                }}
              />

              <FoodBufferPreparation
                isLocked={isPreparationLocked}
                parameterId={selectedParameter.id}
                enabled={
                  showBufferPreparation[selectedParameter.id] ?? false
                }
                buffers={
                  bufferPreparationPerParam[selectedParameter.id] ?? []
                }
                onToggle={(checked) => {
                  if (isPreparationLocked) return;

                  setShowBufferPreparation((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }));

                  if (!checked) {
                    setBufferPreparationPerParam((prev) => ({
                      ...prev,
                      [selectedParameter.id]: [],
                    }));
                  }
                }}
                onAdd={() =>
                  handleAddBufferPreparation(selectedParameter.id)
                }
                onRemove={(bufferId) =>
                  handleRemoveBufferPreparation(
                    selectedParameter.id,
                    bufferId
                  )
                }
                onStepChange={(
                  bufferId,
                  stepName,
                  field,
                  value
                ) =>
                  handleBufferPreparationStepChange(
                    selectedParameter.id,
                    bufferId,
                    stepName,
                    field,
                    value
                  )
                }
              />

              <FoodMobilePhasePreparation
                isLocked={isPreparationLocked}
                parameterId={selectedParameter.id}
                enabled={
                  showMobilePhasePreparation[
                    selectedParameter.id
                  ] ?? false
                }
                mobilePhases={
                  mobilePhasePerParam[selectedParameter.id] ?? []
                }
                onToggle={(checked) => {
                  if (isPreparationLocked) return;

                  setShowMobilePhasePreparation((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }));
                }}
                onAdd={() =>
                  handleAddMobilePhase(selectedParameter.id)
                }
                onEdit={(id) =>
                  handleEditMobilePhase(
                    selectedParameter.id,
                    id
                  )
                }
                onRemove={(id) =>
                  handleRemoveMobilePhase(
                    selectedParameter.id,
                    id
                  )
                }
              />

              <AnimatePresence>
                {showMobilePhaseDialog[selectedParameter.id] && (
                  <PreparationEditorDialog
                    title={
                      editingMobilePhasePrepId
                        ? (
                            mobilePhasePerParam[
                              selectedParameter.id
                            ] ?? []
                          ).find(
                            (item) =>
                              item.id ===
                              editingMobilePhasePrepId
                          )?.label ??
                          "Mobile Phase Preparation"
                        : `Mobile Phase Preparation ${
                            (
                              mobilePhasePerParam[
                                selectedParameter.id
                              ] ?? []
                            ).length + 1
                          }`
                    }
                    onClose={() => {
                      setShowMobilePhaseDialog((prev) => ({
                        ...prev,
                        [selectedParameter.id]: false,
                      }));
                      setEditingMobilePhasePrepId(null);
                    }}
                    onSave={(content) =>
                      handleSaveMobilePhase(
                        selectedParameter.id,
                        "",
                        content
                      )
                    }
                    existingContent={
                      editingMobilePhasePrepId
                        ? (
                            mobilePhasePerParam[
                              selectedParameter.id
                            ] ?? []
                          ).find(
                            (item) =>
                              item.id ===
                              editingMobilePhasePrepId
                          )?.content
                        : undefined
                    }
                  />
                )}
              </AnimatePresence>

              <FoodDiluentPreparation
                isLocked={isPreparationLocked}
                parameterId={selectedParameter.id}
                enabled={
                  showDiluentPreparation[
                    selectedParameter.id
                  ] ?? false
                }
                diluentPreparations={
                  diluentPreparationsPerParam[
                    selectedParameter.id
                  ] ?? []
                }
                onToggle={(checked) => {
                  if (isPreparationLocked) return;

                  setShowDiluentPreparation((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }));
                }}
                onAdd={() =>
                  handleAddDiluentPreparation(
                    selectedParameter.id
                  )
                }
                onEdit={(id) =>
                  handleEditDiluentPreparation(
                    selectedParameter.id,
                    id
                  )
                }
                onRemove={(id) =>
                  handleRemoveDiluentPreparation(
                    selectedParameter.id,
                    id
                  )
                }
              />

              <AnimatePresence>
                {showDiluentPrepDialog[selectedParameter.id] && (
                  <PreparationEditorDialog
                    title={
                      editingDiluentPrepId
                        ? (
                            diluentPreparationsPerParam[
                              selectedParameter.id
                            ] ?? []
                          ).find(
                            (item) =>
                              item.id === editingDiluentPrepId
                          )?.label ??
                          "Diluent Preparation"
                        : `Diluent Preparation ${
                            (
                              diluentPreparationsPerParam[
                                selectedParameter.id
                              ] ?? []
                            ).length + 1
                          }`
                    }
                    onClose={() => {
                      setShowDiluentPrepDialog((prev) => ({
                        ...prev,
                        [selectedParameter.id]: false,
                      }));
                      setEditingDiluentPrepId(null);
                    }}
                    onSave={(content) =>
                      handleSaveDiluentPreparation(
                        selectedParameter.id,
                        "",
                        content
                      )
                    }
                    existingContent={
                      editingDiluentPrepId
                        ? (
                            diluentPreparationsPerParam[
                              selectedParameter.id
                            ] ?? []
                          ).find(
                            (item) =>
                              item.id === editingDiluentPrepId
                          )?.content
                        : undefined
                    }
                  />
                )}
              </AnimatePresence>

              <CopyFromWorksheetDialog
                isOpen={showCopyWorksheetDialog}
                onClose={() =>
                  setShowCopyWorksheetDialog(false)
                }
                currentWorksheetId={worksheetId}
                sampleName={sampleName}
                targetParameterId={selectedParameter.id}
                fetchRequest={{
                  employeeId:
                    localStorage.getItem("EmployeeId") ?? "",
                  role:
                    localStorage.getItem("Role") ?? "",
                }}
                includeStandards={true}
                existingInstrumentIds={(
                  addedInstruments[selectedParameter.id] ?? []
                )
                  .map((item) => item.instrumentId)
                  .filter(
                    (id): id is string => Boolean(id)
                  )}
                existingChemicalIds={(
                  addedChemicals[selectedParameter.id] ?? []
                )
                  .map((item) => item.slno)
                  .filter(
                    (id): id is string => Boolean(id)
                  )}
                existingStandardIds={(
                  addedStandards[selectedParameter.id] ?? []
                )
                  .map((item) => item.serialNo)
                  .filter(
                    (id): id is string => Boolean(id)
                  )}
                onImport={(data) =>
                  handleImportFromWorksheet(
                    selectedParameter.id,
                    data
                  )
                }
              />

              <PreparationEngine
                key={selectedParameter.id}
                registry={foodPreparationModuleRegistry}
                parameterId={selectedParameter.id}
                parameterName={selectedParameter.parameterName}
                parameterCode={selectedParameter.paraCode}
                role={localStorage.getItem("Role") ?? ""}
                isLocked={isPreparationLocked}
                canUnlockPreparation={canUnlockPreparation}
                canEditCalculations={canEditCalculations}
                worksheet={selectedParameter}
                ref={preparationEngineRef}
                onLockPreparation={(parameterId) => {
                  if (parameterId !== selectedParameter.id) return;
                  setPreparationLockedPerParam(prev => ({ ...prev, [parameterId]: true }));
                }}
                onUnlockPreparation={(parameterId) => {
                  if (parameterId !== selectedParameter.id) return;
                  setPreparationLockedPerParam(prev => ({ ...prev, [parameterId]: false }));
                }}
              />
            </>
          )}


          {selectedParameter && (
            <>
              <FoodSystemSuitability
                parameterId={selectedParameter.id}
                enabled={
                  showSystemSuitability[selectedParameter.id] || false
                }
                systemSuitabilities={
                  systemSuitabilityPerParam[selectedParameter.id] || []
                }
                onToggle={(checked) =>
                  setShowSystemSuitability((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }))
                }
                onAdd={() =>
                  handleAddSystemSuitability(selectedParameter.id)
                }
                onRemove={(id) =>
                  handleRemoveSystemSuitability(
                    selectedParameter.id,
                    id
                  )
                }
                onStepChange={(
                  suitabilityId,
                  stepName,
                  field,
                  value
                ) =>
                  handleSystemSuitabilityStepChange(
                    selectedParameter.id,
                    suitabilityId,
                    stepName,
                    field,
                    value
                  )
                }
                onAddStep={(
                  suitabilityId,
                  stepName,
                  limitType
                ) =>
                  handleAddSystemSuitabilityStep(
                    selectedParameter.id,
                    suitabilityId,
                    stepName,
                    limitType
                  )
                }
                onRemoveStep={(
                  suitabilityId,
                  stepName
                ) =>
                  handleRemoveSystemSuitabilityStep(
                    selectedParameter.id,
                    suitabilityId,
                    stepName
                  )
                }
                isLocked={false}
              />

              <FoodParameterFiles
                parameterId={selectedParameter.id}
                enabled={
                  Boolean(
                    getParamLevelFiles(selectedParameter.id).length > 0 ||
                    showParamFilesForParameter(
                      selectedParameter.id
                    )
                  )
                }
                files={getParamLevelFiles(selectedParameter.id)}
                onToggle={(checked) => {
                  setShowParamFiles((prev) => ({
                    ...prev,
                    [selectedParameter.id]: checked,
                  }));

                  if (!checked) {
                    updateFilesForSlot(
                      selectedParameter.id,
                      PARAM_LEVEL_KEY,
                      () => []
                    );
                  }
                }}
                onAdd={(newFiles) =>
                  handleAddParamFiles(
                    selectedParameter.id,
                    newFiles
                  )
                }
                onRemove={(index) =>
                  handleRemoveParamFile(
                    selectedParameter.id,
                    index
                  )
                }
                isLocked={false}
              />
            </>
          )}

          <AnalystSelectionDialog
            isOpen={showAnalystDialog}
            onClose={() => {
              setShowAnalystDialog(false);
              setPendingParameter(null);
            }}
            analysts={analysts}
            onSelectAnalyst={handleAnalystSelected}
            lab={displayLab}
          />

          {draftToast &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-[99999] pointer-events-none"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="absolute right-6 top-6 pointer-events-auto">
                  <div
                    className={`relative w-[390px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.20)] ${
                      saveSuccess
                        ? "border-l-4 border-l-emerald-500"
                        : "border-l-4 border-l-red-500"
                    }`}
                  >
                    <div className="flex min-h-[72px] items-center gap-3 px-4 py-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          saveSuccess
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {saveSuccess ? (
                          <CheckCircle2 size={19} strokeWidth={2.4} />
                        ) : (
                          <X size={19} strokeWidth={2.4} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`m-0 text-[13px] font-semibold leading-5 ${
                            saveSuccess ? "text-slate-800" : "text-red-700"
                          }`}
                        >
                          {draftToast}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDraftToast(null);
                          setSaveSuccess(false);
                        }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close notification"
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    </div>

                    <div
                      className={`h-[3px] w-full origin-left ${
                        saveSuccess ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        animation: `${
                          saveSuccess
                            ? "worksheetDraftToastProgress 3s linear forwards"
                            : "worksheetDraftToastProgress 4s linear forwards"
                        }`,
                      }}
                    />
                  </div>
                </div>

                <style>{`
                  @keyframes worksheetDraftToastProgress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                  }
                `}</style>
              </div>,
              document.body
            )}

        </div>
      </div>
    </WorksheetShell>
  );
}