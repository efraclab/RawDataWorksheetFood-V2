import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailFattyAcidProfile from "./CalculationDetailFattyAcidProfile";
import { createCalculationFattyAcidProfile, restoreCalculationFattyAcidProfile, createSamplePreparationFattyAcidProfile } from "../factory";
import SamplePreparationDetailFattyAcidProfile from "./SamplePreparationDetailFattyAcidProfile";

const config = {
  id: "food.fatty-acid-profile",
  preparationType: "fattyAcidProfile",
  calculationType: "fattyAcidProfile",
  title: "Fatty Acid Profile Analysis",
  shortTitle: "Fatty Acid Profile",
  sampleDetail: SamplePreparationDetailFattyAcidProfile,
  calculationDetail: CalculationDetailFattyAcidProfile,
  createSamplePreparation: createSamplePreparationFattyAcidProfile,
  createCalculation: createCalculationFattyAcidProfile,
  restoreCalculation: restoreCalculationFattyAcidProfile,
};

const FattyAcidProfilePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

FattyAcidProfilePreparationModule.displayName = "FattyAcidProfilePreparationModule";

export default FattyAcidProfilePreparationModule;
