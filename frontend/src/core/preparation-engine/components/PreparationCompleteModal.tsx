import React from "react";
import { Info, LockKeyhole, ShieldCheck, X } from "lucide-react";

export interface PreparationCompleteModalProps {
    isOpen: boolean;
    preparationName: string;
    parameterName?: string | null;
    parameterCode?: string | null;
    isSubmitting?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const PreparationCompleteModal: React.FC<PreparationCompleteModalProps> = ({
    isOpen,
    parameterName,
    parameterCode,
    isSubmitting = false,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true">
            <div className="w-full max-w-[515px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-800 px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Complete Preparation</h3>
                            <p className="mt-0.5 text-sm text-emerald-100">Lock preparation data and unlock calculations</p>
                        </div>
                    </div>
                    <button type="button" onClick={onCancel} disabled={isSubmitting} aria-label="Close" className="absolute right-5 top-5 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-40">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4">
                        <div className="flex items-center justify-between border-b border-slate-200 py-3 text-sm">
                            <span className="text-slate-500">Parameter</span>
                            <span className="font-semibold text-slate-800">{parameterName || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 text-sm">
                            <span className="text-slate-500">Code</span>
                            <span className="font-semibold text-slate-800">{parameterCode || "—"}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-sm font-semibold text-amber-800">The following will be locked for editing:</p>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
                                    <li>Instruments, Chemicals &amp; Standards</li>
                                    <li>Buffer &amp; Mobile Phase Preparation</li>
                                    <li>Diluent Preparation</li>
                                    <li>Standard &amp; Sample Preparations</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                            <p className="text-sm leading-6 text-blue-700">
                                Completing preparation will unlock the <strong>Calculations</strong> section. You can unlock preparation later if revisions are needed — as long as analysis has not yet been submitted.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={onCancel} disabled={isSubmitting} className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                    <button type="button" onClick={onConfirm} disabled={isSubmitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-700 to-slate-800 px-4 py-3 text-sm font-bold text-white shadow-sm hover:brightness-95 disabled:opacity-50">
                        <ShieldCheck className="h-4 w-4" />
                        {isSubmitting ? "Completing..." : "Complete Preparation"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreparationCompleteModal;
