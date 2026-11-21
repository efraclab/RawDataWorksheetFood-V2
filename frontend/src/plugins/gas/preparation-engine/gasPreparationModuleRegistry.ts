import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";
import { gasPreparationRegistry } from "./gasPreparationRegistry";

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
 * Gas UI registry is derived from Gas's handler registry, exactly like Metal.
 */
export const gasPreparationModuleRegistry: readonly PreparationModuleDefinition[] =
  gasPreparationRegistry
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