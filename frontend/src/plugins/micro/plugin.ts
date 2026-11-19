import type { LabPlugin } from "../../core/plugin";
import { microPreparationRegistry } from "./preparation-engine/microPreparationRegistry";

const microPlugin: LabPlugin = {
  id: "micro",
  name: "Micro",
  description: "Microbiology laboratory plugin.",
  preparations: microPreparationRegistry,
};

export default microPlugin;