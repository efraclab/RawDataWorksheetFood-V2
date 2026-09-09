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

export interface FetchSampleRequest {
  regNo: string;
  lab: string;
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

  /**
   * V1-compatible parameter catalogue.
   *
   * V1 calls POST /sample-details with registration number
   * and laboratory. The response is the list of parameters
   * available for the worksheet.
   */
  async getAvailableParameters(
    request: FetchSampleRequest
  ): Promise<import("../../plugins/food/models/SampleData").SampleData[]> {
    if (!request?.regNo) {
      throw new Error("Registration Number is required.");
    }

    try {
      const response =
        await apiClient.post<
          import("../../plugins/food/models/SampleData").SampleData[]
        >("/sample-details", request);

      return Array.isArray(response.data)
        ? response.data
        : [];
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.error ||
          `Failed to fetch samples for ${request.regNo}: ${
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
      throw new Error("Worksheet ID is required.");
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

      if (data.sample || data.parameters) {
        return data;
      }

      return null;
    } catch (error: any) {
      if (error?.response?.status === 404) {
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
      throw new Error("Worksheet ID is required.");
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
