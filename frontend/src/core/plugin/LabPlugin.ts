import type { PreparationHandler } from "../preparation/runtime";

export interface LabPlugin {
  /**
   * Unique identifier of the laboratory plugin.
   *
   * Examples:
   * food
   * water
   * environment
   * gas
   * metal
   * micro
   * ra
   */
  readonly id: string;

  /**
   * Display name.
   */
  readonly name: string;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Preparations owned by this plugin.
   *
   * The plugin owns its preparations.
   * Core does not know individual preparation IDs.
   */
  readonly preparations: readonly PreparationHandler[];
}