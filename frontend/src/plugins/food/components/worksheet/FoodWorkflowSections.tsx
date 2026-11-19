import React from "react";
import { motion } from "framer-motion";
import { BsPlayFill } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import type { ParameterDetail } from "../../models/ParameterDetail";

interface FoodAnalystAnalysisSectionProps {
    parameter: ParameterDetail;
    status: string;
    onStart: (parameter: ParameterDetail) => void;
    onComplete: (parameter: ParameterDetail) => void;
    compact?: boolean;
}

const FoodAnalystAnalysisSection: React.FC<FoodAnalystAnalysisSectionProps> = ({
    parameter,
    status,
    onStart,
    onComplete,
    compact = false,
}) => {
    const normalizedStatus = (status || parameter.status || "created")
        .trim()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/-/g, " ");

    const isPending = normalizedStatus === "analysis pending";
    const isStarted = normalizedStatus === "analysis started";
    const isCompleted = normalizedStatus === "analysis completed";

    if (compact) {
        if (!isPending && !isStarted && !isCompleted) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-white"
            >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-emerald-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d={isCompleted
                                            ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            : isStarted
                                                ? "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                : "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"}
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">
                                    {isCompleted
                                        ? "Analysis Completed"
                                        : isStarted
                                            ? "Analysis In Progress"
                                            : "Analysis Pending - Ready to Start"}
                                </h4>
                                <p className="text-xs text-slate-600">
                                    {isCompleted
                                        ? "Your work has been submitted and is under review"
                                        : isStarted
                                            ? "Complete your analysis and click on Complete button"
                                            : "Click \"Start Analysis\" to begin working on this parameter"}
                                </p>
                            </div>
                        </div>

                        {isPending && (
                            <motion.button
                                type="button"
                                onClick={() => onStart(parameter)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <BsPlayFill className="w-5 h-5" />
                                Start Analysis
                            </motion.button>
                        )}

                        {isStarted && (
                            <motion.button
                                type="button"
                                onClick={() => onComplete(parameter)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Complete Analysis
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!isPending && !isStarted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white"
        >
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d={isStarted
                                        ? "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        : "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"}
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                {isStarted ? "Analysis In Progress" : "Analysis Pending - Ready to Start"}
                            </h3>
                            <p className="text-sm text-slate-600 mt-0.5">
                                {isStarted
                                    ? "Work on your analysis and click complete when done"
                                    : "Click \"Start Analysis\" to begin working on this parameter"}
                            </p>
                        </div>
                    </div>

                    {isPending && (
                        <motion.button
                            type="button"
                            onClick={() => onStart(parameter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <BsPlayFill className="w-5 h-5" />
                            Start Analysis
                        </motion.button>
                    )}

                    {isStarted && (
                        <motion.button
                            type="button"
                            onClick={() => onComplete(parameter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white/80 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Complete Analysis
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="p-6 bg-emerald-50">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                    {isStarted ? "Active Editing Mode" : "What happens when you start?"}
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    {isStarted ? (
                                        <>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>You have full editing access to all preparations and calculations</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>Scroll down to work on parameter details, preparations, and calculations</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>Click \"Save Draft\" frequently to save your progress</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>When all work is complete, click \"Complete Analysis\" above</span></li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>You'll gain full access to edit all preparations and calculations</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>The parameter status will change to \"Analysis Started\"</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>You must complete the entire analysis - no pausing</span></li>
                                            <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span><span>Click \"Complete Analysis\" when you're done with all work</span></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-sm text-emerald-800">
                                {isStarted ? (
                                    <><strong>Before Completing:</strong> Verify all preparations, calculations, and data are accurate. This will submit your work to Reviewer for approval.</>
                                ) : (
                                    <><strong>Important:</strong> Once started, you cannot pause or go back. Make sure you have all required materials and time to complete.</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


interface FoodReviewerAnalysisSectionProps {
    parameter: ParameterDetail;
    status: string;
    onApprove: (parameter: ParameterDetail) => void;
    onRequestRevision: (parameter: ParameterDetail) => void;
    compact?: boolean;
}

/**
 * Reviewer-only analysis action panel.
 *
 * The DrugWorksheet already exposes Approve / Request Revision at this stage.
 * FoodWorksheet uses the same workflow and keeps every other worksheet control
 * read-only while these two actions remain available.
 */
const FoodReviewerAnalysisSection: React.FC<FoodReviewerAnalysisSectionProps> = ({
    parameter,
    status,
    onApprove,
    onRequestRevision,
    compact = false,
}) => {
    const normalizedStatus = (status || parameter.status || "")
        .trim()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/-/g, " ");

    if (normalizedStatus !== "analysis completed") return null;

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-30 mt-8 rounded-xl overflow-hidden border border-emerald-200 shadow-lg bg-white"
            >
                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 0l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Analysis Completed</h4>
                                <p className="text-xs text-slate-600">Review the analysis and approve or request revisions</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onApprove(parameter)}
                                className="px-4 py-2 bg-white border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <MdDone className="w-4 h-4" />
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => onRequestRevision(parameter)}
                                className="px-4 py-2 bg-white border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Request Revision
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-30 mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white"
        >
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 0l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Analysis Completed</h3>
                            <p className="text-sm text-slate-600 mt-0.5">Review the analysis and approve or request revisions</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <motion.button
                            type="button"
                            onClick={() => onApprove(parameter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <MdDone className="w-4 h-4" />
                            Approve
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => onRequestRevision(parameter)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg hover:bg-white hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Request Revision
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-emerald-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">Review Actions Available</h4>
                                <p className="text-sm text-slate-600">
                                    <strong>Approve:</strong> If all data is accurate and complete, approve to finalize the parameter.
                                    <br /><br />
                                    <strong>Request Revision:</strong> If changes are needed, send it back to the analyst with feedback.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-2">Review Guidelines</h4>
                                <p className="text-sm text-slate-600">
                                    Carefully review all preparations, calculations, and data. Scroll through the parameter details below to verify accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="text-sm text-emerald-800">
                            <strong>Reminder:</strong> Your decision will be final. Approved parameters cannot be edited. Parameters sent for revision will return to the analyst.
                        </p>
                    </div>
                </div>

                {parameter.remarksByAnalyst && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-semibold text-gray-700 mb-1">Analyst Comment</h4>
                                <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                                    &ldquo;{parameter.remarksByAnalyst}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};


export { FoodAnalystAnalysisSection, FoodReviewerAnalysisSection };
