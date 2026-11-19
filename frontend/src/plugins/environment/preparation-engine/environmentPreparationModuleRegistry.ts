import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";
import { environmentPreparationRegistry } from "./environmentPreparationRegistry";

type PersistenceMetadata = { preparationType?: string; calculationType?: string };
type UiMetadata = { component?: PreparationModuleDefinition["component"]; title?: string; color?: string };

export const environmentPreparationModuleRegistry: readonly PreparationModuleDefinition[] =
  environmentPreparationRegistry
    .map((handler) => {
      const ui = handler.definition.metadata?.ui as UiMetadata | undefined;
      const persistence = handler.definition.metadata?.persistence as PersistenceMetadata | undefined;
      if (!ui?.component) return null;
      return {
        id: handler.definition.id,
        title: ui.title ?? handler.definition.name,
        ...(ui.color ? { color: ui.color } : {}),
        ...(persistence?.preparationType ? { preparationType: persistence.preparationType } : {}),
        ...(persistence?.calculationType ? { calculationType: persistence.calculationType } : {}),
        component: ui.component,
      };
    })
    .filter((item): item is PreparationModuleDefinition => item !== null);
