import { PluginRegistry } from "../core/plugin";
import { foodPlugin } from "../plugins/food";
import environmentPlugin from "../plugins/environment";
import waterPlugin from "../plugins/water";
import gasPlugin from "../plugins/gas";
import metalPlugin from "../plugins/metal";
import microPlugin from "../plugins/micro";
import raPlugin from "../plugins/ra";

/**
 * Application-wide plugin registry.
 */
export const pluginRegistry = new PluginRegistry();

/**
 * Prevent duplicate registration during development/HMR.
 */
let initialized = false;

/**
 * Register all laboratory plugins.
 *
 * Important:
 * This file registers PLUGINS only.
 *
 * Individual preparations must NOT be registered here.
 */
export function registerPlugins(): void {
  if (initialized) {
    return;
  }

  pluginRegistry.register(foodPlugin);

  pluginRegistry.register(environmentPlugin);
  pluginRegistry.register(waterPlugin);
  pluginRegistry.register(gasPlugin);
  pluginRegistry.register(metalPlugin);
  pluginRegistry.register(microPlugin);
  pluginRegistry.register(raPlugin);

  initialized = true;
}