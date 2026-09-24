import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { matterSolubleInWaterConfig } from "../config";

export default function CalculationDetailMatterSolubleInWater(props: any) {
  return <SimpleEnvironmentCalculationDetail config={matterSolubleInWaterConfig} {...props} />;
}
