import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilMoistureConfig } from "../config";

export default function CalculationDetailSoilMoisture(props: any) {
  return <SimpleEnvironmentCalculationDetail config={soilMoistureConfig} {...props} />;
}
