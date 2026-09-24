import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilAvailableSulphurConfig } from "../config";

export default function SoilAvailableSulphurCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={soilAvailableSulphurConfig} {...props} />;
}
