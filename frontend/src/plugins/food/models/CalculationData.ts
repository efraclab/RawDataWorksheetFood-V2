export interface CalculationData {
  label: string;
  calculationType:
    | "acidity"
    | "acidValue"
    | "aminoAcid"
    | "artificialColour"
    | "artificialSweetner"
    | "carbohydrate"
    | "cholesterol"
    | "crudeFiber"
    | "dietaryFiber"
    | "energy"
    | "fat"
    | "fattyAcidProfile"
    | "freeFattyAcid"
    | "fsv"
    | "lod"
    | "moisture"
    | "nots"
    | "peroxideValue"
    | "preservative"
    | "protein"
    | "saponificationValue"
    | "sugar"
    | "sugarSaponinCatechinProfile"
    | "sulphurDioxide"
    | "unsapMatter"
    | "uricAcid"
    | "wsv";
  data: any;
}
