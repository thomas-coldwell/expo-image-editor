import * as React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { ControlBar } from "./ControlBar";
import { EditingWindow } from "./EditingWindow";
import * as ImageManipulator from "expo-image-manipulator";
import { Processing } from "./Processing";
import Modal from "modal-react-native-web";
import { useRecoilState, RecoilRoot } from "recoil";
import {
  imageBoundsState,
  accumulatedPanState,
  imageScaleFactorState,
  cropSizeState,
  processingState,
  imageDataState,
  editingModeState,
  readyState,
  fixedCropAspectRatioState,
  lockAspectRatioState,
  minimumCropDimensionsState,
} from "./Store";
import { Asset } from "expo-asset";
import { OperationBar } from "./OperationBar/OperationBar";
const noScroll = require("no-scroll");

export type Mode = "full" | "crop-only" | "rotate-only";

export interface ImageEditorProps {
  visible: boolean;
  onCloseEditor: () => void;
  imageUri: string | undefined;
  fixedCropAspectRatio: number;
  minimumCropDimensions: {
    width: number;
    height: number;
  };
  onEditingComplete: (result: any) => void;
  lockAspectRatio: boolean;
  mode: Mode;
}

function ImageEditorCore(props: ImageEditorProps) {
  const [imageBounds, setImageBounds] = useRecoilState(imageBoundsState);
  const [imageData, setImageData] = useRecoilState(imageDataState);
  const [accumulatedPan, setAccumulatedPan] = useRecoilState(
    accumulatedPanState
  );
  const [imageScaleFactor] = useRecoilState(imageScaleFactorState);
  const [cropSize, setCropSize] = useRecoilState(cropSizeState);
  const [ready, setReady] = useRecoilState(readyState);
  const [processing, setProcessing] = useRecoilState(processingState);
  const [editingMode, setEditingMode] = useRecoilState(editingModeState);
  const [, setFixedCropAspectRatio] = useRecoilState(fixedCropAspectRatioState);
  const [, setLockAspectRatio] = useRecoilState(lockAspectRatioState);
  const [, setMinimumCropDimensions] = useRecoilState(
    minimumCropDimensionsState
  );

  // Initialise the image data when it is set through the props
  React.useEffect(() => {
    (async () => {
      if (props.imageUri) {
        const enableEditor = () => {
          setReady(true);
          // Set no-scroll to on
          noScroll.on();
        };
        // Platform check
        if (Platform.OS == "web") {
          var img = document.createElement("img");
          img.onload = () => {
            setImageData({
              uri: props.imageUri,
              height: img.height,
              width: img.width,
            });
            enableEditor();
          };
          img.src = props.imageUri;
        } else {
          const {
            width: pickerWidth,
            height: pickerHeight,
          } = await ImageManipulator.manipulateAsync(props.imageUri, []);
          console.log(pickerWidth, pickerHeight);
          setImageData({
            uri: props.imageUri,
            width: pickerWidth,
            height: pickerHeight,
          });
          enableEditor();
        }
      }
    })();
  }, [props.imageUri]);

  // Initialise / update the editing mode set through props
  React.useEffect(() => {
    setEditingMode(props.mode === "crop-only" ? "crop" : "operation-select");
  }, [props.mode]);

  // Initialise / update the crop AR / AR lock / min crop dims set through props
  React.useEffect(() => {
    setFixedCropAspectRatio(props.fixedCropAspectRatio);
  }, [props.fixedCropAspectRatio]);
  React.useEffect(() => {
    setLockAspectRatio(props.lockAspectRatio);
  }, [props.lockAspectRatio]);
  React.useEffect(() => {
    setMinimumCropDimensions(props.minimumCropDimensions);
  }, [props.minimumCropDimensions]);

  const onFinishEditing = async () => {
    setProcessing(false);
    props.onEditingComplete(imageData);
    onCloseEditor();
  };

  const onCloseEditor = () => {
    // Set no-scroll to off
    noScroll.off();
    props.onCloseEditor();
  };

  React.useEffect(() => {
    // Reset the state of things and only render the UI
    // when this state has been initialised
    if (!props.visible) {
      setReady(false);
    }
  }, [props.visible]);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000000,
        elevation: 1000000,
        opacity: props.visible ? 1.0 : 0.0,
      }}
      pointerEvents={props.visible ? "auto" : "none"}
    >
      <StatusBar hidden />
      {ready ? (
        <View style={styles.container}>
          <ControlBar
            onPressBack={() =>
              editingMode == "operation-select"
                ? props.onCloseEditor()
                : setEditingMode("operation-select")
            }
            onFinishEditing={() => onFinishEditing()}
            mode={props.mode}
          />
          <EditingWindow />
          <OperationBar />
        </View>
      ) : null}
      {processing ? <Processing /> : null}
    </View>
  );
}

export function ImageEditor(props: ImageEditorProps) {
  return (
    <RecoilRoot>
      <ImageEditorCore {...props} />
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
});
