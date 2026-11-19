export const createSamplePreparation = (parameterType: string, index: number): any => {
  const common = (steps: any[]) => ({
    id: Date.now() + index,
    label: `Sample Preparation ${index + 1}`,
    steps,
  });

  if (parameterType === "protein") {
    return common([
      { name: "Sample Weight", value1: "", unit1: "g", logBookID: "" },
      { name: "Sample Titre Value", value1: "", unit1: "ml", logBookID: "" },
      { name: "Blank Titre Value", value1: "", unit1: "ml", logBookID: "" },
      { name: "Normality", value1: "", unit1: "ml", logBookID: "" },
      { name: "Protein Factor", value1: "", unit1: "", logBookID: "" },
    ]);
  }

  if (parameterType === "sugar") {
    return common([
      { name: "Sample Weight", value1: "", unit1: "g", logBookID: "" },
      { name: "Volume Make Up 1", value1: "", unit1: "ml", logBookID: "" },
      { name: "Sample Titre Value", value1: "", unit1: "ml", logBookID: "" },
      { name: "Dilution Factor", value1: "", unit1: "", logBookID: "" },
      { name: "Std Dextrose Weight", value1: "", unit1: "g", logBookID: "" },
      { name: "Volume Make Up 2", value1: "", unit1: "ml", logBookID: "" },
      { name: "Standard Titre", value1: "", unit1: "ml", logBookID: "" },
      { name: "Aliquot", value1: "", unit1: "ml", logBookID: "" },
      { name: "Fehling Factor", value1: "", unit1: "", logBookID: "" },
    ]);
  }

  return common([]);
};
