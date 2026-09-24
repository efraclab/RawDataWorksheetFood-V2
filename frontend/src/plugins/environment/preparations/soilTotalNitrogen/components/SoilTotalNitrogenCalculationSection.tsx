import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilTotalNitrogenConfig } from "../config";

export default function SoilTotalNitrogenCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={soilTotalNitrogenConfig} {...props} />;
}
