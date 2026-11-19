import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { volatileMatterConfig } from "../config";

export default function VolatileMatterCalculationSection(props: any) {
  return <SimpleEnvironmentCalculationSection config={volatileMatterConfig} {...props} />;
}
