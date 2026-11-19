import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { volatileMatterConfig } from "../config";

export default function CalculationDetailVolatileMatter(props: any) {
  return <SimpleEnvironmentCalculationDetail config={volatileMatterConfig} {...props} />;
}
