import React from "react";
import type { ReportContext } from "./types";
import type { FileSignatureData } from "./components/ReportPrimitives";

import {
  AttachedFilesSection,
  CalculationSection,
  PreparationSection,
  ReferenceTables,
  ReportHeader,
  ReportPrintStyles,
  ReportToolbar,
  SampleParticulars,
  formatDate,
  getParameterCode,
  getParameterName,
} from "./components/ReportPrimitives";

export interface LabPrintReportProps extends ReportContext {
  title?: string;
  showMedia?: boolean;
}

const LabPrintReport: React.FC<LabPrintReportProps> = ({
  worksheetInfo,
  sampleData,
  analysts,
  instruments,
  chemicals,
  standards = [],
  media = [],
  onClose,
  lab,
  title,
  showMedia = false,
}) => {
  const parameters: any[] = Array.isArray((worksheetInfo as any)?.parameters)
    ? ((worksheetInfo as any).parameters as any[])
    : [];

  const handlePrint = () => window.print();

  const mediaById = new Map(
    (media || []).map((item: any) => [String(item.id), item])
  );

  return (
    <>
      <ReportPrintStyles />

      <div className="report-print-root min-h-screen bg-white text-black">
        <ReportToolbar onPrint={handlePrint} onClose={onClose} />

        <main className="p-5">
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold uppercase">
              {title || `${lab} Print Report`}
            </h1>
            <div className="mt-1 text-xs">
              Generated: {formatDate(new Date().toISOString())}
            </div>
          </div>

          <ReportHeader
            context={{
              worksheetInfo,
              sampleData,
              analysts,
              instruments,
              chemicals,
              standards,
              media,
              onClose,
              lab,
            }}
            parameterCount={parameters.length}
          />

          {parameters.map((parameter, parameterIndex) => {
            const signature: FileSignatureData = {
              analyzedByName:
                parameter?.analyzedByName ||
                parameter?.analysisCompletedByName ||
                null,
              analysisCompletionDate:
                parameter?.analysisCompletionDate || null,
              approvedByReviewerName:
                parameter?.approvedByReviewerName || null,
              approvedAtReviewer:
                parameter?.approvedAtReviewer || null,
            };

            const context: ReportContext = {
              worksheetInfo,
              sampleData,
              analysts,
              instruments,
              chemicals,
              standards,
              media,
              onClose,
              lab,
            };

            return (
              <section
                key={parameter?.id ?? parameterIndex}
                className={parameterIndex > 0 ? "page-break-before" : ""}
              >
                <div className="keep-together">
                  <h2 className="mb-3 border border-black bg-gray-200 px-3 py-2 text-lg font-bold uppercase">
                    Parameter: {getParameterName(parameter)} ({getParameterCode(parameter)})
                  </h2>
                </div>

                <SampleParticulars
                  context={context}
                  parameter={parameter}
                />

                <ReferenceTables
                  context={context}
                  parameter={parameter}
                />

                {showMedia && Array.isArray(parameter?.mediaIds) && parameter.mediaIds.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="mb-2 text-md font-bold uppercase">Media Used</h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left">Media Id</th>
                          <th className="border border-black px-3 py-2 text-left">Media Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameter.mediaIds.map((id: any, index: number) => {
                          const item: any = mediaById.get(String(id));
                          return (
                            <tr key={`${id}-${index}`}>
                              <td className="border border-black px-3 py-2">{String(id)}</td>
                              <td className="border border-black px-3 py-2">
                                {item?.name || item?.mediaName || "N/A"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <PreparationSection parameter={parameter} />
                <CalculationSection parameter={parameter} />
                <AttachedFilesSection
                  parameter={parameter}
                  signature={signature}
                />

                <div className="mt-5 keep-together">
                  <table className="w-full border border-black text-sm">
                    <tbody>
                      <tr>
                        <td className="w-1/4 border border-black px-3 py-2">Analyzed By</td>
                        <td className="w-1/4 border border-black px-3 py-2 font-bold">
                          {signature.analyzedByName || "---"}
                        </td>
                        <td className="w-1/4 border border-black px-3 py-2">Analysis Completed On</td>
                        <td className="w-1/4 border border-black px-3 py-2 font-bold">
                          {formatDate(signature.analysisCompletionDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2">Reviewed By</td>
                        <td className="border border-black px-3 py-2 font-bold">
                          {signature.approvedByReviewerName || "---"}
                        </td>
                        <td className="border border-black px-3 py-2">Reviewed On</td>
                        <td className="border border-black px-3 py-2 font-bold">
                          {formatDate(signature.approvedAtReviewer)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </>
  );
};

export default LabPrintReport;
