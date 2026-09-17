import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailSulphurDioxide from "./CalculationDetailSulphurDioxide";
import { createCalculationSulphurDioxide, restoreCalculationSulphurDioxide, createSamplePreparationSulphurDioxide } from "../factory";
import SamplePreparationDetailSulphurDioxide from "./SamplePreparationDetailSulphurDioxide";

const config = {
  id: "food.sulphur-dioxide",
  preparationType: "sulphurDioxide",
  calculationType: "sulphurDioxide",
  title: "Sulphur Dioxide Analysis",
  shortTitle: "Sulphur Dioxide",
  sampleDetail: SamplePreparationDetailSulphurDioxide,
  calculationDetail: CalculationDetailSulphurDioxide,
  createSamplePreparation: createSamplePreparationSulphurDioxide,
  createCalculation: createCalculationSulphurDioxide,
  restoreCalculation: restoreCalculationSulphurDioxide,
};

const SulphurDioxidePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

SulphurDioxidePreparationModule.displayName = "SulphurDioxidePreparationModule";

export default SulphurDioxidePreparationModule;
