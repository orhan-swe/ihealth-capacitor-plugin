import type { CallbackID, PluginListenerHandle } from "@capacitor/core";
import { HealthCallback } from "./web";

export interface ScreenOrientationPlugin {

  // will register callbacks and we need to react on each callback somehow
  registerHealthCallbacks(callback: HealthCallback): Promise<CallbackID>;
  clearHealthCallbacks(opts: {id: CallbackID}): Promise<void>;
  // start scanning, nothing to do
  startScanning(): Promise<void>;
  // read values , nothing to do (values will be coming from the callback)
  getOfflineData(opts: {mac: String}): Promise<void>;
  getOfflineNum(opts: {mac: String}): Promise<void>;
  connectDevice(opts: {mac: String}): Promise<void>;

  /**
   * Returns the screen's current orientation.
   */
  orientation(): Promise<{ type: OrientationType }>;

  /**
   * Locks the screen orientation.
   */
  lock(opts: { orientation: OrientationLockType }): Promise<void>;

  /**
   * Unlocks the screen's orientation.
   */
  unlock(): Promise<void>;

  /**
   * Listens for screen orientation changes.
   */
  addListener(
    eventName: "screenOrientationChange",
    listenerFunc: (orientation: { type: OrientationType }) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Removes all listeners
   */
  removeAllListeners(): Promise<void>;
}
