export interface Chemical {
  slno: string;
  name: string;
  code?: string | null;
  make?: string | null;
  batchNo?: string | null;
  exp_Date?: string | null;
  expDate?: string | null;
  [key: string]: unknown;
}
