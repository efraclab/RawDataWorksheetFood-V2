import SimpleEnvironmentSamplePreparationDetail from "../../_shared/SimpleEnvironmentSamplePreparationDetail";
import { soilCa2PlusConfig } from "../config";

export default function SamplePreparationDetailSoilCa2Plus(props: any) {
  return (
    <SimpleEnvironmentSamplePreparationDetail
      config={soilCa2PlusConfig}
      {...props}
    />
  );
}
