import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailSugar from "./CalculationDetailSugar";
import { createCalculationSugar, restoreCalculationSugar, createSamplePreparationSugar } from "../factory";
import SamplePreparationDetailSugar from "./SamplePreparationDetailSugar";

const config = {
  id: "food.sugar",
  preparationType: "sugar",
  calculationType: "sugar",
  title: "Total Sugar Analysis",
  shortTitle: "Total Sugar",
  sampleDetail: SamplePreparationDetailSugar,
  calculationDetail: CalculationDetailSugar,
  createSamplePreparation: createSamplePreparationSugar,
  createCalculation: createCalculationSugar,
  restoreCalculation: restoreCalculationSugar,
};

const SugarPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

SugarPreparationModule.displayName = "SugarPreparationModule";

export default SugarPreparationModule;
