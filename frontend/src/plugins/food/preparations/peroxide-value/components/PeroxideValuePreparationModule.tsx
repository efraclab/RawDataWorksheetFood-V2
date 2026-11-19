import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailPeroxideValue from "./CalculationDetailPeroxideValue";
import { createCalculationPeroxideValue, restoreCalculationPeroxideValue, createSamplePreparationPeroxideValue } from "../factory";
import SamplePreparationDetailPeroxideValue from "./SamplePreparationDetailPeroxideValue";

const config = {
  id: "food.peroxide-value",
  preparationType: "peroxideValue",
  calculationType: "peroxideValue",
  title: "Peroxide Value Analysis",
  shortTitle: "Peroxide Value",
  sampleDetail: SamplePreparationDetailPeroxideValue,
  calculationDetail: CalculationDetailPeroxideValue,
  createSamplePreparation: createSamplePreparationPeroxideValue,
  createCalculation: createCalculationPeroxideValue,
  restoreCalculation: restoreCalculationPeroxideValue,
};

const PeroxideValuePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

PeroxideValuePreparationModule.displayName = "PeroxideValuePreparationModule";

export default PeroxideValuePreparationModule;
