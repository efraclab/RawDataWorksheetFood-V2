import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";
import { microPreparationRegistry } from "./microPreparationRegistry";

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
 * Micro UI registry is derived from Micro's handler registry, exactly like Metal.
 */
export const microPreparationModuleRegistry: readonly PreparationModuleDefinition[] =
  microPreparationRegistry
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