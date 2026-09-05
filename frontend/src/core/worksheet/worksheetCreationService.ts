import { apiClient } from "../api";

export interface SampleData {
  registrationNo: string;
  sampleName: string;
  sampleCode: string;
  lab: string;
  parameter: string;
  paraCode: string;
  methodName: string;
  methodCode: string;
  registrationDate: string;
  recieptDate: string;
  analysisStartDate: string;
  analysisCompletionDate: string;
  tatDate: string;
}

export interface SmapleDetailsRequest {
  regNo: string;
  lab: string;
}

export interface WorksheetRequest {
  role: string;
  worksheetId?: string;

  registrationInfo?: {
    registrationNo: string;
    sampleName?: string;
    sampleCode?: string;
    sampleQuantity?: number;
    natureOfSample?: string;
    numberOfParameters: number;
    dueDate?: string;
    lab: string;
  };

  documentInfo?: {
    preparedBy?: string;
    revisionDate?: string;
    status?: string;
    approvedAt?: string | null;
  };

  parameters?: unknown[];
}

export interface WorksheetLogRequest {
  worksheetId?: string | null;
  parameterId?: number | null;
  remarks?: string | null;
  action: string;
  employeeId: string;
  role: string;
  referenceType?: string | null;
  referenceId?: string | null;
}

export const worksheetCreationService = {
  async fetchSample(
    request: SmapleDetailsRequest
  ): Promise<SampleData[]> {
    if (!request?.regNo?.trim()) {
      throw new Error(
        "Registration Number is required."
      );
    }

    try {
      const response =
        await apiClient.post<SampleData[]>(
          "/sample-details",
          request
        );

      return Array.isArray(response.data)
        ? response.data
        : [];
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          `Failed to fetch samples for ${request.regNo}: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },

  async createWorksheet(
    worksheetData: WorksheetRequest
  ): Promise<{ worksheetId: string }> {
    try {
      const response =
        await apiClient.post<{
          worksheetId: string;
        }>(
          "/worksheets",
          worksheetData
        );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          `Failed to create worksheet: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },

  async insertWorksheetLog(
    payload: WorksheetLogRequest
  ): Promise<{ message: string }> {
    try {
      const response =
        await apiClient.post<{
          message: string;
        }>(
          "/logs",
          payload
        );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          `Failed to insert log: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },
};