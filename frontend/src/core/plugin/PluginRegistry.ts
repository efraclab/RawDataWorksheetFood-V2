import type { PreparationHandler } from "../preparation/runtime";
import type { LabPlugin } from "./LabPlugin";

export class PluginRegistry {
  private readonly plugins = new Map<string, LabPlugin>();

  /**
   * Register a laboratory plugin.
   */
  register(plugin: LabPlugin): void {
    if (!plugin.id.trim()) {
      throw new Error("Plugin id cannot be empty.");
    }

    if (this.plugins.has(plugin.id)) {
      throw new Error(
        `Plugin '${plugin.id}' is already registered.`
      );
    }

    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Get a plugin by ID.
   */
  resolve(pluginId: string): LabPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Check whether a plugin exists.
   */
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * Get all registered plugins.
   */
  getAll(): readonly LabPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all preparations from all plugins.
   *
   * Core does not need to know which laboratory owns them.
   */
  getPreparations(): readonly PreparationHandler[] {
    return this.getAll().flatMap(
      (plugin) => plugin.preparations
    );
  }

  /**
   * Resolve a preparation by ID.
   */
  resolvePreparation(
    preparationId: string
  ): PreparationHandler | undefined {
    for (const plugin of this.plugins.values()) {
      const preparation = plugin.preparations.find(
        (item) =>
          item.definition.id === preparationId
      );

      if (preparation) {
        return preparation;
      }
    }

    return undefined;
  }

  /**
   * Clear registry.
   *
   * Useful for tests and controlled application initialization.
   */
  clear(): void {
    this.plugins.clear();
  }
}