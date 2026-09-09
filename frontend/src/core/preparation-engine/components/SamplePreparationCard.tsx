import React from "react";
import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";

export interface SamplePreparationCardProps {
    preparationNumber: number;
    title: string;
    expanded?: boolean;
    isLocked?: boolean;

    onToggle?: () => void;
    onRemove?: () => void;
    onCopy?: () => void;

    children?: React.ReactNode;
}

const SamplePreparationCard: React.FC<SamplePreparationCardProps> = ({
    preparationNumber,
    title,
    expanded = true,
    isLocked = false,
    onToggle,
    onRemove,
    onCopy,
    children,
}) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {preparationNumber}
                </div>

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                    <span className="truncate text-lg font-semibold text-emerald-900">
                        {title}
                    </span>

                    {onToggle &&
                        (expanded ? (
                            <ChevronUp className="h-5 w-5 shrink-0 text-emerald-700" />
                        ) : (
                            <ChevronDown className="h-5 w-5 shrink-0 text-emerald-700" />
                        ))}
                </button>

                <div className="flex items-center gap-1">
                    {onCopy && (
                        <button
                            type="button"
                            onClick={onCopy}
                            disabled={isLocked}
                            title={
                                isLocked
                                    ? "Preparation is locked"
                                    : "Copy preparation"
                            }
                            className="rounded-lg p-2 text-emerald-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    )}

                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            disabled={isLocked}
                            title={
                                isLocked
                                    ? "Preparation is locked"
                                    : "Remove preparation"
                            }
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="p-5">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SamplePreparationCard;