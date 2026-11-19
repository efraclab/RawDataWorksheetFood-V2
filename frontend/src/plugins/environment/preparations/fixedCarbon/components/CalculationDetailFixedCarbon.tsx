import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { fixedCarbonConfig } from "../config";

export default function CalculationDetailFixedCarbon(props: any) {
  return <SimpleEnvironmentCalculationDetail config={fixedCarbonConfig} {...props} />;
}
