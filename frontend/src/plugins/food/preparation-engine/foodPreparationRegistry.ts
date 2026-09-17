import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";

import { acidvaluePreparationHandler } from "../preparations/acid-value/handler";
import { acidityPreparationHandler } from "../preparations/acidity/handler";
import { aminoacidPreparationHandler } from "../preparations/amino-acid/handler";
import { artificialcolourPreparationHandler } from "../preparations/artificial-colour/handler";
import { artificialsweetnerPreparationHandler } from "../preparations/artificial-sweetner/handler";
import { carbohydratePreparationHandler } from "../preparations/carbohydrate/handler";
import { cholesterolPreparationHandler } from "../preparations/cholesterol/handler";
import { crudefiberPreparationHandler } from "../preparations/crude-fiber/handler";
import { dietaryfiberPreparationHandler } from "../preparations/dietary-fiber/handler";
import { energyPreparationHandler } from "../preparations/energy/handler";
import { fatPreparationHandler } from "../preparations/fat/handler";
import { fattyacidprofilePreparationHandler } from "../preparations/fatty-acid-profile/handler";
import { freefattyacidPreparationHandler } from "../preparations/free-fatty-acid/handler";
import { fsvPreparationHandler } from "../preparations/fsv/handler";
import { lodPreparationHandler } from "../preparations/lod/handler";
import { moisturePreparationHandler } from "../preparations/moisture/handler";
import { notsPreparationHandler } from "../preparations/nots/handler";
import { peroxidevaluePreparationHandler } from "../preparations/peroxide-value/handler";
import { preservativePreparationHandler } from "../preparations/preservative/handler";
import { proteinPreparationHandler } from "../preparations/protein/handler";
import { saponificationvaluePreparationHandler } from "../preparations/saponification-value/handler";
import { sugarPreparationHandler } from "../preparations/sugar/handler";
import { sugarsaponincatechinprofilePreparationHandler } from "../preparations/sugar-saponin-catechin-profile/handler";
import { sulphurdioxidePreparationHandler } from "../preparations/sulphur-dioxide/handler";
import { unsapmatterPreparationHandler } from "../preparations/unsap-matter/handler";
import { uricacidPreparationHandler } from "../preparations/uric-acid/handler";
import { wsvPreparationHandler } from "../preparations/wsv/handler";

/** All Food laboratory preparation handlers. Food owns this registry; Core remains laboratory-neutral. */
export const foodPreparationRegistry: readonly PreparationHandler[] = [
  acidvaluePreparationHandler,
  acidityPreparationHandler,
  aminoacidPreparationHandler,
  artificialcolourPreparationHandler,
  artificialsweetnerPreparationHandler,
  carbohydratePreparationHandler,
  cholesterolPreparationHandler,
  crudefiberPreparationHandler,
  dietaryfiberPreparationHandler,
  energyPreparationHandler,
  fatPreparationHandler,
  fattyacidprofilePreparationHandler,
  freefattyacidPreparationHandler,
  fsvPreparationHandler,
  lodPreparationHandler,
  moisturePreparationHandler,
  notsPreparationHandler,
  peroxidevaluePreparationHandler,
  preservativePreparationHandler,
  proteinPreparationHandler,
  saponificationvaluePreparationHandler,
  sugarPreparationHandler,
  sugarsaponincatechinprofilePreparationHandler,
  sulphurdioxidePreparationHandler,
  unsapmatterPreparationHandler,
  uricacidPreparationHandler,
  wsvPreparationHandler,
];
