import { createSimpleEnvironmentModule } from "../../_shared/SimpleEnvironmentPreparationModule";
import { soilOrganicCarbonMatterConfig } from "../config";

const SoilOrganicCarbonMatterPreparationModule = createSimpleEnvironmentModule(
  soilOrganicCarbonMatterConfig,
  "SoilOrganicCarbonMatterPreparationModule",
);

export default SoilOrganicCarbonMatterPreparationModule;
