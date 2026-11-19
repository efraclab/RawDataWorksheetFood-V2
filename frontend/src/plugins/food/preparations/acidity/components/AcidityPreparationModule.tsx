import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailAcidity from "./CalculationDetailAcidity";
import { createCalculationAcidity, restoreCalculationAcidity, createSamplePreparationAcidity } from "../factory";
import SamplePreparationDetailAcidity from "./SamplePreparationDetailAcidity";

const config = {
  id: "food.acidity",
  preparationType: "acidity",
  calculationType: "acidity",
  title: "Acidity Analysis",
  shortTitle: "Acidity",
  sampleDetail: SamplePreparationDetailAcidity,
  calculationDetail: CalculationDetailAcidity,
  createSamplePreparation: createSamplePreparationAcidity,
  createCalculation: createCalculationAcidity,
  restoreCalculation: restoreCalculationAcidity,
};

const AcidityPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

AcidityPreparationModule.displayName = "AcidityPreparationModule";

export default AcidityPreparationModule;
