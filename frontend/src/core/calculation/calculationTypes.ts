export interface CalculationContext {
  worksheetId: string;

  preparationId: string;

  values: Record<string, unknown>;

  metadata?: Record<string, unknown>;
}

export interface CalculationResult {
  success: boolean;

  values?: Record<string, unknown>;

  errors?: string[];

  warnings?: string[];
}