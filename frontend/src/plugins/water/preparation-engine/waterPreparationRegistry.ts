import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";
import { fluoridePreparationHandler } from "../preparations/fluoride/handler";
import { cyanidePreparationHandler } from "../preparations/cyanide/handler";
import { nitratePreparationHandler } from "../preparations/nitrate/handler";
import { tdsPreparationHandler } from "../preparations/tds/handler";
import { magnesiumPreparationHandler } from "../preparations/magnesium/handler";
import { calciumPreparationHandler } from "../preparations/calcium/handler";
import { alkalinityPreparationHandler } from "../preparations/alkalinity/handler";
import { chloridePreparationHandler } from "../preparations/chloride/handler";
import { sulphatePreparationHandler } from "../preparations/sulphate/handler";
import { nitritePreparationHandler } from "../preparations/nitrite/handler";

export const waterPreparationRegistry: readonly PreparationHandler[] = [
  fluoridePreparationHandler,
  cyanidePreparationHandler,
  nitratePreparationHandler,
  tdsPreparationHandler,
  magnesiumPreparationHandler,
  calciumPreparationHandler,
  alkalinityPreparationHandler,
  chloridePreparationHandler,
  sulphatePreparationHandler,
  nitritePreparationHandler,
];
