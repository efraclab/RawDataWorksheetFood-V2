import { apiClient } from "../api";
import type { Analyst } from "../../plugins/food/models/Analyst";
import type { Instrument } from "../../plugins/food/models/Instrument";
import type { Chemical } from "../../plugins/food/models/Chemical";
import type { Standard } from "../../plugins/food/models/Standard";

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

export interface RelatedWorksheetSuggestion {
  worksheetId: string;
  sampleName?: string;
  parameterName?: string;
  createdAt?: string;
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
  /**
   * V1-compatible analyst catalogue.
   * V1 calls GET /worksheets/analysts.
   */
  async getAnalysts(): Promise<Analyst[]> {
    try {
      const response = await apiClient.get<
        Analyst[] | { data?: Analyst[] }
      >("/worksheets/analysts");

      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (data && Array.isArray(data.data)) {
        return data.data;
      }

      return [];
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          `Failed to fetch analysts: ${
            error?.message ?? "Unknown error"
          }`
      );
    }
  },

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

  async getRelatedWorksheetsBySample(
    sampleName: string,
    excludeWorksheetId: string,
    request: FetchWorksheetRequest
  ): Promise<RelatedWorksheetSuggestion[]> {
    if (!sampleName) return [];

    try {
      const all = await this.getAll(request);
      const normalizedTarget = sampleName.trim().toLowerCase();

      return (all || [])
        .filter((worksheet: any) => {
          const id = worksheet.worksheetId ?? worksheet.id;
          const name =
            worksheet.sampleName ??
            worksheet.sample?.sampleName ??
            "";

          return (
            id &&
            id !== excludeWorksheetId &&
            String(name).trim().toLowerCase() === normalizedTarget
          );
        })
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt ?? 0).getTime();
          const dateB = new Date(b.createdAt ?? 0).getTime();
          return dateB - dateA;
        })
        .map((worksheet: any) => ({
          worksheetId: worksheet.worksheetId ?? worksheet.id,
          sampleName:
            worksheet.sampleName ?? worksheet.sample?.sampleName,
          parameterName:
            worksheet.parameterName ??
            worksheet.testName ??
            worksheet.testCode,
          createdAt: worksheet.createdAt,
        }));
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
          `Failed to fetch related worksheets: ${
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

  /** V1-compatible worksheet update used by Save Draft. */
  async update(
    worksheetId: string,
    data: unknown
  ): Promise<any> {
    if (!worksheetId) throw new Error("Worksheet ID is required.");
    try {
      const response = await apiClient.post(
        `/worksheets/update/${worksheetId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        `Failed to save worksheet: ${error?.message ?? "Unknown error"}`
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
  async getInstruments(): Promise<Instrument[]> {
  const response = await apiClient.get<Instrument[]>("/instruments");
  return Array.isArray(response.data) ? response.data : [];
},

async getChemicals(): Promise<Chemical[]> {
  const response = await apiClient.get<Chemical[]>("/chemicals");
  return Array.isArray(response.data) ? response.data : [];
},

async getStandards(): Promise<Standard[]> {
  const response = await apiClient.get<Standard[]>("/standards");
  return Array.isArray(response.data) ? response.data : [];
},
};
