import { forwardRef, useImperativeHandle, useState } from "react";
import { BiTestTube } from "react-icons/bi";
import { ChevronUp, Droplets, Trash2 } from "lucide-react";
import CustomDropdown from "../../../../../shared/CustomDropdown";
import type { PreparationModuleHandle } from "../../../../../core/preparation/ui/PreparationModuleHandle";
import type { PreparationDraft } from "../../../../../core/preparation/ui/PreparationDraft";
import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";
import type { CalculationLod } from "../models/CalculationLod";
import SamplePreparationSection from "../../../../../core/preparation-engine/components/SamplePreparationSection";
import FileAttachmentSection, { type PreparationAttachedFile } from "../../../../../core/preparation-engine/components/FileAttachmentSection";
import PreparationCompleteSection from "../../../../../core/preparation-engine/components/PreparationCompleteSection";
import PreparationCompleteModal from "../../../../../core/preparation-engine/components/PreparationCompleteModal";
import UnlockPreparationDialog from "../../../../../core/preparation-engine/components/UnlockPreparationDialog";
import PreparationToast from "../../../../../core/preparation-engine/components/PreparationToast";
import LodCalculationSection from "./LodCalculationSection";

export interface LodPreparationModuleProps {
  preparationId: string;
  parameterId: number;
  parameterName?: string | null;
  parameterCode?: string | null;
  role: string;
  isLocked: boolean;
  canUnlockPreparation?: boolean;
  canEditCalculations?: boolean;
  onLockPreparation: (parameterId: number) => void;
  onUnlockPreparation: (parameterId: number) => void;
}

interface LodModuleData {
  samplePreparations: SamplePreparationLod[];
  files: PreparationAttachedFile[];
  calculations: CalculationLod[];
  completed: boolean;
  completedAt: string | null;
}
interface LodModuleDraft extends PreparationDraft { modules: Record<string, unknown>; }

const createDefaultPreparation = (id: number): SamplePreparationLod => ({
  id,
  label: `Sample Preparation ${id}`,
  steps: [
    { name: "Weight of Empty Dish", value1: "", unit1: "g", logBookID: "" },
    { name: "Weight of Sample + Dish", value1: "", unit1: "g" },
    { name: "Drying", value1: "", unit1: "°C", value2: "", unit2: "min", logBookID: "" },
    { name: "Weight of Sample + Dish after Drying", value1: "", unit1: "g" },
  ],
});
const createCalculation = (index: number): CalculationLod => ({
  id: Date.now() + index, label: `Calculation ${index + 1}`, selectedSamplePreparationLabel: null,
  w1_emptyDish: "", w2_dishWithSample: "", w3_dishAfterIgnition: "", calculationResult: null,
  calculationResultUnit: null, w1: null, w2: null, w3: null, acceptanceLimitMin: "", acceptanceLimitMax: "",
});
const parseSteps = (v: unknown): SamplePreparationLodStep[] => {
  if (Array.isArray(v)) return v as SamplePreparationLodStep[];
  if (typeof v !== "string") return [];
  try { const x = JSON.parse(v); return Array.isArray(x) ? x : []; } catch { return []; }
};

