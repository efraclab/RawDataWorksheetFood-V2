import apiClient from "../api/apiClient";
import type {
  Worksheet,
  WorksheetQuery,
} from "./worksheetTypes";

const worksheetService = {
  async getWorksheets(
    query?: WorksheetQuery
  ): Promise<Worksheet[]> {
    const response = await apiClient.get<Worksheet[]>(
      "/worksheets",
      {
        params: query,
      }
    );

    return response.data;
  },
};

export default worksheetService;