import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailAcidValue from "./CalculationDetailAcidValue";
import { createCalculationAcidValue, restoreCalculationAcidValue, createSamplePreparationAcidValue } from "../factory";
import SamplePreparationDetailAcidValue from "./SamplePreparationDetailAcidValue";

const config = {
  id: "food.acid-value",
  preparationType: "acidValue",
  calculationType: "acidValue",
  title: "Acid Value Analysis",
  shortTitle: "Acid Value",
  sampleDetail: SamplePreparationDetailAcidValue,
  calculationDetail: CalculationDetailAcidValue,
  createSamplePreparation: createSamplePreparationAcidValue,
  createCalculation: createCalculationAcidValue,
  restoreCalculation: restoreCalculationAcidValue,
};

const AcidValuePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

AcidValuePreparationModule.displayName = "AcidValuePreparationModule";

export default AcidValuePreparationModule;
