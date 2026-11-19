import { createSimpleEnvironmentModule } from "../../_shared/SimpleEnvironmentPreparationModule";
import { soilMoistureConfig } from "../config";

const SoilMoisturePreparationModule = createSimpleEnvironmentModule(soilMoistureConfig, "SoilMoisturePreparationModule");
export default SoilMoisturePreparationModule;
