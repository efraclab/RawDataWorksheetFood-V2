export interface PreparationDefinition {
  id: string;
  name: string;
  laboratory: string;

  description?: string;

  version?: string;

  metadata?: Record<string, unknown>;
}