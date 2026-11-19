import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailArtificialColour from "./CalculationDetailArtificialColour";
import { createCalculationArtificialColour, restoreCalculationArtificialColour, createSamplePreparationArtificialColour } from "../factory";
import SamplePreparationDetailArtificialColour from "./SamplePreparationDetailArtificialColour";

const config = {
  id: "food.artificial-colour",
  preparationType: "artificialColour",
  calculationType: "artificialColour",
  title: "Artificial Colour Analysis",
  shortTitle: "Artificial Colour",
  sampleDetail: SamplePreparationDetailArtificialColour,
  calculationDetail: CalculationDetailArtificialColour,
  createSamplePreparation: createSamplePreparationArtificialColour,
  createCalculation: createCalculationArtificialColour,
  restoreCalculation: restoreCalculationArtificialColour,
};

const ArtificialColourPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

ArtificialColourPreparationModule.displayName = "ArtificialColourPreparationModule";

export default ArtificialColourPreparationModule;
