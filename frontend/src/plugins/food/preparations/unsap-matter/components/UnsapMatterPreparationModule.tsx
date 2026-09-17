import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailUnsapMatter from "./CalculationDetailUnsapMatter";
import { createCalculationUnsapMatter, restoreCalculationUnsapMatter, createSamplePreparationUnsapMatter } from "../factory";
import SamplePreparationDetailUnsapMatter from "./SamplePreparationDetailUnsapMatter";

const config = {
  id: "food.unsap-matter",
  preparationType: "unsapMatter",
  calculationType: "unsapMatter",
  title: "Unsaponifiable Matter Analysis",
  shortTitle: "Unsaponifiable Matter",
  sampleDetail: SamplePreparationDetailUnsapMatter,
  calculationDetail: CalculationDetailUnsapMatter,
  createSamplePreparation: createSamplePreparationUnsapMatter,
  createCalculation: createCalculationUnsapMatter,
  restoreCalculation: restoreCalculationUnsapMatter,
};

const UnsapMatterPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

UnsapMatterPreparationModule.displayName = "UnsapMatterPreparationModule";

export default UnsapMatterPreparationModule;
