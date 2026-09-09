export interface Standard {
  serialNo: string;
  name: string;
  purity?: string | null;
  make?: string | null;
  batchNo?: string | null;
  validity?: string | null;
  [key: string]: unknown;
}
