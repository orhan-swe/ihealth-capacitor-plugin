package io.framework7.colloghhealthv.plugins.ScreenOrientation;

import android.content.res.Configuration;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.ihealth.communication.control.Bp550BTControl;
import com.ihealth.communication.control.BtmControl;
import com.ihealth.communication.manager.DiscoveryTypeEnum;
import com.ihealth.communication.manager.iHealthDevicesCallback;
import com.ihealth.communication.manager.iHealthDevicesManager;

import io.framework7.colloghhealthv.plugins.ScreenOrientation.HealthBridge;

@CapacitorPlugin(name = "ScreenOrientation")
public class ScreenOrientationPlugin extends Plugin {
    private ScreenOrientation implementation;
    private HealthBridge implementationHB;

    @Override
    public void load() {

        implementation = new ScreenOrientation(getActivity());
        implementationHB = new HealthBridge(getActivity());
    }
    @PluginMethod()
    public void connectDevice(PluginCall call) {
        String mac = call.getString("mac");
        String type = call.getString("type");
        iHealthDevicesManager.getInstance().connectDevice("", mac, type);
    }
    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void registerHealthCallbacks(PluginCall call) {
        implementationHB.registerCallbacks(call);
    }
    @PluginMethod()
    public void clearHealthCallbacks(PluginCall call) {
        iHealthDevicesManager.getInstance().startDiscovery(DiscoveryTypeEnum.BP550BT);
        call.resolve();
    }
    @PluginMethod()
    public void startScanning(PluginCall call) {
        iHealthDevicesManager.getInstance().startDiscovery(DiscoveryTypeEnum.BP550BT);
        call.resolve();
    }
    @PluginMethod()
    public void getOfflineData(PluginCall call) {
        String mac = call.getString("mac");
        Bp550BTControl c = iHealthDevicesManager.getInstance().getBp550BTControl(mac);
        c.getOfflineData();
        // the data will come in the callback!
        call.resolve();
    }
    @PluginMethod()
    public void getOfflineNum(PluginCall call) {
        String mac = call.getString("mac");
        Bp550BTControl c = iHealthDevicesManager.getInstance().getBp550BTControl(mac);
        c.getOfflineNum();
        // the data will come in the callback!
        call.resolve();
    }

    @PluginMethod()
    public void orientation(PluginCall call) {
        JSObject ret = new JSObject();
        String type = implementation.getCurrentOrientationType();
        ret.put("type", type);
        call.resolve(ret);
    }

    @PluginMethod()
    public void lock(PluginCall call) {
        String orientationType = call.getString("orientation");
        if(orientationType == null) {
            call.reject("Input option 'orientation' must be provided.");
            return;
        }
        implementation.lock(orientationType);
        call.resolve();
    }

    @PluginMethod()
    public void unlock(PluginCall call) {
        implementation.unlock();
        call.resolve();
    }

    @Override
    public void handleOnConfigurationChanged(Configuration newConfig) {
        super.handleOnConfigurationChanged(newConfig);
        if(implementation.hasOrientationChanged(newConfig.orientation)) {
            this.onOrientationChanged();
        }
    }

    private void onOrientationChanged() {
        JSObject ret = new JSObject();
        String type = implementation.getCurrentOrientationType();
        ret.put("type", type);
        notifyListeners("screenOrientationChange", ret);
    }
}