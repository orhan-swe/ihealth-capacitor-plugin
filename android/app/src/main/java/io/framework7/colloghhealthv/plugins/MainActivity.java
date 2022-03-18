package io.framework7.colloghhealthv.plugins;

import android.Manifest;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import com.ihealth.communication.manager.iHealthDevicesManager;
import com.tbruyelle.rxpermissions2.Permission;
import com.tbruyelle.rxpermissions2.RxPermissions;

import java.io.IOException;
import java.io.InputStream;

import io.framework7.colloghhealthv.plugins.ScreenOrientation.ScreenOrientationPlugin;
import io.reactivex.functions.Consumer;

public class MainActivity extends BridgeActivity {

    private Context mContext;
    private RxPermissions permissions;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPermission();
        registerPlugin(ScreenOrientationPlugin.class);
        iHealthDevicesManager.getInstance().init(getApplication(), Log.VERBOSE, Log.WARN);
        this.authIHealth();
    }

    public void authIHealth() {
        try {
            InputStream is = getAssets().open("license.pem");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            boolean isPass = iHealthDevicesManager.getInstance().sdkAuthWithLicense(buffer);
            Log.i("info", "isPass: " + isPass);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private void checkPermission() {
        permissions = new RxPermissions(this);
        permissions.requestEach(Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.RECORD_AUDIO)
                .subscribe(new Consumer<Permission>() {
                    @Override
                    public void accept(Permission permission) {
                        if (permission.granted) {

                        } else if (permission.shouldShowRequestPermissionRationale) {
                            // ToastUtils.showToast(MainActivity.this, "请打开相关权限，否则会影响功能的使用");
                        } else {
                            // ToastUtils.showToast(MainActivity.this, "请打开相关权限，否则会影响功能的使用");
                        }
                    }
                });
    }

}

