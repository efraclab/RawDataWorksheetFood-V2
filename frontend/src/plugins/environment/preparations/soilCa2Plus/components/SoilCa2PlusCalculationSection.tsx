import SimpleEnvironmentCalculationSection from "../../_shared/SimpleEnvironmentCalculationSection";
import { soilCa2PlusConfig } from "../config";

export default function SoilCa2PlusCalculationSection(props: any) {
  return (
    <SimpleEnvironmentCalculationSection
      config={soilCa2PlusConfig}
      {...props}
    />
  );
}
