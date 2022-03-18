package io.framework7.colloghhealthv.plugins.ScreenOrientation;

import android.content.pm.ActivityInfo;
import android.util.Log;
import android.view.Surface;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.ihealth.communication.control.BpProfile;
import com.ihealth.communication.manager.iHealthDevicesCallback;
import com.ihealth.communication.manager.iHealthDevicesManager;

public class HealthBridge {
    private AppCompatActivity activity;

    private static final String TAG = "HealthBridge";

    private int callbackId;

    public HealthBridge(AppCompatActivity activity) {
        this.activity = activity;
    }

    public void registerCallbacks(PluginCall call) {
        call.setKeepAlive(true);
        iHealthDevicesCallback c1 = new iHealthDevicesCallback() {
            @Override
            public void onScanDevice(String mac, String deviceType, int rssi) {
                // what do we do with device??
                JSObject ret = new JSObject();
                ret.put("event", "scanDevice");
                ret.put("data", deviceType);
                ret.put("mac", mac);
                call.resolve(ret);
            }
            @Override
            public void onDeviceConnectionStateChange(String mac, String deviceType, int
                    status, int errorId) {
                JSObject ret = new JSObject();
                ret.put("event", "deviceConnectionStateChange");
                ret.put("data", status);
                ret.put("mac", mac);
                call.resolve(ret);

               // if (status == iHealthDevicesManager.DEVICE_STATE_CONNECTED) {
            }
            @Override
            public void onDeviceNotify(String mac, String deviceType, String action, String message)
            {
                JSObject ret = new JSObject();
                ret.put("event", "deviceNotify");
                ret.put("data", action);
                ret.put("mac", mac);
                call.resolve(ret);
//                BpProfile.ACTION_GET_CYCLE_MEASURE_ABPM

              //  if (action.equals(BpProfile.ACTION_BATTERY_BP)) {
            }
            @Override
            public void onScanError(String reason, long latency) {
                Log.e(TAG, reason);
                Log.e(TAG, "please wait for " + latency + " ms");
            }

            @Override
            public void onScanFinish() {
                super.onScanFinish();
            }
        };
        callbackId = iHealthDevicesManager.getInstance().registerClientCallback(c1);
    }
//    @Override
//    public void onDestroyView() {
//        super.onDestroyView();
//        iHealthDevicesManager.getInstance().unRegisterClientCallback(callbackId);
//    }

}
