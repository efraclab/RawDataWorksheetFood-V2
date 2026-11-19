import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailPreservative from "./CalculationDetailPreservative";
import { createCalculationPreservative, restoreCalculationPreservative, createSamplePreparationPreservative } from "../factory";
import SamplePreparationDetailPreservative from "./SamplePreparationDetailPreservative";

const config = {
  id: "food.preservative",
  preparationType: "preservative",
  calculationType: "preservative",
  title: "Preservative Analysis",
  shortTitle: "Preservative",
  sampleDetail: SamplePreparationDetailPreservative,
  calculationDetail: CalculationDetailPreservative,
  createSamplePreparation: createSamplePreparationPreservative,
  createCalculation: createCalculationPreservative,
  restoreCalculation: restoreCalculationPreservative,
};

const PreservativePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

PreservativePreparationModule.displayName = "PreservativePreparationModule";

export default PreservativePreparationModule;