const Step = ({ step, locked, onChange }: { step: SamplePreparationLodStep; locked: boolean; onChange: (field: keyof SamplePreparationLodStep, value: string) => void }) => {
  const isDry = step.name === "Drying";
  const isW1 = step.name === "Weight of Empty Dish";
  const isW2 = step.name === "Weight of Sample + Dish";
  const isW3 = step.name === "Weight of Sample + Dish after Drying";
  const label = isW1 ? "Weight of Empty Dish" : isW2 ? "Weight of Sample + Dish" : isW3 ? "Weight of Sample + Dish after Drying" : step.name;
  return (
    <div className="relative bg-white rounded-xl border border-emerald-200/60 hover:border-emerald-300 transition-all duration-200 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-700 to-slate-800 rounded-full flex items-center justify-center shadow-md"><span className="text-white text-xs font-bold">{isW1 ? 1 : isW2 ? 2 : isDry ? 3 : 4}</span></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3"><div className="font-bold text-emerald-900 text-sm">{label}</div><div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" /></div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium">{isDry ? "Drying" : label}</span>
            <input type="text" value={step.value1 ?? ""} disabled={locked} placeholder={isDry ? "Enter Temp" : "Enter Weight"} onChange={e => onChange("value1", e.target.value)} className="w-[122px] px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-100" />
            <div className="w-20">
              <CustomDropdown
                options={(isDry ? ["°C", "°F", "K"] : ["g", "mg", "kg"]).map(x => ({ value: x, label: x }))}
                value={step.unit1 || (isDry ? "°C" : "g")}
                onChange={value => onChange("unit1", value)}
                colorScheme="emerald"
                disabled={locked}
              />
            </div>
            {isDry && <><span className="text-gray-500">for</span><input type="text" value={step.value2 ?? ""} disabled={locked} placeholder="Enter Time" onChange={e => onChange("value2", e.target.value)} className="w-[122px] px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs disabled:bg-gray-100" /><div className="w-20">
                <CustomDropdown
                  options={["min", "hr", "sec"].map(x => ({ value: x, label: x }))}
                  value={step.unit2 || "min"}
                  onChange={value => onChange("unit2", value)}
                  colorScheme="emerald"
                  disabled={locked}
                />
              </div></>}
            {(isW1 || isDry) && <><span className="text-gray-500">(Log ID:</span><input type="text" value={step.logBookID ?? ""} disabled={locked} placeholder="Enter ID" onChange={e => onChange("logBookID", e.target.value)} className="w-24 px-2.5 py-1.5 border border-emerald-300 rounded-lg text-xs disabled:bg-gray-100" /><span className="text-gray-500">)</span></>}
            {!isDry && <span className="text-gray-500">({isW1 ? "W1" : isW2 ? "W2" : isW3 ? "W3" : ""})</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const LodPreparationModule = forwardRef<PreparationModuleHandle<LodModuleDraft, unknown>, LodPreparationModuleProps>((props, ref) => {
  const { parameterId, parameterName, parameterCode, isLocked, canUnlockPreparation = false, canEditCalculations = false, onLockPreparation, onUnlockPreparation } = props;
  const [samplePreparations, setSamplePreparations] = useState<SamplePreparationLod[]>([]);
  const [files, setFiles] = useState<PreparationAttachedFile[]>([]);
  const [calculations, setCalculations] = useState<CalculationLod[]>([]);
  const [completed, setCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const preparationDataLocked = isLocked || completed;
  const [showComplete, setShowComplete] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({ visible: false, message: "", type: "success" });
  const notify = (message: string, type: "success" | "error" | "info" = "success") => setToast({ visible: true, message, type });

  const addPreparation = () => { if (preparationDataLocked) return; setSamplePreparations(p => [...p, createDefaultPreparation(p.length + 1)]); notify("LOD sample preparation added."); };
  const removePreparation = (index: number) => { if (preparationDataLocked) return; setSamplePreparations(p => p.filter((_, i) => i !== index).map((x, i) => ({ ...x, id: i + 1, label: `Sample Preparation ${i + 1}` }))); setCalculations(c => c.map(x => x.selectedSamplePreparationLabel === `Sample Preparation ${index + 1}` ? { ...x, selectedSamplePreparationLabel: null, calculationResult: null } : x)); };
  const updateStep = (pi: number, si: number, field: keyof SamplePreparationLodStep, value: string) => { if (preparationDataLocked) return; setSamplePreparations(p => p.map((prep, i) => i !== pi ? prep : { ...prep, steps: prep.steps.map((step, j) => j !== si ? step : { ...step, [field]: value }) })); setCalculations(c => c.map(x => ({ ...x, calculationResult: null, calculationResultUnit: null }))); };
  const addFiles = async (selected: File[]) => {
    if (preparationDataLocked) return;
    const mapped: PreparationAttachedFile[] = [];
    for (const file of selected.slice(0, 10 - files.length)) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { notify(`${file.name} is not a PDF.`, "error"); continue; }
      const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result ?? "")); reader.onerror = reject; reader.readAsDataURL(file); });
      mapped.push({ id: `${Date.now()}-${mapped.length}`, name: file.name, size: file.size, type: file.type, fileDataBase64: base64 });
    }
    if (mapped.length) setFiles(p => [...p, ...mapped]);
  };
  const complete = () => { if (isLocked || !samplePreparations.length) return; setCompleted(true); const now = new Date().toISOString(); setCompletedAt(now); setShowComplete(false); onLockPreparation(parameterId); notify("LOD preparation marked as complete!"); };
  const unlock = async () => { if (!canUnlockPreparation) return; setUnlocking(true); try { setCompleted(false); setCompletedAt(null); setCalculations([]); onUnlockPreparation(parameterId); setShowUnlock(false); notify("LOD preparation unlocked successfully."); } finally { setUnlocking(false); } };
  const updateCalculation = (id: number, field: keyof CalculationLod, value: string | null) => setCalculations(c => c.map(x => x.id === id ? { ...x, [field]: value } : x));

  useImperativeHandle(ref, () => ({
    getDraft: () => ({ activeGroups: ["food.lod"], modules: { "food.lod": { samplePreparations, files, calculations, completed, completedAt } } }),
    loadDraft: (draft) => { const d = (draft?.modules?.["food.lod"] ?? draft?.modules?.lod) as Partial<LodModuleData> | undefined; if (!d) return; setSamplePreparations(Array.isArray(d.samplePreparations) ? d.samplePreparations : []); setFiles(Array.isArray(d.files) ? d.files : []); setCalculations(Array.isArray(d.calculations) ? d.calculations : []); setCompleted(Boolean(d.completed)); setCompletedAt(typeof d.completedAt === "string" ? d.completedAt : null); },
    restoreFromWorksheet: (worksheet) => {
      const parameter = worksheet as any; const preps = Array.isArray(parameter?.preparations) ? parameter.preparations : [];
      setSamplePreparations(preps.filter((x: any) => x?.preparationCategory === "sample" && String(x?.preparationType ?? "").toLowerCase() === "lod").map((x: any, i: number) => ({ id: i + 1, label: x.label ?? `Sample Preparation ${i + 1}`, steps: parseSteps(x.steps) })));
      setFiles((Array.isArray(parameter?.files) ? parameter.files : []).filter((x: any) => String(x?.preparationType ?? "").toLowerCase() === "lod").map((x: any, i: number) => ({ id: x.id ?? i, name: x.fileName ?? x.name ?? `LOD-${i + 1}.pdf`, type: "application/pdf", fileDataBase64: x.fileDataBase64 ?? null })));
      setCalculations((Array.isArray(parameter?.calculations) ? parameter.calculations : []).filter((x: any) => String(x?.calculationType ?? "").toLowerCase() === "lod").map((x: any, i: number) => { let data = x?.data; if (typeof data === "string") { try { data = JSON.parse(data); } catch { data = {}; } } return { ...createCalculation(i), ...(data ?? {}), id: data?.id ?? x?.id ?? Date.now() + i, label: data?.label ?? x?.label ?? `Calculation ${i + 1}` }; }));
      const completedValue = parameter?.preparationCompletedAt ?? preps.find((x: any) => x?.preparationType === "lod" && x?.isPreparationCompleted)?.completedAt ?? null;
      setCompleted(Boolean(completedValue)); setCompletedAt(completedValue ? new Date(completedValue).toISOString() : null);
    },
  }), [samplePreparations, files, calculations, completed, completedAt]);

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-2xl pb-8">
      <div className="bg-gradient-to-r from-white via-white to-emerald-50 px-6 py-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg"><BiTestTube className="h-5 w-5 text-white" /></div><div><h2 className="text-2xl font-bold text-emerald-900">LOD Analysis</h2><p className="text-sm text-emerald-600">LOD • Sample &amp; Calculations</p></div></div><div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">{samplePreparations.length} Items</div></div></div>
      <SamplePreparationSection<SamplePreparationLod> title="Sample Preparations for LOD" preparations={samplePreparations} isLocked={preparationDataLocked} onAddPreparation={addPreparation} onRemovePreparation={(_, index) => removePreparation(index)} renderPreparation={(prep: SamplePreparationLod, index: number) => (<div className="relative group z-20"><div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-slate-900/20 rounded-xl blur-xl" /><div className="relative bg-white/95 rounded-lg border border-emerald-200 mb-4 overflow-hidden"><div className="relative bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-t-lg"><div className="flex items-center justify-between px-4 py-3"><div className="flex items-center gap-4 flex-1"><div className="p-2 bg-white/20 rounded-lg border border-white/30"><Droplets className="w-5 h-5 text-white" /></div><div><h4 className="text-sm font-semibold text-white tracking-wide">{prep.label}</h4><p className="text-xs text-emerald-100">Sample Preparation for LOD Details</p></div></div><div className="flex items-center gap-3"><button type="button" onClick={() => { const el = document.getElementById(`lod-prep-${prep.id}`); if (el) el.classList.toggle("hidden"); }} className="p-2 hover:bg-white/20 rounded-lg"><ChevronUp className="w-5 h-5 text-white" /></button><button type="button" onClick={() => removePreparation(index)} disabled={preparationDataLocked} className="p-2 hover:bg-red-500 rounded-lg disabled:opacity-40"><Trash2 className="w-4 h-4 text-white" /></button></div></div></div><div id={`lod-prep-${prep.id}`} className="p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 to-slate-50/30">{prep.steps.map((step, si) => <Step key={`${prep.id}-${si}`} step={step} locked={preparationDataLocked} onChange={(field, value) => updateStep(index, si, field, value)} />)}</div></div></div>)} />
      {samplePreparations.length > 0 && <>
        <div className="mx-6 mb-6"><FileAttachmentSection files={files} isLocked={preparationDataLocked} title="Attach Weight Print Sheets (PDF)" maxFiles={10} onAttachFiles={addFiles} onRemoveFile={(_, i) => setFiles(f => f.filter((__, j) => j !== i))} /></div>
        <div className="mx-6"><PreparationCompleteSection preparationName="LOD" isCompleted={completed} isLocked={preparationDataLocked} completedAt={completedAt} canUnlockPreparation={canUnlockPreparation} onComplete={() => setShowComplete(true)} onUnlock={() => setShowUnlock(true)} /></div>
        {completed && <div className="mx-6"><LodCalculationSection calculations={calculations} samplePreparations={samplePreparations} isLocked={isLocked} canEditCalculations={canEditCalculations} onAdd={() => setCalculations(c => [...c, createCalculation(c.length)])} onRemove={id => setCalculations(c => c.filter(x => x.id !== id))} onChange={updateCalculation} /></div>}
        <PreparationCompleteModal isOpen={showComplete} preparationName="Loss on Drying" parameterName={parameterName} parameterCode={parameterCode} onConfirm={complete} onCancel={() => setShowComplete(false)} />
        <UnlockPreparationDialog isOpen={showUnlock} isUnlocking={unlocking} parameterName={parameterName ?? ""} parameterCode={parameterCode ?? ""} onClose={() => setShowUnlock(false)} onConfirm={unlock} />
      </>}
      <PreparationToast visible={toast.visible} type={toast.type} message={toast.message} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  );
});
LodPreparationModule.displayName = "LodPreparationModule";
export default LodPreparationModule;
