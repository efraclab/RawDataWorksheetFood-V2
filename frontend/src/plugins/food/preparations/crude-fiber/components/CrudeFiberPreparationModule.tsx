import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailCrudeFiber from "./CalculationDetailCrudeFiber";
import { createCalculationCrudeFiber, restoreCalculationCrudeFiber, createSamplePreparationCrudeFiber } from "../factory";
import SamplePreparationDetailCrudeFiber from "./SamplePreparationDetailCrudeFiber";

const config = {
  id: "food.crude-fiber",
  preparationType: "crudeFiber",
  calculationType: "crudeFiber",
  title: "Crude Fiber Analysis",
  shortTitle: "Crude Fiber",
  sampleDetail: SamplePreparationDetailCrudeFiber,
  calculationDetail: CalculationDetailCrudeFiber,
  createSamplePreparation: createSamplePreparationCrudeFiber,
  createCalculation: createCalculationCrudeFiber,
  restoreCalculation: restoreCalculationCrudeFiber,
};

const CrudeFiberPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

CrudeFiberPreparationModule.displayName = "CrudeFiberPreparationModule";

export default CrudeFiberPreparationModule;
