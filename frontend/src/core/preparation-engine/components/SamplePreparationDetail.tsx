import React, { useState } from "react";

import SamplePreparationCard from "./SamplePreparationCard";
import SamplePreparationSteps from "./SamplePreparationSteps";
import type { PreparationStep } from "./SamplePreparationSteps";

export interface SamplePreparationDetailProps<
    TPreparation extends {
        id: number | string;
        label?: string;
        steps: readonly TStep[];
    },
    TStep extends PreparationStep
> {
    preparation: TPreparation;
    preparationIndex: number;

    isLocked?: boolean;

    onToggle?: () => void;
    onRemove?: () => void;
    onCopy?: () => void;

    onAddStep?: () => void;
    onRemoveStep?: (
        step: TStep,
        index: number
    ) => void;

    renderStep: (
        step: TStep,
        index: number,
        isLocked: boolean
    ) => React.ReactNode;
}

const SamplePreparationDetail = <
    TPreparation extends {
        id: number | string;
        label?: string;
        steps: readonly TStep[];
    },
    TStep extends PreparationStep
>({
    preparation,
    preparationIndex,
    isLocked = false,
    onToggle,
    onRemove,
    onCopy,
    onAddStep,
    onRemoveStep,
    renderStep,
}: SamplePreparationDetailProps<
    TPreparation,
    TStep
>) => {
    const [expanded, setExpanded] =
        useState(true);

    const title =
        preparation.label?.trim() ||
        `Sample Preparation ${
            preparationIndex + 1
        }`;

    const handleToggle = () => {
        setExpanded((current) => !current);
        onToggle?.();
    };

    return (
        <SamplePreparationCard
            preparationNumber={preparationIndex + 1}
            title={title}
            expanded={expanded}
            isLocked={isLocked}
            onToggle={handleToggle}
            onRemove={onRemove}
            onCopy={onCopy}
        >
            <SamplePreparationSteps<
                TStep
            >
                steps={preparation.steps}
                isLocked={isLocked}
                onAddStep={onAddStep}
                onRemoveStep={onRemoveStep}
                renderStep={renderStep}
            />
        </SamplePreparationCard>
    );
};

export default SamplePreparationDetail;