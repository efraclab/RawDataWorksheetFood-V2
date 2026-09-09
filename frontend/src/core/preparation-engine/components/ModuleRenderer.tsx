import React from "react";

import type { PreparationModuleDefinition } from "../../preparation/ui/PreparationModuleDefinition";
import type { PreparationModuleHandle } from "../../preparation/ui/PreparationModuleHandle";

export interface ModuleRendererProps {
    registry: readonly PreparationModuleDefinition[];

    activeGroups: string[];

    parameterId: number;

    parameterName?: string | null;

    parameterCode?: string | null;

    role: string;

    isLocked: boolean;

    onLockPreparation: (parameterId: number) => void;

    onUnlockPreparation: (parameterId: number) => void;

    moduleRefs: React.MutableRefObject<
        Record<string, PreparationModuleHandle | null>
    >;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({
    registry,
    activeGroups,
    parameterId,
    parameterName,
    parameterCode,
    role,
    isLocked,
    onLockPreparation,
    onUnlockPreparation,
    moduleRefs,
}) => {
    return (
        <div className="space-y-4">
            {activeGroups.map((groupId) => {
                const definition = registry.find(
                    (module) => module.id === groupId
                );

                if (!definition) {
                    return null;
                }

                const ModuleComponent =
                    definition.component;

                return (
                    <ModuleComponent
                        key={groupId}
                        ref={(instance: PreparationModuleHandle | null) => {
                            moduleRefs.current[groupId] =
                                instance;
                        }}
                        preparationId={groupId}
                        parameterId={parameterId}
                        parameterName={parameterName}
                        parameterCode={parameterCode}
                        role={role}
                        isLocked={isLocked}
                        onLockPreparation={
                            onLockPreparation
                        }
                        onUnlockPreparation={
                            onUnlockPreparation
                        }
                    />
                );
            })}
        </div>
    );
};

export default ModuleRenderer;