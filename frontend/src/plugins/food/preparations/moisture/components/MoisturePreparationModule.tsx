import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailMoisture from "./CalculationDetailMoisture";
import { createCalculationMoisture, restoreCalculationMoisture, createSamplePreparationMoisture } from "../factory";
import SamplePreparationDetailMoisture from "./SamplePreparationDetailMoisture";

const config = {
  id: "food.moisture",
  preparationType: "moisture",
  calculationType: "moisture",
  title: "Moisture Analysis",
  shortTitle: "Moisture",
  sampleDetail: SamplePreparationDetailMoisture,
  calculationDetail: CalculationDetailMoisture,
  createSamplePreparation: createSamplePreparationMoisture,
  createCalculation: createCalculationMoisture,
  restoreCalculation: restoreCalculationMoisture,
};

const MoisturePreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

MoisturePreparationModule.displayName = "MoisturePreparationModule";

export default MoisturePreparationModule;
