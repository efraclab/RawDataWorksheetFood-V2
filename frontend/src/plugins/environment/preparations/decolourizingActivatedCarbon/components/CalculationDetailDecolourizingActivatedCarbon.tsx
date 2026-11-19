import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { decolourizingActivatedCarbonConfig } from "../config";

export default function CalculationDetailDecolourizingActivatedCarbon(props: any) {
  return <SimpleEnvironmentCalculationDetail config={decolourizingActivatedCarbonConfig} {...props} />;
}
