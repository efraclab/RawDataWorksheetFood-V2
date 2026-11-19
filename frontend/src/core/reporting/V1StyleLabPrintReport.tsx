import  { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { WorksheetDetail } from "../worksheet/worksheetService";

export interface V1ReportProps {
  worksheetInfo: WorksheetDetail;

  /**
   * Current V2 parameter collection supplied by WorksheetDetails.
   * When provided, this takes precedence over worksheetInfo.parameters.
   */
  parameters?: any[];

  sampleData?: any;
  analysts?: any[];
  instruments?: any[];
  chemicals?: any[];
  standards?: any[];
  media?: any[];
  onClose: () => void;
  lab?: string;
  logoSrc?: string;
}

const asArray = (v: any): any[] => Array.isArray(v) ? v : [];
const first = (...v: any[]) => v.find(x => x !== undefined && x !== null && String(x).trim() !== "") ?? "";
const text = (v: any, fallback = "N/A") => {
  if (v === undefined || v === null || String(v).trim() === "") return fallback;
  return String(v);
};
const parseJson = (v: any): any => {
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
};
const parseDate = (raw: any): string => {
  if (!raw) return "N/A";
  const s = String(raw).trim();
  if (!s) return "N/A";
  const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (m) return `${m[1].padStart(2,"0")}/${m[2].padStart(2,"0")}/${m[3]}`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
};
const htmlToText = (v: any) => String(v ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function sectionTitle(title: string) {
  return <h4 className="v1-section-title">{title}</h4>;
}

function GenericTable({ columns, rows }: { columns: string[]; rows: any[][] }) {
  if (!rows.length) return null;
  return (
    <table className="v1-table">
      <thead><tr>{columns.map((c,i)=><th key={i}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r,ri)=><tr key={ri}>{r.map((c,ci)=><td key={ci}>{c === "" || c == null ? "N/A" : c}</td>)}</tr>)}</tbody>
    </table>
  );
}

function KeyValueTable({ rows }: { rows: Array<[string, any]> }) {
  const valid = rows.filter(
    ([, v]) =>
      v !== undefined &&
      v !== null &&
      String(v).trim() !== ""
  );

  if (!valid.length) return null;

  return (
    <table className="v1-table">
      <tbody>
        {valid.map(([k, v], i) => (
          <tr key={i}>
            <td className="v1-label">{k}</td>
            <td>
              {typeof v === "object"
                ? htmlToText(JSON.stringify(v))
                : text(v)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportHeader({ worksheet, sampleData, param, index, logoSrc }: { worksheet:any; sampleData:any; param:any; index:number; logoSrc?:string }) {
  const sample = worksheet?.sample ?? {};
  return <div className="v1-keep">
    <table className="v1-table v1-head-table"><tbody>
      <tr className="v1-company-row"><td colSpan={4}>
        <div className="v1-company-name"><div>EDWARD FOOD RESEARCH</div><div>&amp;</div><div>ANALYSIS CENTRE LTD</div></div>
        {logoSrc ? <img className="v1-logo" src={logoSrc} alt="EFRAC"/> : <div className="v1-logo-fallback"><b>EFRAC</b><span>A QIMA COMPANY</span></div>}
      </td></tr>
      <tr><td colSpan={4} className="v1-centered v1-bold">Raw Data Worksheet</td></tr>
      <tr><td colSpan={4} className="v1-centered v1-annexure">Annexure-{index+1}</td></tr>
    </tbody></table>
    <table className="v1-table v1-info-table"><tbody>
      <tr><td colSpan={2}>Registration No: {text(sample.registrationNo, "")}</td><td colSpan={2}>Date of Receipt: {text(first(sampleData?.recieptDate,sampleData?.receiptDate,sampleData?.dateOfReceipt),"")}</td></tr>
      <tr><td colSpan={2}>Sample Name: {text(sample.sampleName, "")}</td><td colSpan={2}>Due Date: {text(first(sampleData?.tatDate,sampleData?.dueDate,sampleData?.due_date),"")}</td></tr>
      <tr><td colSpan={2}>Analysis Started On: {text(first(param?.analysisStartDate,sampleData?.analysisStartDate),"")}</td><td colSpan={2}>Analyzed On: {text(first(param?.analysisCompletionDate,sampleData?.analysisCompletionDate),"")}</td></tr>
    </tbody></table>
    <table className="v1-table"><tbody>
      <tr><td className="v1-no">1</td><td className="v1-label">Sample Particulars (All relevant information received with sample to be entered)</td><td>{text(sample.sampleName,"---")}</td></tr>
      <tr><td className="v1-no">2</td><td className="v1-label">Test(s) required (all tests and condition to be entered)</td><td>{text(first(param?.parameterName,param?.name,param?.parameter),"---")}</td></tr>
      <tr><td className="v1-no">3</td><td className="v1-label">Method(s) of Analysis / testing</td><td>{text(first(param?.methodName,param?.method,param?.methodCode),"---")}</td></tr>
    </tbody></table>
  </div>;
}

function Instruments({ param, all }: { param:any; all:any[] }) {
  const items = asArray(param?.instruments).length ? asArray(param.instruments) : asArray(all).filter(x => asArray(param?.instrumentIds).map(String).includes(String(x?.id ?? x?.instrumentId ?? x?.slno)));
  if (!items.length) return null;
  return <div>{sectionTitle("INSTRUMENTS USED")}<GenericTable columns={["Instrument Id","Instrument Name","Calibration Done On","Calibration Due On"]} rows={items.map(x=>[first(x.instrumentTag,x.instrumentId,x.id),first(x.name,x.instrumentName),parseDate(first(x.calibrationDoneDate,x.calibrationDoneOn)),parseDate(first(x.calibrationDueDate,x.calibrationDueOn))])}/></div>;
}

function Chemicals({ param, all }: { param:any; all:any[] }) {
  const items = asArray(param?.chemicals).length ? asArray(param.chemicals) : asArray(all).filter(x => asArray(param?.chemicalIds).map(String).includes(String(x?.slno ?? x?.id)));
  if (!items.length) return null;
  return <div>{sectionTitle("CHEMICALS/REAGENTS USED")}<GenericTable columns={["Chemical Name","Code","Make","Batch No.","Validity"]} rows={items.map(x=>[first(x.name,x.chemicalName),first(x.code,x.slno,x.id),first(x.make,x.manufacturer),first(x.batchNo,x.batchNumber,"-"),parseDate(first(x.expDate,x.expiryDate,x.validity))])}/></div>;
}

function Standards({ param, all }: { param:any; all:any[] }) {
  const items = asArray(param?.standards).length ? asArray(param.standards) : asArray(all).filter(x => asArray(param?.standardIds).map(String).includes(String(x?.serialNo ?? x?.id)));
  if (!items.length) return null;
  return <div>{sectionTitle("STANDARDS USED")}<GenericTable columns={["Standard Name","Purity","Make","Batch No.","Validity"]} rows={items.map(x=>[first(x.name,x.standardName),first(x.purity,x.purityValue),first(x.make,x.manufacturer),first(x.batchNo,x.batchNumber,x.serialNo),parseDate(first(x.expDate,x.expiryDate,x.validity))])}/></div>;
}

function Media({ param, all }: { param:any; all:any[] }) {
  const items = asArray(param?.media).length ? asArray(param.media) : asArray(param?.mediaIds).map(id=>asArray(all).find(x=>String(x?.id ?? x?.mediaId)===String(id))).filter(Boolean);
  if (!items.length) return null;
  return <div>{sectionTitle("MEDIA USED")}<GenericTable columns={["Media Id","Media Name","Code","Quantity","Validity"]} rows={items.map(x=>[first(x.id,x.mediaId),first(x.name,x.mediaName),first(x.code),first(x.quantityValue,x.quantity),parseDate(first(x.expDate,x.expiryDate,x.validity))])}/></div>;
}

function PreparationBlock({ param }: { param:any }) {
  const raw = asArray(parseJson(param?.preparations));
  if (!raw.length) return null;
  const groups: Record<string,any[]> = {};
  raw.forEach((p:any)=>{
    const cat = String(first(p?.preparationCategory,p?.category,p?.preparationType,"preparation")).toLowerCase();
    if (cat === "system_suitability") return;
    const key = cat.includes("buffer") ? "BUFFER PREPARATIONS" : cat.includes("mobile") ? "MOBILE PHASE PREPARATIONS" : cat.includes("diluent") ? "DILUENT PREPARATIONS" : cat.includes("sample") || cat.includes("lod") ? "SAMPLE PREPARATIONS" : "PREPARATION DETAILS";
    (groups[key] ??= []).push(p);
  });
  return <>{Object.entries(groups).map(([title,items])=><div key={title}>{sectionTitle(title)}{items.map((p,i)=>{
    const steps = asArray(parseJson(p?.steps));
    const content = typeof p?.content === "string" ? p.content : "";
    const rows = steps.length ? steps.map((s:any)=>[first(s?.name,s?.stepName), first(s?.value1,s?.value2,s?.value3,s?.value4,s?.value)]) : content ? [["Preparation",htmlToText(content)]] : Object.entries(p ?? {}).filter(([k,v])=>!['id','steps','content','preparationType','preparationCategory','category'].includes(k) && (typeof v === 'string' || typeof v === 'number')).slice(0,20).map(([k,v])=>[k,v]);
    if (!rows.length) return null;
    return <div className="v1-prep" key={i}><div className="v1-subtitle">{text(first(p?.label,p?.name,p?.preparationName), `${title.replace(/ PREPARATIONS$/,'')} ${i+1}`)}</div><KeyValueTable rows={rows as Array<[string,any]>}/></div>;
  })}</div>)}</>;
}

function humanizeKey(key: string): string {
  return String(key ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function calculationPayload(calc: any): any {
  const parsed = parseJson(calc?.data);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    // V2 calculation persistence commonly stores the calculation object as
    // { ...calc } inside the `data` JSON field.
    if (parsed.calc && typeof parsed.calc === "object") return parsed.calc;
    return parsed;
  }
  return {};
}

function calculationValue(value: any): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return htmlToText(value);
  if (Array.isArray(value)) return value.map(calculationValue).filter(Boolean).join(", ");
  return "";
}

function LODCalculation({ data }: { data: any }) {
  const w1 = first(
    data?.w1_emptyDish,
    data?.w1,
    data?.emptyDishWeight
  );

  const w2 = first(
    data?.w2_dishWithSample,
    data?.w2,
    data?.sampleDishWeight
  );

  const w3 = first(
    data?.w3_dishAfterIgnition,
    data?.w3,
    data?.dishAfterDryingWeight,
    data?.dishAfterIgnitionWeight
  );

  const result = first(
    data?.calculationResult,
    data?.result,
    data?.calculatedResult
  );

  const unit = first(
    data?.calculationResultUnit,
    data?.resultUnit,
    "%"
  );

  const samplePrep = first(
    data?.selectedSamplePreparationLabel,
    data?.samplePreparationLabel
  );

  const acceptance = first(
    data?.acceptanceLimit,
    data?.limit,
    data?.acceptance
  );

  const n1 = calculationValue(w1);
  const n2 = calculationValue(w2);
  const n3 = calculationValue(w3);
  const resultText = calculationValue(result);

  /*
   * IMPORTANT:
   * Do not build this prop inline with null values and then cast the
   * result of .filter(Boolean). TypeScript can still infer the array as
   * a union containing null and produce JSX/TS2362 errors.
   *
   * Build a correctly typed row collection explicitly instead.
   */
  const rows: Array<[string, any]> = [];

  if (samplePrep) {
    rows.push(["Selected Sample Preparation Label", samplePrep]);
  }

  if (n1) {
    rows.push(["Weight of Empty Dish", n1]);
  }

  if (n2) {
    rows.push(["Weight of Sample + Dish", n2]);
  }

  if (n3) {
    rows.push(["Weight of Sample + Dish after Drying", n3]);
  }

  if (resultText) {
    rows.push([
      "Calculation Result",
      `${resultText}${unit ? ` ${unit}` : ""}`,
    ]);
  }

  if (acceptance) {
    rows.push(["Acceptance Limit", acceptance]);
  }

  /*
   * first() returns a display value, so the formula must be controlled
   * by the actual display values rather than arithmetic comparisons.
   * The report is displaying the persisted calculation, not recalculating it.
   */
  const hasLODWeights = Boolean(n1 && n2 && n3);

  return (
    <>
      <KeyValueTable rows={rows} />

      {hasLODWeights && (
        <div className="v1-formula">
          <b>Formula :</b>

          <div className="v1-mono">
            (W2 - W3) / (W2 - W1) × 100 %
          </div>

          <b>Derivation :</b>

          <div className="v1-mono">
            ({n2} - {n3}) / ({n2} - {n1}) × 100 %
          </div>

          {resultText && (
            <div className="v1-result">
              Result = {resultText}
              {unit ? ` ${unit}` : ""}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function GenericCalculation({ calc, data }: { calc: any; data: any }) {
  const excluded = new Set([
    "id",
    "label",
    "calculationName",
    "name",
    "formula",
    "formulaText",
    "expression",
    "derivation",
    "derivationText",
    "calculationResult",
    "result",
    "resultValue",
    "calculationResultUnit",
    "resultUnit",
  ]);

  const rows: Array<[string, any]> = Object.entries(data ?? {})
    .filter(([key, value]) => {
      if (excluded.has(key)) return false;
      return (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      );
    })
    .map(([key, value]) => [humanizeKey(key), calculationValue(value)]);

  // If the persisted data is empty, fall back to the calculation object,
  // but NEVER print the raw JSON `data` property.
  if (!rows.length) {
    Object.entries(calc ?? {}).forEach(([key, value]) => {
      if (key === "data" || excluded.has(key)) return;
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        rows.push([humanizeKey(key), calculationValue(value)]);
      }
    });
  }

  const formula = first(data?.formula, data?.formulaText, data?.expression, calc?.formula, calc?.formulaText, calc?.expression);
  const derivation = first(data?.derivation, data?.derivationText, calc?.derivation, calc?.derivationText);
  const result = first(data?.calculationResult, data?.result, data?.resultValue, calc?.calculationResult, calc?.result, calc?.resultValue);
  const resultUnit = first(data?.calculationResultUnit, data?.resultUnit, calc?.calculationResultUnit, calc?.resultUnit);

  return (
    <>
      {rows.length > 0 && <KeyValueTable rows={rows.slice(0, 30)} />}
      {(formula || derivation || result !== undefined) && (
        <div className="v1-formula">
          {formula && <><b>Formula :</b><div className="v1-mono">{calculationValue(formula)}</div></>}
          {derivation && <><b>Derivation :</b><div className="v1-mono">{calculationValue(derivation)}</div></>}
          {result !== undefined && (
            <div className="v1-result">
              Result = {calculationValue(result)}{resultUnit ? ` ${calculationValue(resultUnit)}` : ""}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function CalculationBlock({ param }: { param:any }) {
  const calcs = asArray(parseJson(param?.calculations));
  if (!calcs.length) return null;

  return (
    <div>
      {sectionTitle("CALCULATIONS")}
      {calcs.map((c:any,i:number)=>{
        const data = calculationPayload(c);
        const type = String(first(c?.calculationType, data?.calculationType, "")).toLowerCase();
        const label = first(c?.label, data?.label, c?.calculationName, data?.calculationName, c?.name, data?.name, `Calculation ${i+1}`);

        return (
          <div className="v1-calc" key={c?.id ?? i}>
            <div className="v1-subtitle">{text(label, `Calculation ${i+1}`)}</div>
            {type === "lod" ? (
              <LODCalculation data={data} />
            ) : (
              <GenericCalculation calc={c} data={data} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SuitabilityBlock({ param }: { param:any }) {
  const preps = asArray(parseJson(param?.preparations));
  const list = asArray(param?.systemSuitabilities).length ? asArray(param.systemSuitabilities) : preps.filter((p:any)=>String(p?.preparationCategory ?? "").toLowerCase()==="system_suitability");
  if (!list.length) return null;
  return <div>{sectionTitle("SYSTEM SUITABILITIES")}{list.map((s:any,i)=>{const steps=asArray(parseJson(s?.steps)); if(!steps.length)return null; return <div className="v1-prep" key={i}><div className="v1-subtitle">{text(s?.label,`System Suitability ${i+1}`)}</div><KeyValueTable rows={steps.map((x:any)=>[first(x?.name,x?.stepName), first(x?.specification,x?.description, [x?.value1,x?.value2,x?.value3,x?.value4].filter(Boolean).join(" "))])}/></div>})}</div>;
}

function AdditionalInfo({ param }: { param:any }) {
  const value = first(param?.additional_info,param?.additionalInfo,param?.other_info,param?.otherInfo);
  if (!value) return null;
  return <div>{sectionTitle("ADDITIONAL INFORMATION")}<div className="v1-box">{htmlToText(value)}</div></div>;
}

function Signature({ param }: { param:any }) {
  return <div className="v1-signature"><table className="v1-table"><tbody>
    <tr><td>Analyzed By</td><td><b>{text(param?.analyzedByName,"---")}</b></td><td>Analyzed On</td><td><b>{parseDate(param?.analysisCompletionDate)}</b></td></tr>
    <tr><td>Reviewed By</td><td><b>{text(param?.approvedByReviewerName,"---")}</b></td><td>Reviewed On</td><td><b>{parseDate(param?.approvedAtReviewer)}</b></td></tr>
    {first(param?.approvedByQAName,param?.approvedByQA) && <tr><td>Approved By</td><td><b>{text(first(param?.approvedByQAName,param?.approvedByQA),"---")}</b></td><td>Approved On</td><td><b>{parseDate(param?.approvedAtQA)}</b></td></tr>}
  </tbody></table><div className="v1-sign-note">This document has been digitally signed; no further signature is required.</div></div>;
}

function AttachedFiles({ param }: { param:any }) {
  const files = asArray(param?.files).filter((f:any)=>f?.fileDataBase64);
  if (!files.length) return null;
  return <div className="v1-attached">{sectionTitle("ATTACHED FILES")}{files.map((f:any,i)=> <AttachedFile key={i} file={f} param={param}/>)}</div>;
}

function AttachedFile({ file, param }: { file:any; param:any }) {
  const [pages,setPages] = useState<string[]>([]);
  const [error,setError] = useState<string | null>(null);
  const isPdf = String(file?.fileName ?? "").toLowerCase().endsWith(".pdf") || String(file?.fileDataBase64 ?? "").startsWith("JVBER");
  useEffect(()=>{
    if(!isPdf) return;
    let cancelled=false;
    (async()=>{
      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF.js"));
            document.head.appendChild(script);
          });
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const pdfjs = (window as any).pdfjsLib;
        const raw = String(file.fileDataBase64).replace(/^data:[^,]+,/i,"");
        const binary = atob(raw); const bytes = new Uint8Array(binary.length);
        for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
        const doc = await pdfjs.getDocument({data:bytes}).promise;
        const out:string[]=[];
        for(let p=1;p<=doc.numPages;p++){
          const page=await doc.getPage(p); const viewport=page.getViewport({scale:1.35});
          const canvas=document.createElement("canvas"); canvas.width=viewport.width; canvas.height=viewport.height;
          await page.render({canvasContext:canvas.getContext("2d")!,viewport}).promise;
          out.push(canvas.toDataURL("image/png"));
        }
        if(!cancelled)setPages(out);
      }catch(e:any){if(!cancelled)setError(e?.message ?? "Failed to render PDF");}
    })();
    return()=>{cancelled=true};
  },[file,isPdf]);
  if(isPdf){
    if(error) return <div className="v1-box">{file.fileName}: {error}</div>;
    if(!pages.length) return <div className="v1-box">Loading {file.fileName}…</div>;
    return <>{pages.map((src,i)=><div className="v1-file-page" key={i}><img src={src} alt={`${file.fileName} page ${i+1}`}/><Signature param={param}/></div>)}</>;
  }
  const ext = String(file?.fileName ?? "").split(".").pop()?.toLowerCase() ?? "";
  if(["png","jpg","jpeg","gif","webp","bmp"].includes(ext)) return <div className="v1-file-page"><img src={`data:image/${ext === "jpg" ? "jpeg" : ext};base64,${file.fileDataBase64}`} alt={file.fileName}/><Signature param={param}/></div>;
  return <div className="v1-box">{file.fileName}</div>;
}

export default function V1StyleLabPrintReport({
  worksheetInfo,
  parameters,
  sampleData,
  instruments = [],
  chemicals = [],
  standards = [],
  media = [],
  onClose,
  logoSrc,
}: V1ReportProps) {
  const params = useMemo(
    () =>
      asArray(
        parameters?.length
          ? parameters
          : (worksheetInfo as any)?.parameters
      ),
    [parameters, worksheetInfo]
  );

  const displaySampleData =
    sampleData ?? (worksheetInfo as any)?.sample ?? {};

  // The report must be a true V2 overlay, not normal worksheet content.
  // Rendering through a portal keeps it outside WorksheetShell and prevents
  // the report from appearing below "Parameter Files".
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("v1-print-report-open");

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("v1-print-report-open");
    };
  }, []);

  const report = (
    <div className="v1-report-overlay">
      <style>{`
        /* ============================================================
           V1 REPORT - SCREEN
           The report is a standalone application layer.
           ============================================================ */
        body.v1-print-report-open {
          overflow: hidden !important;
        }

        body.v1-print-report-open > *:not(.v1-report-overlay) {
          pointer-events: none;
        }

        .v1-report-overlay {
          position: fixed;
          inset: 0;
          z-index: 2147483000;
          width: 100vw;
          height: 100vh;
          overflow: auto;
          background: #f3f4f6;
          color: #000;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        .v1-report-overlay *,
        .v1-report-overlay *::before,
        .v1-report-overlay *::after {
          box-sizing: border-box;
        }

        .v1-toolbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          width: 100%;
          min-height: 58px;
          padding: 10px 18px;
          background: #fff;
          border-bottom: 1px solid #d1d5db;
          box-shadow: 0 1px 4px rgba(0,0,0,.08);
        }

        .v1-toolbar button {
          border: 0;
          border-radius: 6px;
          padding: 9px 16px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .v1-print-btn {
          background: #00a86b;
          color: #fff;
        }

        .v1-print-btn:hover {
          background: #008f5b;
        }

        .v1-close-btn {
          background: #eee;
          color: #222;
        }

        .v1-close-btn:hover {
          background: #ddd;
        }

        .v1-print-container {
          width: 210mm;
          max-width: calc(100vw - 32px);
          margin: 24px auto 40px;
          padding: 0;
          background: #fff;
          box-shadow: 0 0 12px rgba(0,0,0,.12);
        }

        .v1-report-sheet {
          width: 100%;
          min-height: 297mm;
          padding: 6mm 15mm 8mm;
          background: #fff;
        }

        .v1-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
          margin-bottom: 8px;
        }

        .v1-table th,
        .v1-table td {
          border: 1px solid #000;
          padding: 8px;
          vertical-align: middle;
        }

        .v1-table th {
          background: #f3f4f6;
          text-align: left;
          font-weight: 700;
        }

        .v1-head-table td {
          padding: 8px;
        }

        .v1-company-row {
          background: #e5e7eb;
        }

        .v1-company-row > td {
          height: 70px;
          position: relative;
        }

        .v1-company-name {
          text-align: center;
          font-weight: 700;
          line-height: 1.3;
        }

        .v1-logo {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          height: 56px;
          width: 130px;
          object-fit: contain;
        }

        .v1-logo-fallback {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .v1-logo-fallback b {
          font-size: 31px;
          letter-spacing: 2px;
          color: #148d68;
        }

        .v1-logo-fallback span {
          font-size: 8px;
          letter-spacing: 3px;
          color: #777;
        }

        .v1-centered {
          text-align: center;
        }

        .v1-bold {
          font-weight: 700;
        }

        .v1-annexure {
          font-size: 16px;
          font-weight: 700;
        }

        .v1-info-table td {
          padding: 8px;
        }

        .v1-no {
          width: 40px;
          text-align: center;
        }

        .v1-label {
          background: #f3f4f6;
          font-weight: 700;
        }

        .v1-parameter {
          font-size: 18px;
          line-height: 1.25;
          background: #e5e7eb;
          border: 1px solid #000;
          padding: 8px 12px;
          margin: 16px 0 12px;
          font-weight: 700;
        }

        .v1-section-title {
          font-size: 15px;
          line-height: 1.25;
          margin: 16px 0 8px;
          font-weight: 700;
        }

        .v1-subtitle {
          font-weight: 700;
          margin: 10px 0 6px;
        }

        .v1-prep,
        .v1-calc {
          margin-bottom: 12px;
        }

        .v1-formula {
          background: #f3f4f6;
          border: 1px solid #000;
          padding: 12px;
          margin-top: 8px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .v1-formula b {
          display: block;
          margin-bottom: 8px;
        }

        .v1-mono {
          text-align: center;
          font-family: "Courier New", monospace;
          font-size: 12px;
          margin: 14px 0;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .v1-result {
          text-align: center;
          font-weight: 700;
          margin-top: 10px;
        }

        .v1-box {
          border: 1px solid #000;
          padding: 10px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .v1-signature {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 10px;
        }

        .v1-signature td {
          font-size: 10px;
          padding: 4px 8px;
        }

        .v1-sign-note {
          font-size: 10px;
          font-style: italic;
          margin-top: 3px;
        }

        .v1-file-page {
          display: flex;
          flex-direction: column;
          min-height: 250mm;
          break-inside: avoid;
          page-break-inside: avoid;
          justify-content: flex-start;
        }

        .v1-file-page > img {
          max-width: 100%;
          max-height: 235mm;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }

        .v1-keep {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* ============================================================
           V1 REPORT - PRINT
           Only the report overlay is printed.
           WorksheetShell, sidebar, Parameter Files and the rest of
           the application are completely removed from print output.
           ============================================================ */
        @media print {
          html,
          body {
            width: 100%;
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body.v1-print-report-open > *:not(.v1-report-overlay) {
            display: none !important;
          }

          .v1-report-overlay {
            position: static !important;
            inset: auto !important;
            width: auto !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #fff !important;
          }

          .v1-toolbar {
            display: none !important;
          }

          .v1-print-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          .v1-report-sheet {
            width: 100% !important;
            min-height: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .v1-report-page {
            break-before: page;
            page-break-before: always;
          }

          .v1-table tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .v1-file-page {
            min-height: 0;
            height: 100vh;
          }

          .v1-file-page > img {
            max-height: calc(100vh - 35mm);
          }

          @page {
            size: A4;
            margin: 6mm 8mm;
          }
        }
      `}</style>

      <div className="v1-toolbar">
        <button
          type="button"
          className="v1-close-btn"
          onClick={onClose}
        >
          Close
        </button>

        <button
          type="button"
          className="v1-print-btn"
          onClick={() => window.print()}
        >
          Print Report
        </button>
      </div>

      <main className="v1-print-container">
        {params.length === 0 ? (
          <section className="v1-report-sheet">
            <ReportHeader
              worksheet={worksheetInfo}
              sampleData={displaySampleData}
              param={{}}
              index={0}
              logoSrc={logoSrc}
            />

            <div className="v1-box">
              No parameter data is available for this worksheet.
            </div>
          </section>
        ) : (
          params.map((param: any, index: number) => (
            <section
              key={param?.id ?? param?.parameterId ?? index}
              className={`v1-report-sheet ${
                index > 0 ? "v1-report-page" : ""
              }`}
            >
              <ReportHeader
                worksheet={worksheetInfo}
                sampleData={displaySampleData}
                param={param}
                index={index}
                logoSrc={logoSrc}
              />

              <h3 className="v1-parameter">
                PARAMETER:{" "}
                {text(
                  first(
                    param?.parameterName,
                    param?.name,
                    param?.parameter
                  ),
                  "---"
                ).toUpperCase()}{" "}
                (
                {text(
                  first(
                    param?.paraCode,
                    param?.parameterCode,
                    param?.code
                  ),
                  "---"
                )}
                )
              </h3>

              <Instruments
                param={param}
                all={instruments}
              />

              <Chemicals
                param={param}
                all={chemicals}
              />

              <Standards
                param={param}
                all={standards}
              />

              <Media
                param={param}
                all={media}
              />

              <PreparationBlock param={param} />

              <CalculationBlock param={param} />

              <SuitabilityBlock param={param} />

              <AdditionalInfo param={param} />

              <Signature param={param} />

              <AttachedFiles param={param} />
            </section>
          ))
        )}
      </main>
    </div>
  );

  // React 18: portal into document.body so the report is completely
  // independent of WorksheetShell/layout containers.
  return createPortal(report, document.body);
}
