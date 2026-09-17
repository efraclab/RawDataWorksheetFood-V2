import React from "react";
import GenericFoodPreparationModule from "../../GenericFoodPreparationModule";
import CalculationDetailAminoAcid from "./CalculationDetailAminoAcid";
import { createCalculationAminoAcid, restoreCalculationAminoAcid, createSamplePreparationAminoAcid } from "../factory";
import SamplePreparationDetailAminoAcid from "./SamplePreparationDetailAminoAcid";

const config = {
  id: "food.amino-acid",
  preparationType: "aminoAcid",
  calculationType: "aminoAcid",
  title: "Amino Acid Analysis",
  shortTitle: "Amino Acid",
  sampleDetail: SamplePreparationDetailAminoAcid,
  calculationDetail: CalculationDetailAminoAcid,
  createSamplePreparation: createSamplePreparationAminoAcid,
  createCalculation: createCalculationAminoAcid,
  restoreCalculation: restoreCalculationAminoAcid,
};

const AminoAcidPreparationModule = React.forwardRef((props: any, ref) => (
  <GenericFoodPreparationModule ref={ref} config={config} {...props} />
));

AminoAcidPreparationModule.displayName = "AminoAcidPreparationModule";

export default AminoAcidPreparationModule;
