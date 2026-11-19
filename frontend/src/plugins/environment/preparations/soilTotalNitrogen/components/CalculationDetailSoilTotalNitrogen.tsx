import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { soilTotalNitrogenConfig } from "../config";

export default function CalculationDetailSoilTotalNitrogen(props: any) {
  return <SimpleEnvironmentCalculationDetail config={soilTotalNitrogenConfig} {...props} />;
}
