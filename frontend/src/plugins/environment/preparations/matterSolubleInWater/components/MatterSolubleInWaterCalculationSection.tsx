import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { matterSolubleInWaterConfig } from "../config";

export default function MatterSolubleInWaterCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={matterSolubleInWaterConfig} {...props} />;
}
