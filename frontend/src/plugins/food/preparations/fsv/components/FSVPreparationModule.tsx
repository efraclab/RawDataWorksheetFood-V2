import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailFSV from "./CalculationDetailFSV";
import { createCalculationFSV, restoreCalculationFSV, createSamplePreparationFSV } from "../factory";
import SamplePreparationDetailFSV from "./SamplePreparationDetailFSV";

const config = {
  id: "food.fsv",
  preparationType: "fsv",
  calculationType: "fsv",
  title: "FSV (A, D, E, K) Analysis",
  shortTitle: "FSV",
  sampleDetail: SamplePreparationDetailFSV,
  calculationDetail: CalculationDetailFSV,
  createSamplePreparation: createSamplePreparationFSV,
  createCalculation: createCalculationFSV,
  restoreCalculation: restoreCalculationFSV,
};

const FSVPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

FSVPreparationModule.displayName = "FSVPreparationModule";

export default FSVPreparationModule;
