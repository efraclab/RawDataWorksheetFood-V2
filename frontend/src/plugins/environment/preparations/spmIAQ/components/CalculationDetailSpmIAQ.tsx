import SimpleEnvironmentCalculationDetail from "../../_shared/SimpleEnvironmentCalculationDetail";
import { spmIAQConfig } from "../config";

export default function CalculationDetailSpmIAQ(props: any) {
  return <SimpleEnvironmentCalculationDetail config={spmIAQConfig} {...props} />;
}
