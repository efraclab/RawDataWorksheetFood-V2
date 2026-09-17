import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailWsv from "./CalculationDetailWsv";
import { createCalculationWsv, restoreCalculationWsv, createSamplePreparationWsv } from "../factory";
import SamplePreparationDetailWsv from "./SamplePreparationDetailWsv";

const config = {
  id: "food.wsv",
  preparationType: "wsv",
  calculationType: "wsv",
  title: "WSV (Water Soluble Vitamins) Analysis",
  shortTitle: "WSV",
  sampleDetail: SamplePreparationDetailWsv,
  calculationDetail: CalculationDetailWsv,
  createSamplePreparation: createSamplePreparationWsv,
  createCalculation: createCalculationWsv,
  restoreCalculation: restoreCalculationWsv,
};

const WsvPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

WsvPreparationModule.displayName = "WsvPreparationModule";

export default WsvPreparationModule;
