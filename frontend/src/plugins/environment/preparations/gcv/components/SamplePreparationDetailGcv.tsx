import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { gcvConfig } from "../config";

export default function SamplePreparationDetailGcv(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={gcvConfig} {...props} />;
}
