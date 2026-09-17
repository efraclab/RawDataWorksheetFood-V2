import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailProtein from "./CalculationDetailProtein";
import { createCalculationProtein, restoreCalculationProtein, createSamplePreparationProtein } from "../factory";
import SamplePreparationDetailProtein from "./SamplePreparationDetailProtein";

const config = {
  id: "food.protein",
  preparationType: "protein",
  calculationType: "protein",
  title: "Protein Analysis",
  shortTitle: "Protein",
  sampleDetail: SamplePreparationDetailProtein,
  calculationDetail: CalculationDetailProtein,
  createSamplePreparation: createSamplePreparationProtein,
  createCalculation: createCalculationProtein,
  restoreCalculation: restoreCalculationProtein,
};

const ProteinPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

ProteinPreparationModule.displayName = "ProteinPreparationModule";

export default ProteinPreparationModule;
