import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailUricAcid from "./CalculationDetailUricAcid";
import { createCalculationUricAcid, restoreCalculationUricAcid, createSamplePreparationUricAcid } from "../factory";
import SamplePreparationDetailUricAcid from "./SamplePreparationDetailUricAcid";

const config = {
  id: "food.uric-acid",
  preparationType: "uricAcid",
  calculationType: "uricAcid",
  title: "Uric Acid Analysis",
  shortTitle: "Uric Acid",
  sampleDetail: SamplePreparationDetailUricAcid,
  calculationDetail: CalculationDetailUricAcid,
  createSamplePreparation: createSamplePreparationUricAcid,
  createCalculation: createCalculationUricAcid,
  restoreCalculation: restoreCalculationUricAcid,
};

const UricAcidPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

UricAcidPreparationModule.displayName = "UricAcidPreparationModule";

export default UricAcidPreparationModule;
