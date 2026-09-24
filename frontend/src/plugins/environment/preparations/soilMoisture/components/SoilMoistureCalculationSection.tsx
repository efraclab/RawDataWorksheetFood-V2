import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilMoistureConfig } from "../config";

export default function SoilMoistureCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={soilMoistureConfig} {...props} />;
}
