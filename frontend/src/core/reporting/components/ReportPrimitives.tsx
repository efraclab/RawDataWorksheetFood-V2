import React, { useEffect,  useState } from "react";
import companyLogo from "../../../assets/EFRAC-QIMA-logo.png";
import type { ReportContext } from "../types";

export interface FileSignatureData {
  analyzedByName?: string | null;
  analysisCompletionDate?: string | null;
  approvedByReviewerName?: string | null;
  approvedAtReviewer?: string | null;
}

export const safeJSONParse = <T,>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const formatDate = (value: unknown): string => {
  if (!value) return "---";
  const raw = String(value);
  if (!raw) return "---";
  return raw.replace(/T.*$/, "").replace(/-/g, "/");
};

export const formatDateTime = (value: unknown): string => {
  if (!value) return "---";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

export const formatCalculationType = (value: unknown): string => {
  if (!value) return "";
  const text = String(value);
  const lower = text.toLowerCase();

  if (lower === "lod") return "LOD";
  if (lower === "roi") return "ROI";

  return text
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\bOf\b/g, "of");
};

export const getParameterName = (parameter: any): string =>
  parameter?.parameterName ||
  parameter?.name ||
  parameter?.parameter ||
  "---";

export const getParameterCode = (parameter: any): string =>
  parameter?.paraCode ||
  parameter?.parameterCode ||
  parameter?.code ||
  "---";

export const getMethodName = (parameter: any): string =>
  parameter?.methodName ||
  parameter?.method ||
  "---";

export const getPreparations = (parameter: any): any[] => {
  const direct = parameter?.preparations;
  if (Array.isArray(direct)) return direct;

  const parsed = safeJSONParse<any[]>(direct, []);
  return Array.isArray(parsed) ? parsed : [];
};

export const getCalculations = (parameter: any): any[] => {
  if (Array.isArray(parameter?.calculations)) return parameter.calculations;
  const parsed = safeJSONParse<any[]>(parameter?.calculations, []);
  return Array.isArray(parsed) ? parsed : [];
};

const valueOrBlank = (value: unknown): string =>
  value === null || value === undefined || value === "" ? "___" : String(value);

const stepHasData = (step: any): boolean =>
  Boolean(
    step &&
      (
        step.value1 !== undefined ||
        step.value2 !== undefined ||
        step.value3 !== undefined ||
        step.value4 !== undefined ||
        step.id ||
        step.logBookID ||
        step.solventChemical ||
        step.description
      )
  );

export const formatPreparationStep = (step: any): string => {
  if (!step) return "";

  const name = String(step.name || step.stepName || "Preparation Step");
  const v1 = valueOrBlank(step.value1);
  const v2 = valueOrBlank(step.value2);
  const v3 = valueOrBlank(step.value3);
  const u1 = step.unit1 ? ` ${step.unit1}` : "";
  const u2 = step.unit2 ? ` ${step.unit2}` : "";
  const u3 = step.unit3 ? ` ${step.unit3}` : "";
  const log = step.logBookID ? ` (Log Book ID: ${step.logBookID})` : "";

  switch (name) {
    case "Weighing":
      return `Weigh accurately ${v1}${u1}${step.solventChemical ? ` of ${step.solventChemical}` : ""}${log}.`;
    case "Weighing/Measuring":
      return `Weigh/measure accurately ${v1}${u1}${step.solventChemical ? ` of ${step.solventChemical}` : ""}${log}.`;
    case "PH":
    case "pH":
      return `Adjust pH to ${v1}${log}.`;
    case "Sonication":
      return `Sonicate for ${v1}${u1 || " min"}.`;
    case "Filtration":
      return `Filter through ${v1}${u1 || " µm"} filter.`;
    case "Drying":
      return `Dry the sample at ${v1}${u1 || " °C"} for ${v2}${u2 || " hr"}${log}.`;
    case "Instrument Details":
      return `Instrument ID: ${step.id || "___"}, RPM: ${v1} rpm, Temperature: ${v2}${u2 || " °C"}.`;
    case "Tablet Details":
      return `Claim: ${v1}${u1 || " mg"}, Media Volume: ${v2}${u2 || " ml"}, Sampling Time: ${v3}${u3 || " min"}.`;
    default:
      return `${name}: ${v1}${u1}${v2 !== "___" ? `, ${v2}${u2}` : ""}${v3 !== "___" ? `, ${v3}${u3}` : ""}${log}`;
  }
};

