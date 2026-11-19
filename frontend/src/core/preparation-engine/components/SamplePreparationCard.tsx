import React from "react";
import { ChevronDown, ChevronUp, Droplets, Trash2 } from "lucide-react";

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
    // preparationNumber,
    title,
    expanded = true,
    isLocked = false,
    onToggle,
    onRemove,
    onCopy: _onCopy,
    children,
}) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white shadow-inner">
                    <Droplets className="h-5 w-5" />
                </div>

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex min-w-0 flex-1 items-center text-left"
                >
                    <div className="min-w-0">
                        <div className="truncate text-base font-bold text-white">
                            {title}
                        </div>
                        <div className="truncate text-xs font-medium text-emerald-100">
                            Sample Preparation for LOD Details
                        </div>
                    </div>
                </button>

                <div className="flex items-center gap-2">
                    {onToggle && (
                        <button
                            type="button"
                            onClick={onToggle}
                            title={expanded ? "Collapse preparation" : "Expand preparation"}
                            className="rounded-lg p-2 text-white transition hover:bg-white/10"
                        >
                            {expanded ? (
                                <ChevronUp className="h-5 w-5" />
                            ) : (
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </button>
                    )}

                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            disabled={isLocked}
                            title={isLocked ? "Preparation is locked" : "Remove preparation"}
                            className="rounded-lg border border-white/40 bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {expanded && <div className="bg-slate-50/40 p-4">{children}</div>}
        </div>
    );
};

export default SamplePreparationCard;
