import { createSimpleEnvironmentModule } from "../../_shared/SimpleEnvironmentPreparationModule";
import { gcvConfig } from "../config";

const GcvPreparationModule = createSimpleEnvironmentModule(gcvConfig, "GcvPreparationModule");
export default GcvPreparationModule;
