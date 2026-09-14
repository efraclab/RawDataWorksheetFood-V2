import React from "react";
import V1StyleLabPrintReport, { type V1ReportProps } from "../../../core/reporting/V1StyleLabPrintReport";

const GasPrintReport: React.FC<V1ReportProps> = (props) => (
  <V1StyleLabPrintReport {...props} lab="gas" />
);

export default GasPrintReport;
