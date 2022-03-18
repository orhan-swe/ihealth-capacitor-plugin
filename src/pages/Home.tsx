import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { checkmarkCircle, phoneLandscape } from "ionicons/icons";
import { ScreenOrientation } from "../plugins/screen-orientation";

import "./Home.css";
import { HealthData } from "../plugins/screen-orientation/web";

const Home: React.FC = () => {
  const [orientation, setOrientation] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  let callbackId = useRef("");
  let mac = useRef("");

  useEffect(() => {
    ScreenOrientation.addListener("screenOrientationChange", (res) =>
      setOrientation(res.type)
    );

    // TODO make sure we have access to bluetoot?
    ScreenOrientation.registerHealthCallbacks(
        (data: HealthData, error) => {
          if (data.event) {
            // alert("We got an event: " + data.event)
            console.log("Event: " + data.event)
            console.log("Mac: " + data.mac)
            console.log("Status: " + getStatus(data.status))
            console.log("Action: " + data.action)
            console.log("Error: " + data.error)
            console.log("Message: " + data.message)
            if (data.mac)
              mac.current = data.mac
            if(data.event === "scanDevice") {
              // scan found a device
            }
            if(data.event === "deviceConnectionStateChange") {
              // connection to the device changed
              if (getStatus(data.status) === "DEVICE_STATE_CONNECTED" )
                setConnected(true)
              if (getStatus(data.status) !== "DEVICE_STATE_CONNECTED" )
                setConnected(false)
            }
            if(data.event === "deviceNotify") {
              // got data from device in message!
            }
            if(data.event === "scanError") {
              alert("There was error when scanning")
            }
            if(data.event === "scanFinish") {
              // connection to the device changed
              setScanning(false);
            }
      }}).then(res => {
        // lets start scanning:
        callbackId.current = res
        ScreenOrientation.startScanning();
        setScanning(true);
        // setTimeout(() => {
        // })
      });

    ScreenOrientation.orientation().then((res) => setOrientation(res.type));

    return () => {
      ScreenOrientation.removeAllListeners();
    };
  }, []);

  let getStatus = (status?: Number | null) => {
    if (status !== 0  && !status)
      return ""
    switch(status) {
      case 0: return "DEVICE_STATE_CONNECTING"
      case 1: return "DEVICE_STATE_CONNECTED" 
      case 2: return "DEVICE_STATE_DISCONNECTED" 
      case 3: return "DEVICE_STATE_CONNECTIONFAIL" 
      case 4: return "DEVICE_STATE_RECONNECTING" 
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>We are scanning: {scanning ? "true": "false"}</IonTitle>
          <IonTitle>We are connected: {connected ? "true": "false"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* {orientation.includes("portrait") && (
          <div className="incorrect-orientation">
            <p>
              Please turn the device to landscape mode to sign for your
              delivery.
            </p>
            <IonButton
              onClick={() =>
                ScreenOrientation.lock({ orientation: "landscape-primary" })
              }
            >
              <IonIcon icon={phoneLandscape} />
              Rotate My Device
            </IonButton>
          </div>
        )} */}
          <div className="ion-padding esign">
            {/* <span>Please sign to confirm your delivery:</span> */}

          {!scanning && !connected ?
            <IonButton expand="full" onClick={() => {
              setScanning(true)
              ScreenOrientation.startScanning()
            }
          }>
              <IonIcon icon={checkmarkCircle} />
              Start Scanning again
            </IonButton> : null }
            {mac.current ? 
              <IonButton expand="full" onClick={() => {
                  if (!mac.current) {
                    alert("ERROR no mac")
                    console.log("mac: " + mac.current)
                    return;
                  }
                  ScreenOrientation.connectDevice({mac: mac.current})
                }
              }>
                <IonIcon icon={checkmarkCircle} />
                Connect to device {mac.current}?
              </IonButton> : null }

            {/* <IonButton expand="full" onClick={() => ScreenOrientation.clearHealthCallbacks(
              {id: callbackId.current}
            )}>
              <IonIcon icon={checkmarkCircle} />
              Clear callbacks
            </IonButton> */}


            <IonButton expand="full" onClick={() => {
                alert("mac we are sending: " + mac.current)
                ScreenOrientation.getOfflineData({mac: mac.current})
            }}>
              <IonIcon icon={checkmarkCircle} />
              GetOfflineData
            </IonButton>

            <IonButton expand="full" onClick={() => {
                alert("mac we are sending: " + mac.current)
                ScreenOrientation.getOfflineNum({mac: mac.current})
              }
            }>
              <IonIcon icon={checkmarkCircle} />
              GetOfflineNum
            </IonButton>
          </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
