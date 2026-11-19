import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailSugarSaponinCatechinProfile from "./CalculationDetailSugarSaponinCatechinProfile";
import { createCalculationSugarSaponinCatechinProfile, restoreCalculationSugarSaponinCatechinProfile, createSamplePreparationSugarSaponinCatechinProfile } from "../factory";
import SamplePreparationDetailSugarSaponinCatechinProfile from "./SamplePreparationDetailSugarSaponinCatechinProfile";

const config = {
  id: "food.sugar-saponin-catechin-profile",
  preparationType: "sugarSaponinCatechinProfile",
  calculationType: "sugarSaponinCatechinProfile",
  title: "Sugar / Saponin / Catechin Profile Analysis",
  shortTitle: "Sugar/Saponin/Catechin Profile",
  sampleDetail: SamplePreparationDetailSugarSaponinCatechinProfile,
  calculationDetail: CalculationDetailSugarSaponinCatechinProfile,
  createSamplePreparation: createSamplePreparationSugarSaponinCatechinProfile,
  createCalculation: createCalculationSugarSaponinCatechinProfile,
  restoreCalculation: restoreCalculationSugarSaponinCatechinProfile,
};

const SugarSaponinCatechinProfilePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

SugarSaponinCatechinProfilePreparationModule.displayName = "SugarSaponinCatechinProfilePreparationModule";

export default SugarSaponinCatechinProfilePreparationModule;
