import type { PreparationModuleDefinition } from "../../../core/preparation/ui/PreparationModuleDefinition";

import { foodPreparationRegistry } from "./foodPreparationRegistry";

export const foodPreparationModuleRegistry:
    readonly PreparationModuleDefinition[] =
    foodPreparationRegistry
        .map((handler) => {
            const ui = handler.definition.metadata?.ui as
                | {
                      component?: PreparationModuleDefinition["component"];
                      title?: string;
                      color?: string;
                  }
                | undefined;

            if (!ui?.component) {
                return null;
            }

            return {
                id: handler.definition.id,

                title:
                    ui.title ??
                    handler.definition.name,

                component:
                    ui.component,

                ...(ui.color
                    ? {
                          color: ui.color,
                      }
                    : {}),
            };
        })
        .filter(
            (
                definition
            ): definition is PreparationModuleDefinition =>
                definition !== null
        );