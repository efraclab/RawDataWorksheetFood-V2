import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilAvailablePhosphorousConfig } from "../config";

export default function SoilAvailablePhosphorousCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={soilAvailablePhosphorousConfig} {...props} />;
}
