import { createSimpleEnvironmentModule } from "../../_shared/SimpleEnvironmentPreparationModule";
import { spmIAQConfig } from "../config";

const SpmIAQPreparationModule = createSimpleEnvironmentModule(spmIAQConfig, "SpmIAQPreparationModule");
export default SpmIAQPreparationModule;
