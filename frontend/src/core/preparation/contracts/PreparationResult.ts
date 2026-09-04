export interface PreparationResult {
  success: boolean;

  data?: Record<string, unknown>;

  errors?: string[];

  warnings?: string[];
}