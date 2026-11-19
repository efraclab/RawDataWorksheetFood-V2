import type { ReactNode } from "react";

/**
 * Core reporting contracts.
 *
 * IMPORTANT:
 * The Core Reporting layer must not depend on laboratory/plugin model
 * locations such as:
 *   ../../preparation_models/...
 *
 * Current V2 keeps laboratory-specific models inside the corresponding
 * plugin. Reporting is a shared Core service and therefore accepts the
 * persisted/report DTO shape without importing Food/Metal/Environment/etc.
 *
 * This also keeps the reporting layer compatible with every laboratory
 * plugin without creating circular or broken model dependencies.
 */

export type ReportValue = any;
export type ReportItem = any;
export type ReportParameter = any;
export type ReportWorksheet = any;
export type ReportSampleData = any;
export type ReportAnalyst = any;
export type ReportInstrument = any;
export type ReportChemical = any;
export type ReportStandard = any;
export type ReportMedia = any;

export interface PrintReportProps {
  /**
   * Current worksheet/report data.
   *
   * Kept intentionally decoupled from a plugin model because the same
   * reporting contract is used by Food, Metal, Environment, Water, Gas,
   * Micro, RA and Drug.
   */
  worksheetInfo: ReportWorksheet;

  /**
   * Current V2 parameter collection.
   *
   * WorksheetDetails supplies this when the report is opened so the report
   * prints the exact parameter state currently displayed/restored by V2.
   */
  parameters?: ReportParameter[];

  /**
   * Optional report context data.
   *
   * These remain optional because individual lab reports may obtain the
   * information directly from worksheetInfo/parameters.
   */
  sampleData?: ReportSampleData;
  analysts?: ReportAnalyst[];
  instruments?: ReportInstrument[];
  chemicals?: ReportChemical[];
  standards?: ReportStandard[];
  media?: ReportMedia[];

  /**
   * Called when the report overlay is closed.
   */
  onClose: () => void;
}

export interface ReportContext extends PrintReportProps {
  /**
   * Normalized laboratory identifier, for example:
   * food, metal, environment, water, gas, micro, ra, drug.
   */
  lab: string;
}

export interface LabReportDefinition {
  id: string;
  label: string;
  render: (context: ReportContext) => ReactNode;
}

/**
 * Common report component contract.
 *
 * Lab-specific wrappers can simply forward these props to the common
 * V1-style report renderer.
 */
export type LabPrintReportComponent = (
  props: PrintReportProps
) => ReactNode;
