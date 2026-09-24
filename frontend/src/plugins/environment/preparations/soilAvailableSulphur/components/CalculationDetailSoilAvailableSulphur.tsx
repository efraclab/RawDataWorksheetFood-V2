import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilAvailableSulphurConfig } from "../config";

export default function CalculationDetailSoilAvailableSulphur(props: any) {
  return <SimpleEnvironmentCalculationDetail config={soilAvailableSulphurConfig} {...props} />;
}
