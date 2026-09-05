export interface ReportRequest {
  worksheetId: string;

  preparationId?: string;

  format?: "pdf" | "print";
}

export interface ReportResult {
  success: boolean;

  fileUrl?: string;

  error?: string;
}