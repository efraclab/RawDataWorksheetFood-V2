import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { cs2StackConfig } from "../config";

export default function CalculationDetailCs2Stack(props: any) {
  return <SimpleEnvironmentCalculationDetail config={cs2StackConfig} {...props} />;
}
