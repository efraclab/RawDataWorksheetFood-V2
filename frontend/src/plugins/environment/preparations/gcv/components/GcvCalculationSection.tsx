import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { gcvConfig } from "../config";

export default function GcvCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={gcvConfig} {...props} />;
}
