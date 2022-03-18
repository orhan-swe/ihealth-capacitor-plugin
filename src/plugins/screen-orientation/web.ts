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
  async clearHealthCallbacks(id: CallbackID): Promise<void> {
    clearInterval(Number.parseInt(id));
  }
  async getOfflineData(mac: String): Promise<void> {
    alert("calling getOfflineData")
  }
  async getOfflineNum(mac: String): Promise<void> {
    alert("calling getOfflineNum")
  }
  async startScanning(): Promise<void> {
    alert("calling startScanning")
  }
  async getLatestValues(): Promise<void> {
    alert("calling getLatestValues")
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
  event: string;
  data: string;
  message: string;
  mac?: string | null;
}