export const renderPreparationRows = (preparations: any[]): any[] => {
  const rows: any[] = [];

  preparations.forEach((prep: any, prepIndex: number) => {
    const category =
      prep?.preparationCategory ||
      prep?.category ||
      prep?.type ||
      "Preparation";

    const preparationType =
      prep?.preparationType ||
      prep?.moduleType ||
      prep?.name ||
      category;

    const steps = safeJSONParse<any[]>(prep?.steps, []);
    const validSteps = Array.isArray(steps) ? steps.filter(stepHasData) : [];

    rows.push({
      key: `${prepIndex}-${category}-${preparationType}`,
      category,
      preparationType,
      steps: validSteps,
    });
  });

  return rows;
};

export const FileSignatureFooter: React.FC<{ sig: FileSignatureData }> = ({ sig }) => (
  <div
    className="signature-footer-block"
    style={{
      width: "100%",
      pageBreakInside: "avoid",
      breakInside: "avoid",
      marginTop: "4px",
    }}
  >
    <table
      className="file-signature-footer"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "10px",
        border: "1px solid black",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>
            Analyzed By
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
            {sig.analyzedByName || "---"}
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%" }}>
            Analyzed On
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black", width: "25%", fontWeight: "bold" }}>
            {formatDateTime(sig.analysisCompletionDate)}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed By</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {sig.approvedByReviewerName || "---"}
          </td>
          <td style={{ padding: "4px 8px", border: "1px solid black" }}>Reviewed On</td>
          <td style={{ padding: "4px 8px", border: "1px solid black", fontWeight: "bold" }}>
            {formatDateTime(sig.approvedAtReviewer)}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      style={{
        marginTop: "3px",
        fontSize: "10px",
        fontStyle: "italic",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      This document has been digitally signed; no further signature is required.
    </div>
  </div>
);

export const PdfPageRenderer: React.FC<{
  base64: string;
  fileName: string;
  signature: FileSignatureData;
}> = ({ base64, fileName, signature }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setLoading(true);
      setError(null);
      setPages([]);

      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF.js"));
            document.head.appendChild(script);
          });

          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const pdfjsLib = (window as any).pdfjsLib;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (cancelled) return;

        const urls: string[] = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const context = canvas.getContext("2d");
          if (!context) throw new Error("Could not create PDF canvas context");

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          urls.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) {
          setPages(urls);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to render PDF");
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [base64]);

  if (loading) {
    return (
      <div className="p-4 text-xs text-gray-500 text-center">
        Loading {fileName}…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-xs text-red-600 text-center border border-red-300 bg-red-50">
        Could not render {fileName}: {error}
      </div>
    );
  }

  return (
    <>
      {pages.map((dataUrl, index) => (
        <div
          key={`${fileName}-${index}`}
          className="pdf-page-with-sig"
          style={{
            breakInside: "avoid",
            pageBreakInside: "avoid",
            marginBottom: "4px",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={dataUrl}
              alt={`${fileName} page ${index + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>

          <FileSignatureFooter sig={signature} />
        </div>
      ))}
    </>
  );
};

export const ReportPrintStyles: React.FC = () => (
  <style>{`
    @page {
      size: A4;
      margin: 10mm;
    }

    @media screen {
      .report-print-root {
        max-width: 210mm;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 0 12px rgba(0,0,0,.12);
      }
    }

    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }

      .no-print {
        display: none !important;
      }

      .report-print-root {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        box-shadow: none !important;
      }

      .page-break-before {
        break-before: page !important;
        page-break-before: always !important;
      }

      .keep-together,
      .section-container,
      table,
      tr,
      .pdf-page-with-sig,
      .signature-footer-block {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }
    }

    .report-print-root table {
      border-collapse: collapse;
    }

    .report-print-root td,
    .report-print-root th {
      vertical-align: top;
    }
  `}</style>
);

export const ReportToolbar: React.FC<{
  onPrint: () => void;
  onClose: () => void;
}> = ({ onPrint, onClose }) => (
  <div className="no-print sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
    <div className="text-sm font-semibold text-slate-700">Print Report</div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrint}
        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
      >
        Print
      </button>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Close
      </button>
    </div>
  </div>
);

export const ReportHeader: React.FC<{
  context: ReportContext;
  parameterCount: number;
}> = ({ context, parameterCount }) => {
  const sample: any = (context.worksheetInfo as any)?.sample ?? {};
  const worksheet: any = context.worksheetInfo as any;

  return (
    <div className="mb-3">
      <table className="w-full border border-black text-sm">
        <tbody>
          <tr>
            <td
              colSpan={4}
              className="border border-black px-3 py-2 text-center font-bold uppercase"
            >
              EFRAC-QIMA
            </td>
          </tr>

          <tr>
            <td className="border border-black px-3 py-1.5">
              Laboratory: <strong>{context.lab || sample.lab || worksheet.lab || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Worksheet ID: <strong>{worksheet.worksheetId || worksheet.id || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Registration No.: <strong>{worksheet.registrationNo || context.sampleData?.registrationNo || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              No. of Parameters: <strong>{parameterCount}</strong>
            </td>
          </tr>

          <tr>
            <td className="border border-black px-3 py-1.5">
              Sample Name: <strong>{sample.sampleName || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Sample Code: <strong>{sample.sampleCode || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Due Date: <strong>{formatDate(context.sampleData?.tatDate || worksheet.tatDate)}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Date of Receipt: <strong>{formatDate(context.sampleData?.recieptDate || worksheet.recieptDate)}</strong>
            </td>
          </tr>

          <tr>
            <td className="border border-black px-3 py-1.5">
              Analysis Started On: <strong>{formatDate(context.sampleData?.analysisStartDate || worksheet.analysisStartDate)}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Analysis Completed On: <strong>{formatDate(context.sampleData?.analysisCompletionDate || worksheet.analysisCompletionDate)}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Prepared By: <strong>{context.analysts?.map((a: any) => a.name || a.employeeName || a.employeeId).filter(Boolean).join(", ") || "---"}</strong>
            </td>
            <td className="border border-black px-3 py-1.5">
              Status: <strong>{worksheet.status || worksheet.worksheetStatus || "---"}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-2 flex items-center justify-center">
        <img
          src={companyLogo}
          alt="EFRAC-QIMA"
          className="h-auto max-h-14 max-w-[220px] object-contain"
        />
      </div>
    </div>
  );
};

export const SampleParticulars: React.FC<{
  context: ReportContext;
  parameter: any;
}> = ({ context, parameter }) => {
  const sample: any = (context.worksheetInfo as any)?.sample ?? {};

  return (
    <div className="mb-3">
      <table className="w-full border border-black text-sm">
        <tbody>
          <tr className="border-b border-black">
            <td className="w-10 border-r border-black px-4 py-3 text-center">1</td>
            <td className="w-1/3 border-r border-black px-4 py-3">
              Sample Particulars (All relevant information received with sample to be entered)
            </td>
            <td className="px-3 py-3">{sample.sampleName || "---"}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="w-10 border-r border-black px-4 py-3 text-center">2</td>
            <td className="w-1/3 border-r border-black px-4 py-3">
              Test(s) required (all tests and condition to be entered)
            </td>
            <td className="px-3 py-3">{getParameterName(parameter)}</td>
          </tr>
          <tr>
            <td className="w-10 border-r border-black px-4 py-3 text-center">3</td>
            <td className="w-1/3 border-r border-black px-4 py-3">
              Method(s) of Analysis / Testing
            </td>
            <td className="px-3 py-3">{getMethodName(parameter)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const ReferenceTables: React.FC<{
  context: ReportContext;
  parameter: any;
}> = ({ context, parameter }) => {
  const embeddedInstruments = Array.isArray(parameter?.instruments)
    ? parameter.instruments
    : [];

  const embeddedChemicals = Array.isArray(parameter?.chemicals)
    ? parameter.chemicals
    : [];

  const embeddedStandards = Array.isArray(parameter?.standards)
    ? parameter.standards
    : [];

  const instrumentIds = Array.isArray(parameter?.instrumentIds)
    ? parameter.instrumentIds
    : [];

  const chemicalIds = Array.isArray(parameter?.chemicalIds)
    ? parameter.chemicalIds
    : [];

  const standardIds = Array.isArray(parameter?.standardIds)
    ? parameter.standardIds
    : [];

  const filteredInstruments =
    embeddedInstruments.length > 0
      ? embeddedInstruments
      : (context.instruments || []).filter((item: any) =>
          instrumentIds.includes(item.id) ||
          instrumentIds.includes(String(item.id))
        );

  const filteredChemicals =
    embeddedChemicals.length > 0
      ? embeddedChemicals
      : (context.chemicals || []).filter((item: any) =>
          chemicalIds.includes(item.slno) ||
          chemicalIds.includes(String(item.slno))
        );

  const filteredStandards =
    embeddedStandards.length > 0
      ? embeddedStandards
      : (context.standards || []).filter((item: any) =>
          standardIds.includes(item.serialNo) ||
          standardIds.includes(String(item.serialNo))
        );

  return (
    <>
      {filteredInstruments.length > 0 && (
        <div className="section-container mb-4">
          <h4 className="mb-2 text-md font-bold uppercase">Instruments Used</h4>
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">Instrument Id</th>
                <th className="border border-black px-3 py-2 text-left">Instrument Name</th>
                <th className="border border-black px-3 py-2 text-left">Calibration Done On</th>
                <th className="border border-black px-3 py-2 text-left">Calibration Due On</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstruments.map((item: any, index: number) => (
                <tr key={item.instrumentId || item.id || index}>
                  <td className="border border-black px-3 py-2">{item.instrumentTag || item.instrumentId || item.id || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.name || item.instrumentName || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{formatDate(item.calibrationDoneDate)}</td>
                  <td className="border border-black px-3 py-2">{formatDate(item.calibrationDueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredChemicals.length > 0 && (
        <div className="section-container mb-4">
          <h4 className="mb-2 text-md font-bold uppercase">Chemicals / Reagents Used</h4>
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">Chemical Name</th>
                <th className="border border-black px-3 py-2 text-left">Code</th>
                <th className="border border-black px-3 py-2 text-left">Make</th>
                <th className="border border-black px-3 py-2 text-left">Batch No.</th>
                <th className="border border-black px-3 py-2 text-left">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredChemicals.map((item: any, index: number) => (
                <tr key={item.slno || item.id || index}>
                  <td className="border border-black px-3 py-2">{item.name || item.chemicalName || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.code || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.make || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.batchNo || item.batchNumber || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{formatDate(item.exp_Date || item.expDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredStandards.length > 0 && (
        <div className="section-container mb-4">
          <h4 className="mb-2 text-md font-bold uppercase">Standards Used</h4>
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">Standard Name</th>
                <th className="border border-black px-3 py-2 text-left">Purity</th>
                <th className="border border-black px-3 py-2 text-left">Make</th>
                <th className="border border-black px-3 py-2 text-left">Batch No.</th>
                <th className="border border-black px-3 py-2 text-left">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStandards.map((item: any, index: number) => (
                <tr key={item.serialNo || item.id || index}>
                  <td className="border border-black px-3 py-2">{item.name || item.standardName || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.purity || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.make || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{item.batchNo || item.batchNumber || "N/A"}</td>
                  <td className="border border-black px-3 py-2">{formatDate(item.exp_Date || item.expDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export const PreparationSection: React.FC<{
  parameter: any;
}> = ({ parameter }) => {
  const preparations = getPreparations(parameter);
  const rows = renderPreparationRows(preparations);

  if (!rows.length) return null;

  return (
    <div className="section-container mb-4">
      <h4 className="mb-2 text-md font-bold uppercase">Preparation Details</h4>

      {rows.map((row) => (
        <div key={row.key} className="mb-4 keep-together">
          <div className="mb-2 bg-gray-100 border border-black px-3 py-2 font-bold">
            {String(row.category)} — {String(row.preparationType)}
          </div>

          {row.steps.length > 0 ? (
            <table className="w-full border border-black text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-12 border border-black px-3 py-2 text-center">#</th>
                  <th className="border border-black px-3 py-2 text-left">Step</th>
                  <th className="border border-black px-3 py-2 text-left">Recorded Details</th>
                </tr>
              </thead>
              <tbody>
                {row.steps.map((step: any, index: number) => (
                  <tr key={`${row.key}-${index}`}>
                    <td className="border border-black px-3 py-2 text-center">{index + 1}</td>
                    <td className="border border-black px-3 py-2">
                      {step.name || step.stepName || "Preparation Step"}
                    </td>
                    <td className="border border-black px-3 py-2">
                      {formatPreparationStep(step)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="border border-black px-3 py-2 text-sm">
              Preparation recorded without step-level details.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const CalculationSection: React.FC<{
  parameter: any;
}> = ({ parameter }) => {
  const calculations = getCalculations(parameter);

  if (!calculations.length) return null;

  return (
    <div className="section-container mb-4">
      <h4 className="mb-2 text-md font-bold uppercase">Calculations / Results</h4>

      {calculations.map((calculation: any, index: number) => {
        const type =
          calculation?.calculationType ||
          calculation?.type ||
          calculation?.name ||
          `Calculation ${index + 1}`;

        const entries =
          calculation && typeof calculation === "object"
            ? Object.entries(calculation).filter(([key]) =>
                !["id", "calculationType", "type", "name"].includes(key)
              )
            : [];

        return (
          <div
            key={calculation?.id || `${type}-${index}`}
            className="mb-4 keep-together"
          >
            <div className="mb-2 bg-gray-100 border border-black px-3 py-2 font-bold">
              {formatCalculationType(type)}
            </div>

            {entries.length > 0 ? (
              <table className="w-full border border-black text-sm">
                <tbody>
                  {entries.map(([key, value]) => (
                    <tr key={key}>
                      <td className="w-1/3 border border-black px-3 py-2 font-semibold">
                        {formatCalculationType(key)}
                      </td>
                      <td className="border border-black px-3 py-2">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value ?? "---")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="border border-black px-3 py-2 text-sm">
                No calculation values recorded.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const AttachedFilesSection: React.FC<{
  parameter: any;
  signature: FileSignatureData;
}> = ({ parameter, signature }) => {
  const files = Array.isArray(parameter?.files) ? parameter.files : [];

  const usableFiles = files.filter(
    (file: any) => file?.fileDataBase64 || file?.base64
  );

  if (!usableFiles.length) return null;

  return (
    <div className="section-container mb-4">
      <h4 className="mb-2 text-md font-bold uppercase">Attached Files</h4>

      {usableFiles.map((file: any, index: number) => {
        const base64 = file.fileDataBase64 || file.base64 || "";
        const fileName = file.fileName || file.name || `file_${index + 1}`;

        const isPdf =
          String(fileName).toLowerCase().endsWith(".pdf") ||
          String(base64).startsWith("JVBER");

        const isImage =
          /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(String(fileName));

        if (isPdf) {
          return (
            <div key={`${fileName}-${index}`}>
              <PdfPageRenderer
                base64={base64}
                fileName={fileName}
                signature={signature}
              />
            </div>
          );
        }

        if (isImage) {
          const extension =
            String(fileName).split(".").pop()?.toLowerCase() || "jpeg";

          return (
            <div
              key={`${fileName}-${index}`}
              className="pdf-page-with-sig"
              style={{
                breakInside: "avoid",
                pageBreakInside: "avoid",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`data:image/${extension};base64,${base64}`}
                  alt={fileName}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>

              <FileSignatureFooter sig={signature} />
            </div>
          );
        }

        return (
          <div
            key={`${fileName}-${index}`}
            className="border border-black px-3 py-2 text-xs text-gray-600"
          >
            {fileName} (preview not available)
          </div>
        );
      })}
    </div>
  );
};
