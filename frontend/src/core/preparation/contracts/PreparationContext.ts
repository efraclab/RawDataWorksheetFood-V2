export interface PreparationContext {
  worksheetId: string;

  preparationId: string;

  userId?: string;

  data: Record<string, unknown>;

  metadata?: Record<string, unknown>;
}