import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailFAT from "./CalculationDetailFAT";
import { createCalculationFat, restoreCalculationFat, createSamplePreparationFat } from "../factory";
import SamplePreparationDetailFat from "./SamplePreparationDetailFat";

const config = {
  id: "food.fat",
  preparationType: "fat",
  calculationType: "fat",
  title: "FAT Analysis",
  shortTitle: "FAT",
  sampleDetail: SamplePreparationDetailFat,
  calculationDetail: CalculationDetailFAT,
  createSamplePreparation: createSamplePreparationFat,
  createCalculation: createCalculationFat,
  restoreCalculation: restoreCalculationFat,
};

const FatPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

FatPreparationModule.displayName = "FatPreparationModule";

export default FatPreparationModule;
