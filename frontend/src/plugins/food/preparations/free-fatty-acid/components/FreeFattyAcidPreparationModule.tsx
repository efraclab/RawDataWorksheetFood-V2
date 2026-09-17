import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailFreeFattyAcid from "./CalculationDetailFreeFattyAcid";
import { createCalculationFreeFattyAcid, restoreCalculationFreeFattyAcid, createSamplePreparationFreeFattyAcid } from "../factory";
import SamplePreparationDetailFreeFattyAcid from "./SamplePreparationDetailFreeFattyAcid";

const config = {
  id: "food.free-fatty-acid",
  preparationType: "freeFattyAcid",
  calculationType: "freeFattyAcid",
  title: "Free Fatty Acid Analysis",
  shortTitle: "Free Fatty Acid",
  sampleDetail: SamplePreparationDetailFreeFattyAcid,
  calculationDetail: CalculationDetailFreeFattyAcid,
  createSamplePreparation: createSamplePreparationFreeFattyAcid,
  createCalculation: createCalculationFreeFattyAcid,
  restoreCalculation: restoreCalculationFreeFattyAcid,
};

const FreeFattyAcidPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

FreeFattyAcidPreparationModule.displayName = "FreeFattyAcidPreparationModule";

export default FreeFattyAcidPreparationModule;
