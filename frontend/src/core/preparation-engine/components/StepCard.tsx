import React from "react";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

export interface StepCardProps {
    stepNumber: number;
    title: string;
    expanded?: boolean;
    isLocked?: boolean;
    onToggle?: () => void;
    onRemove?: () => void;
    children?: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
    stepNumber,
    title,
    expanded = true,
    isLocked = false,
    onToggle,
    onRemove,
    children,
}) => {
    return (
        <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-4 py-3">
                <GripVertical className="h-5 w-5 shrink-0 text-emerald-400" />

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {stepNumber}
                </div>

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                >
                    <span className="truncate font-semibold text-emerald-900">
                        {title}
                    </span>

                    {onToggle &&
                        (expanded ? (
                            <ChevronUp className="h-5 w-5 shrink-0 text-emerald-700" />
                        ) : (
                            <ChevronDown className="h-5 w-5 shrink-0 text-emerald-700" />
                        ))}
                </button>

                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={isLocked}
                        title={
                            isLocked
                                ? "Step is locked"
                                : "Remove preparation step"
                        }
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {expanded && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default StepCard;