import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { spmIAQConfig } from "../config";

export default function SpmIAQCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={spmIAQConfig} {...props} />;
}
