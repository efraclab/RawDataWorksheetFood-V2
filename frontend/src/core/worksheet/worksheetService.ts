import { apiClient } from "../api";

export interface FetchWorksheetRequest {
  employeeId: string;
  role: string;
}

export interface WorksheetDetail {
  sample?: {
    worksheetId?: string;
    registrationNo?: string;
    sampleName?: string;
    sampleCode?: string;
    status?: string;
    lab?: string;
    [key: string]: unknown;
  };

  parameters?: unknown[];

  [key: string]: unknown;
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

    async getById(
    worksheetId: string,
    request: FetchWorksheetRequest
  ): Promise<WorksheetDetail | null> {

    if (!worksheetId) {
      throw new Error(
        "Worksheet ID is required."
      );
    }

    try {

      const response =
        await apiClient.post<WorksheetDetail>(
          `/worksheets/get/${worksheetId}`,
          request
        );

      const data = response.data;

      if (!data) {
        return null;
      }

      if (
        data.sample ||
        data.parameters
      ) {
        return data;
      }

      return null;

    } catch (error: any) {

      if (
        error?.response?.status === 404
      ) {
        return null;
      }

      throw new Error(
        error?.response?.data?.message ||
          `Failed to fetch worksheet: ${
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