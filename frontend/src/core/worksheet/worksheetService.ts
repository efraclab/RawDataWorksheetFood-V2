import { apiClient } from "../api";

export interface FetchWorksheetRequest {
  employeeId: string;
  role: string;
}

export interface WorksheetSummary {
  id?: number;
  worksheetId?: string;
  registrationNo: string;
  sampleName?: string;
  dateOfReceipt?: string;
  numberOfParameters?: number;
  status?: string;
  createdAt?: string;
  lab?: string;
}

export const worksheetService = {
  async getAll(
    request: FetchWorksheetRequest
  ): Promise<WorksheetSummary[]> {
    try {
      const response = await apiClient.post<WorksheetSummary[]>(
        "/worksheets/get-all",
        request
      );

      return Array.isArray(response.data)
        ? response.data
        : [];
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          `Failed to fetch worksheets: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },

  async delete(
    worksheetId: string
  ): Promise<void> {
    if (!worksheetId) {
      throw new Error(
        "Worksheet ID is required."
      );
    }

    try {
      await apiClient.delete(
        `/worksheets/${worksheetId}`
      );
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          `Failed to delete worksheet: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },
};