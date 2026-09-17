import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailSaponificationValue from "./CalculationDetailSaponificationValue";
import { createCalculationSaponificationValue, restoreCalculationSaponificationValue, createSamplePreparationSaponificationValue } from "../factory";
import SamplePreparationDetailSaponificationValue from "./SamplePreparationDetailSaponificationValue";

const config = {
  id: "food.saponification-value",
  preparationType: "saponificationValue",
  calculationType: "saponificationValue",
  title: "Saponification Value Analysis",
  shortTitle: "Saponification Value",
  sampleDetail: SamplePreparationDetailSaponificationValue,
  calculationDetail: CalculationDetailSaponificationValue,
  createSamplePreparation: createSamplePreparationSaponificationValue,
  createCalculation: createCalculationSaponificationValue,
  restoreCalculation: restoreCalculationSaponificationValue,
};

const SaponificationValuePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

SaponificationValuePreparationModule.displayName = "SaponificationValuePreparationModule";

export default SaponificationValuePreparationModule;
