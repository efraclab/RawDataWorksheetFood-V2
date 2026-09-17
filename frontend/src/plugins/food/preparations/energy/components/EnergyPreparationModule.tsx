import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailEnergy from "./CalculationDetailEnergy";
import { createCalculationEnergy, restoreCalculationEnergy, createSamplePreparationEnergy } from "../factory";
import SamplePreparationDetailEnergy from "./SamplePreparationDetailEnergy";

const config = {
  id: "food.energy",
  preparationType: "energy",
  calculationType: "energy",
  title: "Energy Analysis",
  shortTitle: "Energy",
  sampleDetail: SamplePreparationDetailEnergy,
  calculationDetail: CalculationDetailEnergy,
  createSamplePreparation: createSamplePreparationEnergy,
  createCalculation: createCalculationEnergy,
  restoreCalculation: restoreCalculationEnergy,
};

const EnergyPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

EnergyPreparationModule.displayName = "EnergyPreparationModule";

export default EnergyPreparationModule;
