import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailCarbohydrate from "./CalculationDetailCarbohydrate";
import { createCalculationCarbohydrate, restoreCalculationCarbohydrate, createSamplePreparationCarbohydrate } from "../factory";
import SamplePreparationDetailCarbohydrate from "./SamplePreparationDetailCarbohydrate";

const config = {
  id: "food.carbohydrate",
  preparationType: "carbohydrate",
  calculationType: "carbohydrate",
  title: "Carbohydrate Analysis",
  shortTitle: "Carbohydrate",
  sampleDetail: SamplePreparationDetailCarbohydrate,
  calculationDetail: CalculationDetailCarbohydrate,
  createSamplePreparation: createSamplePreparationCarbohydrate,
  createCalculation: createCalculationCarbohydrate,
  restoreCalculation: restoreCalculationCarbohydrate,
};

const CarbohydratePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

CarbohydratePreparationModule.displayName = "CarbohydratePreparationModule";

export default CarbohydratePreparationModule;
