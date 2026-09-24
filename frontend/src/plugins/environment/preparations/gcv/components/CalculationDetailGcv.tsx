import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { gcvConfig } from "../config";

export default function CalculationDetailGcv(props: any) {
  return <SimpleEnvironmentCalculationDetail config={gcvConfig} {...props} />;
}
