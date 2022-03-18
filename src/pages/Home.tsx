import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { checkmarkCircle, phoneLandscape } from "ionicons/icons";
import { ScreenOrientation } from "../plugins/screen-orientation";

import "./Home.css";
import { HealthData } from "../plugins/screen-orientation/web";

const Home: React.FC = () => {
  const [orientation, setOrientation] = useState<string>("");
  let callbackId: string = ""
  let mac: string = ""

  useEffect(() => {
    ScreenOrientation.addListener("screenOrientationChange", (res) =>
      setOrientation(res.type)
    );

    ScreenOrientation.orientation().then((res) => setOrientation(res.type));

    return () => {
      ScreenOrientation.removeAllListeners();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Delivery Confirmation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {orientation.includes("portrait") && (
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
        )}
        {orientation.includes("landscape") && (
          <div className="ion-padding esign">
            <span>Please sign to confirm your delivery:</span>
            {/* <div className="esign-pad" /> */}
            <IonButton expand="full" onClick={() => ScreenOrientation.unlock()}>
              <IonIcon icon={checkmarkCircle} />
              Confirm Signature
            </IonButton>
            <IonButton expand="full" onClick={() => ScreenOrientation.startScanning()}>
              <IonIcon icon={checkmarkCircle} />
              Start Scanning
            </IonButton>
            <IonButton expand="full" onClick={() => {
              ScreenOrientation.registerHealthCallbacks(
                (data: HealthData, error) => {
                  if (data.event) {
                    alert("We got an event: " + data.event)
                    console.log("Event: " + data.event)
                    console.log("Data: " + data.data)
                    console.log("Mac: " + data.mac)
                    if (data.mac)
                      mac = data.mac
                  }
                }
            ).then(res => callbackId = res)}}>
              <IonIcon icon={checkmarkCircle} />
              Register callbacks
            </IonButton>
            <IonButton expand="full" onClick={() => ScreenOrientation.clearHealthCallbacks(
              callbackId
            )}>
              <IonIcon icon={checkmarkCircle} />
              Clear callbacks
            </IonButton>
            <IonButton expand="full" onClick={() => ScreenOrientation.getOfflineData(mac
            )}>
              <IonIcon icon={checkmarkCircle} />
              GetOfflineData
            </IonButton>
            <IonButton expand="full" onClick={() => ScreenOrientation.getOfflineNum(mac
            )}>
              <IonIcon icon={checkmarkCircle} />
              GetOfflineNum
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
