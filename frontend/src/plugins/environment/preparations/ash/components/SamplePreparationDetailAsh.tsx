import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { ashConfig } from "../config";

export default function SamplePreparationDetailAsh(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={ashConfig} {...props} />;
}
