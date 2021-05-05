import * as React from "react";
import { StyleSheet, View, StatusBar, Platform, Modal } from "react-native";
import { ControlBar } from "./ControlBar";
import { EditingWindow } from "./EditingWindow";
import * as ImageManipulator from "expo-image-manipulator";
import { Processing } from "./Processing";
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
  throttleBlurState,
} from "./Store";
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
  throttleBlur?: boolean;
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
  const [, setThrottleBlur] = useRecoilState(throttleBlurState);

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
          let img = document.createElement("img");
          img.onload = () => {
            setImageData({
              uri: props.imageUri ?? "",
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
  React.useEffect(() => {
    setThrottleBlur(Boolean(props.throttleBlur));
  }, [props.throttleBlur]);

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
    <>
      <StatusBar hidden={props.visible} />
      <Modal
        visible={props.visible}
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        {ready ? (
          <View style={styles.container}>
            <ControlBar
              onPressBack={() =>
                editingMode == "operation-select"
                  ? props.onCloseEditor()
                  : setEditingMode("operation-select")
              }
              onFinishEditing={() => onFinishEditing()}
            />
            <EditingWindow />
            <OperationBar />
          </View>
        ) : null}
        {processing ? <Processing /> : null}
      </Modal>
    </>
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
