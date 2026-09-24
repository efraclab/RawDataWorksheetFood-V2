import { createSimpleEnvironmentModule } from "../../_shared/SimpleEnvironmentPreparationModule";
import { soilCa2PlusConfig } from "../config";

const SoilCa2PlusPreparationModule = createSimpleEnvironmentModule(
  soilCa2PlusConfig,
  "SoilCa2PlusPreparationModule",
);

export default SoilCa2PlusPreparationModule;
