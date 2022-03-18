import { CallbackID, WebPlugin } from "@capacitor/core";
import type { ScreenOrientationPlugin } from "./definitions";

export class ScreenOrientationWeb
  extends WebPlugin
  implements ScreenOrientationPlugin
{
  constructor() {
    super();
    window.screen.orientation.addEventListener("change", () => {
      const type = window.screen.orientation.type;
      this.notifyListeners("screenOrientationChange", { type });
    });
  }

  async registerHealthCallbacks(callback: HealthCallback): Promise<CallbackID> {
    const id = setInterval(() => {
      console.log("hello health");
    }, 2000);
    alert("calling registerHealthCallbacks")
    return `${id}`;
  }
  async clearHealthCallbacks(opts: {id: CallbackID}): Promise<void> {
    clearInterval(Number.parseInt(opts.id));
  }
  async getOfflineData(opts: {mac: String}): Promise<void> {
    alert("calling getOfflineData")
  }
  async getOfflineNum(opts: {mac: String}): Promise<void> {
    alert("calling getOfflineNum")
  }
  async startScanning(): Promise<void> {
    alert("calling startScanning")
  }
  async getLatestValues(): Promise<void> {
    alert("calling getLatestValues")
  }
  async connectDevice(opts: {mac: String}): Promise<void> {
    alert("connect device")
  }

  async orientation(): Promise<{ type: OrientationType }> {
    return { type: window.screen.orientation.type };
  }

  async lock(opts: { orientation: OrientationLockType }): Promise<void> {
    await window.screen.orientation.lock(opts.orientation);
  }

  async unlock(): Promise<void> {
    window.screen.orientation.unlock();
  }
}
export type HealthCallback = (data: HealthData, err?: any) => void;
export interface HealthData {
  event?: string | null;
  mac?: string | null;
  status?: Number | null;
  action?: string | null;
  error?: string | null;
  message?: string | null;
}
