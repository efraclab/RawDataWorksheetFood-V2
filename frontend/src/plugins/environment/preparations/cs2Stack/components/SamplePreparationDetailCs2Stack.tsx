import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { cs2StackConfig } from "../config";

export default function SamplePreparationDetailCs2Stack(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={cs2StackConfig} {...props} />;
}
