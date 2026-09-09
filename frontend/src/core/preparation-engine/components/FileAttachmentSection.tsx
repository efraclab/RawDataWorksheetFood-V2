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

    onAttachFiles: (files: File[]) => void;
    onRemoveFile?: (file: PreparationAttachedFile, index: number) => void;
}

const FileAttachmentSection: React.FC<FileAttachmentSectionProps> = ({
    files,
    isLocked = false,
    accept,
    title = "Preparation Files",
    description = "Attach files related to this preparation.",
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

    const formatFileSize = (size?: number) => {
        if (size === undefined || Number.isNaN(size)) {
            return "";
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        if (size < 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(1)} MB`;
        }

        return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    return (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-emerald-900">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                        {description}
                    </p>
                </div>

                <label
                    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 ${
                        isLocked
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }`}
                >
                    <Upload className="h-4 w-4" />

                    Attach Files

                    <input
                        type="file"
                        multiple
                        accept={accept}
                        disabled={isLocked}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="p-5">
                {files.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-6 py-10 text-center">
                        <Paperclip className="mx-auto h-8 w-8 text-emerald-500" />

                        <h4 className="mt-3 text-base font-semibold text-emerald-900">
                            No Files Attached
                        </h4>

                        <p className="mt-1 text-sm text-emerald-700">
                            Attach supporting files for this preparation.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {files.map((file, index) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                    <File className="h-5 w-5 text-emerald-700" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    {file.url ? (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block truncate text-sm font-medium text-emerald-800 hover:underline"
                                        >
                                            {file.name}
                                        </a>
                                    ) : (
                                        <span className="block truncate text-sm font-medium text-emerald-900">
                                            {file.name}
                                        </span>
                                    )}

                                    {file.size !== undefined && (
                                        <span className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </span>
                                    )}
                                </div>

                                {onRemoveFile && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveFile(file, index)
                                        }
                                        disabled={isLocked}
                                        title={
                                            isLocked
                                                ? "Files are locked"
                                                : "Remove file"
                                        }
                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
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