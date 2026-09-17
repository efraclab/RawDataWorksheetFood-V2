import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailArtificialSweetner from "./CalculationDetailArtificialSweetner";
import { createCalculationArtificialSweetner, restoreCalculationArtificialSweetner, createSamplePreparationArtificialSweetner } from "../factory";
import SamplePreparationDetailArtificialSweetner from "./SamplePreparationDetailArtificialSweetner";

const config = {
  id: "food.artificial-sweetner",
  preparationType: "artificialSweetner",
  calculationType: "artificialSweetner",
  title: "Artificial Sweetener Analysis",
  shortTitle: "Artificial Sweetener",
  sampleDetail: SamplePreparationDetailArtificialSweetner,
  calculationDetail: CalculationDetailArtificialSweetner,
  createSamplePreparation: createSamplePreparationArtificialSweetner,
  createCalculation: createCalculationArtificialSweetner,
  restoreCalculation: restoreCalculationArtificialSweetner,
};

const ArtificialSweetnerPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

ArtificialSweetnerPreparationModule.displayName = "ArtificialSweetnerPreparationModule";

export default ArtificialSweetnerPreparationModule;
