import React from "react";
import V1StyleLabPrintReport, { type V1ReportProps } from "../../../core/reporting/V1StyleLabPrintReport";

const EnvironmentPrintReport: React.FC<V1ReportProps> = (props) => (
  <V1StyleLabPrintReport {...props} lab="environment" />
);

export default EnvironmentPrintReport;
