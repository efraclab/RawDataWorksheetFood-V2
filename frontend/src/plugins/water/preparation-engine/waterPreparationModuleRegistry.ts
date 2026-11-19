import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";
import { waterPreparationRegistry } from "./waterPreparationRegistry";

type PersistenceMetadata = { preparationType?: string; calculationType?: string };
type UiMetadata = { component?: PreparationModuleDefinition["component"]; title?: string; color?: string };

export const waterPreparationModuleRegistry: readonly PreparationModuleDefinition[] =
  waterPreparationRegistry
    .map((handler) => {
      const ui = handler.definition.metadata?.ui as UiMetadata | undefined;
      const persistence = handler.definition.metadata?.persistence as PersistenceMetadata | undefined;
      if (!ui?.component) return null;
      return {
        id: handler.definition.id,
        title: ui.title ?? handler.definition.name,
        component: ui.component,
        ...(ui.color ? { color: ui.color } : {}),
        ...(persistence?.preparationType ? { preparationType: persistence.preparationType } : {}),
        ...(persistence?.calculationType ? { calculationType: persistence.calculationType } : {}),
      };
    })
    .filter((item): item is PreparationModuleDefinition => item !== null);
