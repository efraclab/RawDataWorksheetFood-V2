import type { LabPlugin } from "../../core/plugin";
import { metalPreparationRegistry } from "./preparation-engine/metalPreparationRegistry";

const metalPlugin: LabPlugin = {
  id: "metal",
  name: "Metal",
  description: "Metal laboratory worksheet, preparation, analysis and approval functionality.",
  preparations: metalPreparationRegistry,
};

export default metalPlugin;
