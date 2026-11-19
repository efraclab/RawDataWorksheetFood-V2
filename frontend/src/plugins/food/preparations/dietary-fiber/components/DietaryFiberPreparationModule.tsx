import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailDietaryFiber from "./CalculationDetailDietaryFiber";
import { createCalculationDietaryFiber, restoreCalculationDietaryFiber, createSamplePreparationDietaryFiber } from "../factory";
import SamplePreparationDetailDietaryFiber from "./SamplePreparationDetailDietaryFiber";

const config = {
  id: "food.dietary-fiber",
  preparationType: "dietaryFiber",
  calculationType: "dietaryFiber",
  title: "Dietary Fiber Analysis",
  shortTitle: "Dietary Fiber",
  sampleDetail: SamplePreparationDetailDietaryFiber,
  calculationDetail: CalculationDetailDietaryFiber,
  createSamplePreparation: createSamplePreparationDietaryFiber,
  createCalculation: createCalculationDietaryFiber,
  restoreCalculation: restoreCalculationDietaryFiber,
};

const DietaryFiberPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

DietaryFiberPreparationModule.displayName = "DietaryFiberPreparationModule";

export default DietaryFiberPreparationModule;
