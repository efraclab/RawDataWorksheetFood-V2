import type { PreparationHandler } from "./PreparationRuntime";

export class PreparationResolver {
  private readonly handlers =
    new Map<string, PreparationHandler>();

  register(handler: PreparationHandler): void {
    this.handlers.set(
      handler.definition.id,
      handler
    );
  }

  resolve(
    preparationId: string
  ): PreparationHandler | undefined {
    return this.handlers.get(preparationId);
  }

  has(preparationId: string): boolean {
    return this.handlers.has(preparationId);
  }

  clear(): void {
    this.handlers.clear();
  }
}