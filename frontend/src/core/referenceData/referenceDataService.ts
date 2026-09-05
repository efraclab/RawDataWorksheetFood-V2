import { apiClient } from "../api";

import type {
  Chemical,
  Instrument,
  Standard,
  Media,
  WorksheetLogRequest,
} from "./referenceDataTypes";

/**
 * Reference Data Service
 *
 * IMPORTANT:
 * These API paths intentionally match the existing V1 backend contract.
 *
 * GET
 *   /chemicals
 *   /instruments
 *   /standards
 *   /media
 *
 * POST
 *   /chemicals
 *   /instruments
 *   /standards
 *   /media
 *   /logs
 *
 * PUT
 *   /chemicals
 *   /instruments
 *   /standards
 *   /media
 *
 * DELETE
 *   /chemicals/{slNo}
 *   /instruments/{id}
 *   /standards/{serialNo}
 *   /media/{id}
 */

function getErrorMessage(
  error: any,
  fallback: string
): string {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

/* =========================================================
   CHEMICALS
   ========================================================= */

async function getChemicals(): Promise<Chemical[]> {
  try {
    const response = await apiClient.get<Chemical[]>(
      "/chemicals"
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch chemicals."
      )
    );
  }
}

async function addChemical(
  payload: Chemical
): Promise<void> {
  try {
    await apiClient.post(
      "/chemicals",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to add chemical."
      )
    );
  }
}

async function updateChemical(
  payload: Chemical
): Promise<void> {
  try {
    await apiClient.put(
      "/chemicals",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to update chemical."
      )
    );
  }
}

async function deleteChemical(
  slNo: string
): Promise<void> {
  if (!slNo) {
    throw new Error(
      "Chemical serial number is required."
    );
  }

  try {
    await apiClient.delete(
      `/chemicals/${encodeURIComponent(slNo)}`
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to delete chemical."
      )
    );
  }
}

/* =========================================================
   INSTRUMENTS
   ========================================================= */

async function getInstruments(): Promise<Instrument[]> {
  try {
    const response = await apiClient.get<Instrument[]>(
      "/instruments"
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch instruments."
      )
    );
  }
}

async function addInstrument(
  payload: Instrument
): Promise<void> {
  try {
    await apiClient.post(
      "/instruments",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to add instrument."
      )
    );
  }
}

async function updateInstrument(
  payload: Instrument
): Promise<void> {
  try {
    await apiClient.put(
      "/instruments",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to update instrument."
      )
    );
  }
}

async function deleteInstrument(
  id: string
): Promise<void> {
  if (!id) {
    throw new Error(
      "Instrument ID is required."
    );
  }

  try {
    await apiClient.delete(
      `/instruments/${encodeURIComponent(id)}`
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to delete instrument."
      )
    );
  }
}

/* =========================================================
   STANDARDS
   ========================================================= */

async function getStandards(): Promise<Standard[]> {
  try {
    const response = await apiClient.get<Standard[]>(
      "/standards"
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch standards."
      )
    );
  }
}

async function addStandard(
  payload: Standard
): Promise<void> {
  try {
    await apiClient.post(
      "/standards",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to add standard."
      )
    );
  }
}

async function updateStandard(
  payload: Standard
): Promise<void> {
  try {
    await apiClient.put(
      "/standards",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to update standard."
      )
    );
  }
}

async function deleteStandard(
  serialNo: string
): Promise<void> {
  if (!serialNo) {
    throw new Error(
      "Standard serial number is required."
    );
  }

  try {
    await apiClient.delete(
      `/standards/${encodeURIComponent(serialNo)}`
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to delete standard."
      )
    );
  }
}

/* =========================================================
   MEDIA
   ========================================================= */

async function getMedia(): Promise<Media[]> {
  try {
    const response = await apiClient.get<Media[]>(
      "/media"
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch media."
      )
    );
  }
}

async function addMedia(
  payload: Media
): Promise<void> {
  try {
    await apiClient.post(
      "/media",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to add media."
      )
    );
  }
}

async function updateMedia(
  payload: Media
): Promise<void> {
  try {
    await apiClient.put(
      "/media",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to update media."
      )
    );
  }
}

async function deleteMedia(
  id: number | string
): Promise<void> {
  if (
    id === undefined ||
    id === null ||
    String(id).trim() === ""
  ) {
    throw new Error(
      "Media ID is required."
    );
  }

  try {
    await apiClient.delete(
      `/media/${encodeURIComponent(String(id))}`
    );
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to delete media."
      )
    );
  }
}

/* =========================================================
   WORKSHEET LOG
   ========================================================= */

async function insertWorksheetLog(
  payload: WorksheetLogRequest
): Promise<{ message: string }> {
  try {
    const response =
      await apiClient.post<{ message: string }>(
        "/logs",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    return response.data;
  } catch (error: any) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to insert log."
      )
    );
  }
}

/* =========================================================
   PUBLIC SERVICE
   ========================================================= */

export const referenceDataService = {
  // Chemicals
  getChemicals,
  addChemical,
  updateChemical,
  deleteChemical,

  // Instruments
  getInstruments,
  addInstrument,
  updateInstrument,
  deleteInstrument,

  // Standards
  getStandards,
  addStandard,
  updateStandard,
  deleteStandard,

  // Media
  getMedia,
  addMedia,
  updateMedia,
  deleteMedia,

  // Logs
  insertWorksheetLog,
};

export {
  getChemicals,
  addChemical,
  updateChemical,
  deleteChemical,

  getInstruments,
  addInstrument,
  updateInstrument,
  deleteInstrument,

  getStandards,
  addStandard,
  updateStandard,
  deleteStandard,

  getMedia,
  addMedia,
  updateMedia,
  deleteMedia,

  insertWorksheetLog,
};