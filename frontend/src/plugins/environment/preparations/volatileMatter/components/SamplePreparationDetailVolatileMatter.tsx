import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { volatileMatterConfig } from "../config";

export default function SamplePreparationDetailVolatileMatter(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={volatileMatterConfig} {...props} />;
}
