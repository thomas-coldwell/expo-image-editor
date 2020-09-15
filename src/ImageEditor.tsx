import * as React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Platform,
  Image,
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
const PlatformModal = Platform.OS == "web" ? Modal : RNModal;

// Stop ARIA errors
if (Platform.OS == "web") {
  PlatformModal.setAppElement("#root");
}

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
          Image.getSize(
            props.imageUri,
            (width: number, height: number) => {
              // Image.getSize gets the right ratio, but incorrect magnitude
              // whereas expo image picker does vice versa 😅...this fixes it.
              setImageData({
                uri: props.imageUri,
                width: width > height ? pickerWidth : pickerHeight,
                height: width > height ? pickerHeight : pickerWidth,
              });
              enableEditor();
            },
            (error: any) => console.log(error)
          );
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

  const onPerformCrop = async () => {
    // Calculate cropping bounds
    const croppingBounds = {
      originX: Math.round(
        (accumulatedPan.x - imageBounds.x) * imageScaleFactor
      ),
      originY: Math.round(
        (accumulatedPan.y - imageBounds.y) * imageScaleFactor
      ),
      width: Math.round(cropSize.width * imageScaleFactor),
      height: Math.round(cropSize.height * imageScaleFactor),
    };
    // Set the editor state to processing and perform the crop
    setProcessing(true);
    await ImageManipulator.manipulateAsync(imageData.uri, [
      { crop: croppingBounds },
    ])
      .then(async ({ uri, width, height }) => {
        // Check if on web - currently there is a weird bug where it will keep
        // the canvas from ImageManipualtor at originX + width and so we'll just crop
        // the result again for now if on web - TODO write github issue!
        if (Platform.OS == "web") {
          await ImageManipulator.manipulateAsync(uri, [
            { crop: { ...croppingBounds, originX: 0, originY: 0 } },
          ])
            .then(({ uri, width, height }) => {
              if (props.mode == "crop-only") {
                setProcessing(false);
                props.onEditingComplete({ uri, width, height });
                onCloseEditor();
              } else {
                setProcessing(false);
                setImageData({ uri, width, height });
                setEditingMode("operation-select");
              }
            })
            .catch((error) => {
              // If there's an error dismiss the the editor and alert the user
              setProcessing(false);
              onCloseEditor();
              Alert.alert("An error occurred while editing.");
            });
        } else {
          if (props.mode == "crop-only") {
            setProcessing(false);
            props.onEditingComplete({ uri, width, height });
            onCloseEditor();
          } else {
            setProcessing(false);
            setImageData({ uri, width, height });
            setEditingMode("operation-select");
          }
        }
      })
      .catch((error) => {
        // If there's an error dismiss the the editor and alert the user
        setProcessing(false);
        onCloseEditor();
        Alert.alert("An error occurred while editing.");
      });
  };

  const onRotate = async (angle: number) => {
    // Rotate the image by the specified angle
    setProcessing(false);
    await ImageManipulator.manipulateAsync(imageData.uri, [{ rotate: angle }])
      .then(async ({ uri, width, height }) => {
        // Set the image data
        setProcessing(false);
        setImageData({ uri, width, height });
      })
      .catch((error) => {
        alert("An error occured while editing.");
      });
  };

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
    <PlatformModal visible={props.visible} transparent animationType="slide">
      <StatusBar hidden />
      {ready ? (
        <View style={styles.container}>
          <ControlBar
            onPressBack={() =>
              editingMode == "operation-select"
                ? props.onCloseEditor()
                : setEditingMode("operation-select")
            }
            onPerformCrop={() => onPerformCrop()}
            onRotate={(angle) => onRotate(angle)}
            onFinishEditing={() => onFinishEditing()}
            mode={props.mode}
          />
          <EditingWindow />
          <OperationBar />
        </View>
      ) : null}
      {processing ? <Processing /> : null}
    </PlatformModal>
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
