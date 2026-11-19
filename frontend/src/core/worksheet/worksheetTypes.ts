export interface Worksheet {
  worksheetId?: string;
  registrationNo?: string;
  sampleName?: string;
  preparationId?: string;
  status?: string;
}

export interface WorksheetQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}