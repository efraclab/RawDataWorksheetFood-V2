export interface FileMetadata {
  id: string;

  fileName: string;

  contentType?: string;

  size?: number;

  uploadedAt?: string;
}

export interface FileUploadResult {
  success: boolean;

  file?: FileMetadata;

  error?: string;
}