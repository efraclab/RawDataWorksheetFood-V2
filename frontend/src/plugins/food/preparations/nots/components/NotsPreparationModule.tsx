import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailNots from "./CalculationDetailNots";
import { createCalculationNots, restoreCalculationNots, createSamplePreparationNots } from "../factory";
import SamplePreparationDetailNots from "./SamplePreparationDetailNots";

const config = {
  id: "food.nots",
  preparationType: "nots",
  calculationType: "nots",
  title: "NOTS Analysis",
  shortTitle: "NOTS",
  sampleDetail: SamplePreparationDetailNots,
  calculationDetail: CalculationDetailNots,
  createSamplePreparation: createSamplePreparationNots,
  createCalculation: createCalculationNots,
  restoreCalculation: restoreCalculationNots,
};

const NotsPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

NotsPreparationModule.displayName = "NotsPreparationModule";

export default NotsPreparationModule;
