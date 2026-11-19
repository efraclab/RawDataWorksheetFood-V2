import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { fixedCarbonConfig } from "../config";

export default function FixedCarbonCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={fixedCarbonConfig} {...props} />;
}
