import React from "react";
import V1StyleLabPrintReport, {
  type V1ReportProps,
} from "../../../core/reporting/V1StyleLabPrintReport";

const FoodPrintReport: React.FC<V1ReportProps> = (props) => (
  <V1StyleLabPrintReport {...props} lab="food" />
);

export default FoodPrintReport;
