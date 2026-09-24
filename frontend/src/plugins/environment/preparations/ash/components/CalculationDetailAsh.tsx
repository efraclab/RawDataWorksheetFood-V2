import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { ashConfig } from "../config";

export default function CalculationDetailAsh(props: any) {
  return <SimpleEnvironmentCalculationDetail config={ashConfig} {...props} />;
}
