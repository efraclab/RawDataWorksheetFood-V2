import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";
import { metalPreparationRegistry } from "./metalPreparationRegistry";

type PersistenceMetadata = {
  preparationType?: string;
  calculationType?: string;
};

type UiMetadata = {
  component?: PreparationModuleDefinition["component"];
  title?: string;
  color?: string;
};

/**
 * Metal UI registry is derived from Metal's handler registry, exactly like
 * Food LOD. Core receives only the generic module definitions.
 */
export const metalPreparationModuleRegistry: readonly PreparationModuleDefinition[] =
  metalPreparationRegistry
    .map((handler) => {
      const ui = handler.definition.metadata?.ui as UiMetadata | undefined;
      const persistence = handler.definition.metadata?.persistence as
        | PersistenceMetadata
        | undefined;

      if (!ui?.component) return null;

      return {
        id: handler.definition.id,
        title: ui.title ?? handler.definition.name,
        component: ui.component,
        ...(ui.color ? { color: ui.color } : {}),
        ...(persistence?.preparationType
          ? { preparationType: persistence.preparationType }
          : {}),
        ...(persistence?.calculationType
          ? { calculationType: persistence.calculationType }
          : {}),
      };
    })
    .filter(
      (definition): definition is PreparationModuleDefinition =>
        definition !== null,
    );
