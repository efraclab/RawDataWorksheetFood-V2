import React from "react";
import { File, Paperclip, Trash2, Upload } from "lucide-react";

export interface PreparationAttachedFile {
    readonly id: string | number;
    readonly name: string;
    readonly size?: number;
    readonly type?: string;
    readonly url?: string;
}

export interface FileAttachmentSectionProps {
    files: readonly PreparationAttachedFile[];

    isLocked?: boolean;

    accept?: string;
    title?: string;
    description?: string;
    maxFiles?: number;

    onAttachFiles: (files: File[]) => void;
    onRemoveFile?: (file: PreparationAttachedFile, index: number) => void;
}

const FileAttachmentSection: React.FC<FileAttachmentSectionProps> = ({
    files,
    isLocked = false,
    accept,
    title = "Preparation Files",
    // description = "Attach files related to this preparation.",
    maxFiles = 10,
    onAttachFiles,
    onRemoveFile,
}) => {
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(event.target.files ?? []);

        if (selectedFiles.length > 0) {
            onAttachFiles(selectedFiles);
        }

        event.target.value = "";
    };

    // const formatFileSize = (size?: number) => {
    //     if (size === undefined || Number.isNaN(size)) {
    //         return "";
    //     }

    //     if (size < 1024) {
    //         return `${size} B`;
    //     }

    //     if (size < 1024 * 1024) {
    //         return `${(size / 1024).toFixed(1)} KB`;
    //     }

    //     if (size < 1024 * 1024 * 1024) {
    //         return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    //     }

    //     return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    // };

    // const displayTitle = title.replace(/\(\d+\/10\)/, `(${files.length}/10)`);
    // const isWeightPrintSheets = title.includes("Weight Print Sheets");

    return (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-emerald-800">
                    <File className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="truncate">{title}</span>
                    <span className="shrink-0">({files.length}/{maxFiles})</span>
                </div>

                <label
                    className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 ${
                        isLocked || files.length >= maxFiles
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }`}
                >
                    <Upload className="h-4 w-4" />
                    Attach PDF
                    <input
                        type="file"
                        multiple
                        accept={accept || "application/pdf,.pdf"}
                        disabled={isLocked || files.length >= maxFiles}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="mt-3 rounded-xl border-2 border-dashed border-emerald-200 bg-white/20 px-5 py-5 text-center">
                {files.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
                        <Paperclip className="h-4 w-4" />
                        <span>No PDFs attached yet — click Attach PDF</span>
                    </div>
                ) : (
                    <div className="space-y-2 text-left">
                        {files.map((file, index) => (
                            <div key={file.id} className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-white px-3 py-2">
                                <File className="h-4 w-4 shrink-0 text-emerald-600" />
                                {file.url ? (
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-emerald-800 hover:underline">{file.name}</a>
                                ) : (
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-emerald-800">{file.name}</span>
                                )}
                                {onRemoveFile && (
                                    <button type="button" onClick={() => onRemoveFile(file, index)} disabled={isLocked} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FileAttachmentSection;