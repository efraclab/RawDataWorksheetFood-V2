import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { spmIAQConfig } from "../config";

export default function SamplePreparationDetailSpmIAQ(props: any) {
  return <SimpleEnvironmentSamplePreparationDetail config={spmIAQConfig} {...props} />;
}
