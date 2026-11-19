export interface Chemical {
  slno: string;
  name: string;
  code: string;

  make?: string | null;
  part_No?: string | null;
  exp_Date?: string | null;
  batchNo?: string | null;
  modular_Height?: string | null;
  cas_No?: string | null;
  manufacturer_Date?: string | null;
  packQuantity?: string | number | null;
  packUnit?: string | null;
}

export interface Instrument {
  id: string;
  name: string;

  sl_No?: string | null;
  make?: string | null;
  instrumentTag?: string | null;
  purchaseDate?: string | null;
  labName?: string | null;
  warrenty_UOTO?: string | null;
  amc_UPTO?: string | null;
  cmc_UPTO?: string | null;
  calibrationDoneDate?: string | null;
  calibrationDueDate?: string | null;
  calibrationAgency?: string | null;
}

export interface Standard {
  serialNo: string;
  name: string;

  batchNo?: string | null;
  make?: string | null;
  purity?: string | null;
  department?: string | null;
  pack?: string | null;
  unitCode?: number | string | null;
  unit?: string | null;
  validity?: string | null;
  remarks?: string | null;
}

export interface Media {
  id?: number | string | null;
  name: string;

  code?: string | null;
  expDate?: string | null;
  quantityValue?: number | string | null;
  quantityUnit?: string | null;
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

export type ReferenceDataType =
  | "chemicals"
  | "instruments"
  | "standards"
  | "media";