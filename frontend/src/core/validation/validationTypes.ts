export type ValidationSeverity =
  | "error"
  | "warning";

export interface ValidationMessage {
  field?: string;

  message: string;

  severity: ValidationSeverity;
}

export interface ValidationResult {
  valid: boolean;

  messages: ValidationMessage[];
}