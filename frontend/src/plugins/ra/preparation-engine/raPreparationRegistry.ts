import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";

// All RA tests share one engine: preparations/residue
import { lcPesticidesPreparationHandler } from "../preparations/lcPesticides/handler";
import { gcPesticidesPreparationHandler } from "../preparations/gcPesticides/handler";
import { antibioticsPreparationHandler } from "../preparations/antibiotics/handler";
import { aflatoxinsPreparationHandler } from "../preparations/aflatoxins/handler";
import { melaminePreparationHandler } from "../preparations/melamine/handler";
import { dithiocarbamatesPreparationHandler } from "../preparations/dithiocarbamates/handler";
import { dioxinFuranPreparationHandler } from "../preparations/dioxinFuran/handler";
import { residualSolventsPreparationHandler } from "../preparations/residualSolvents/handler";
import { vocThmPreparationHandler } from "../preparations/vocThm/handler";
import { pahPcbPreparationHandler } from "../preparations/pahPcb/handler";
import { aflatoxinM1PreparationHandler } from "../preparations/aflatoxinM1/handler";
import { ochratoxinPreparationHandler } from "../preparations/ochratoxin/handler";
import { vitaminBPreparationHandler } from "../preparations/vitaminB/handler";

/**
 * All RA laboratory preparation handlers.
 * Add each new test here. The RA UI registry derives its dropdown entries from this list.
 */
export const raPreparationRegistry: readonly PreparationHandler[] = [
  lcPesticidesPreparationHandler,
  gcPesticidesPreparationHandler,
  antibioticsPreparationHandler,
  aflatoxinsPreparationHandler,
  melaminePreparationHandler,
  dithiocarbamatesPreparationHandler,
  dioxinFuranPreparationHandler,
  residualSolventsPreparationHandler,
  vocThmPreparationHandler,
  pahPcbPreparationHandler,
  aflatoxinM1PreparationHandler,
  ochratoxinPreparationHandler,
  vitaminBPreparationHandler,
];