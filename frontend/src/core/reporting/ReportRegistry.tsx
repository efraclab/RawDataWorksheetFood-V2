import React from "react";
import FoodPrintReport from "../../plugins/food/reporting/FoodPrintReport";
import MetalPrintReport from "../../plugins/metal/reporting/MetalPrintReport";
import EnvironmentPrintReport from "../../plugins/environment/reporting/EnvironmentPrintReport";
import WaterPrintReport from "../../plugins/water/reporting/WaterPrintReport";
import GasPrintReport from "../../plugins/gas/reporting/GasPrintReport";
import MicroPrintReport from "../../plugins/micro/reporting/MicroPrintReport";
import RAPrintReport from "../../plugins/ra/reporting/RAPrintReport";
import type { V1ReportProps } from "./V1StyleLabPrintReport";

export type ReportLab = "food"|"metal"|"environment"|"water"|"gas"|"micro"|"ra"|"drug";

export function normalizeReportLab(value: unknown): ReportLab {
  const s = String(value ?? "").trim().toLowerCase();
  if (s.includes("environment") || s === "env") return "environment";
  if (s.includes("water")) return "water";
  if (s.includes("gas")) return "gas";
  if (s.includes("micro")) return "micro";
  if (s.includes("metal")) return "metal";
  if (s === "ra" || s.includes("regulatory")) return "ra";
  if (s.includes("drug") || s.includes("pharma")) return "drug";
  return "food";
}

export function getReportComponent(lab: unknown): React.ComponentType<V1ReportProps> {
  switch (normalizeReportLab(lab)) {
    case "metal": return MetalPrintReport;
    case "environment": return EnvironmentPrintReport;
    case "water": return WaterPrintReport;
    case "gas": return GasPrintReport;
    case "micro": return MicroPrintReport;
    case "ra": return RAPrintReport;
    case "drug": return FoodPrintReport; // same V1 UI shell; keep existing Drug report if desired
    default: return FoodPrintReport;
  }
}
