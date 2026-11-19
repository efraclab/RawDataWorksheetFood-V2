import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailCholesterol from "./CalculationDetailCholesterol";
import { createCalculationCholesterol, restoreCalculationCholesterol, createSamplePreparationCholesterol } from "../factory";
import SamplePreparationDetailCholesterol from "./SamplePreparationDetailCholesterol";

const config = {
  id: "food.cholesterol",
  preparationType: "cholesterol",
  calculationType: "cholesterol",
  title: "Cholesterol Analysis",
  shortTitle: "Cholesterol",
  sampleDetail: SamplePreparationDetailCholesterol,
  calculationDetail: CalculationDetailCholesterol,
  createSamplePreparation: createSamplePreparationCholesterol,
  createCalculation: createCalculationCholesterol,
  restoreCalculation: restoreCalculationCholesterol,
};

const CholesterolPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

CholesterolPreparationModule.displayName = "CholesterolPreparationModule";

export default CholesterolPreparationModule;
