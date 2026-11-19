import type { ComponentType } from "react";

export interface PreparationModuleDefinition {
  /** Stable V2 preparation module identity. */
  readonly id: string;

  /** UI display name. */
  readonly title: string;

  /** Optional UI metadata. */
  readonly color?: string;

  /** React component responsible for the preparation module UI. */
  readonly component: ComponentType<any>;

  /**
   * Existing backend preparation types represented by this module.
   * Core uses these only for generic worksheet restoration/persistence.
   */
  readonly preparationType?: string;

  /** Existing backend calculation type represented by this module. */
  readonly calculationType?: string;
}
