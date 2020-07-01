import * as React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { ControlBar } from "./ControlBar";
import { EditingWindow } from "./EditingWindow";
import * as ImageManipulator from "expo-image-manipulator";
import { Processing } from "./Processing";
import Modal from "modal-react-native-web";

const PlatformModal = Platform.OS == "web" ? Modal : RNModal;

// Stop ARIA errors
if (Platform.OS == "web") {
  PlatformModal.setAppElement("#root");
}


export interface ImageEditorProps {
  visible: boolean;
  onCloseEditor: () => void;
  imageData: {
    uri: string | undefined;
    width: number;
    height: number;
  };
  fixedCropAspectRatio: number;
  minimumCropDimensions: {
    width: number;
    height: number;
  };
  onEditingComplete: (result: any) => void;
  lockAspectRatio: boolean;
}

interface ImageEditorStore {
  imageScaleFactor: number;
  imageBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  accumulatedPan: {
    x: number;
    y: number;
  };
  cropSize: {
    width: number;
    height: number;
  };
  ready: boolean;
  processing: boolean;
  mode: "operation-select" | "crop";
  imageData: {
    uri: string;
    height: number;
    width: number;
  };
}

function ImageEditor(props: ImageEditorProps) {
  const initialState: ImageEditorStore = {
    imageScaleFactor: 1,
    imageBounds: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    accumulatedPan: {
      x: 0.0,
      y: 0.0,
    },
    cropSize: {
      width: 0,
      height: 0,
    },
    ready: false,
    processing: false,
    mode: "operation-select",
    imageData: props.imageData,
  };

  const [editorState, setEditorState] = React.useState<ImageEditorStore>(
    initialState
  );

  const onPerformCrop = async () => {
    // Calculate cropping bounds
    const {
      imageBounds,
      accumulatedPan,
      imageScaleFactor,
      cropSize,
    } = editorState;
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
    setEditorState({ ...editorState, processing: true });
    await ImageManipulator.manipulateAsync(
      editorState.imageData.uri as string,
      [{ crop: croppingBounds }]
    )
      .then(async ({ uri, width, height }) => {
        // Check if on web - currently there is a weird bug where it will keep
        // the canvas from ImageManipualtor at originX + width and so we'll just crop
        // the result again for now if on web - TODO write github issue!
        if (Platform.OS == "web") {
          await ImageManipulator.manipulateAsync(uri, [
            { crop: { ...croppingBounds, originX: 0, originY: 0 } },
          ])
            .then(({ uri, width, height }) => {
              setEditorState({
                ...editorState,
                processing: false,
                imageData: { uri, width, height },
                mode: "operation-select",
              });
            })
            .catch((error) => {
              // If there's an error dismiss the the editor and alert the user
              setEditorState({ ...editorState, processing: false });
              props.onCloseEditor();
              Alert.alert("An error occurred while editing.");
            });
        } else {
          setEditorState({
            ...editorState,
            processing: false,
            imageData: { uri, width, height },
            mode: "operation-select",
          });
        }
      })
      .catch((error) => {
        // If there's an error dismiss the the editor and alert the user
        setEditorState({ ...editorState, processing: false });
        props.onCloseEditor();
        Alert.alert("An error occurred while editing.");
      });
  };

  const onRotate = async (angle: number) => {
    // Rotate the image by the specified angle
    setEditorState({ ...editorState, processing: true });
    await ImageManipulator.manipulateAsync(
      editorState.imageData.uri as string,
      [{ rotate: angle }]
    )
      .then(async ({ uri, width, height }) => {
        // Set the image data
        setEditorState({
          ...editorState,
          imageData: {
            uri,
            height,
            width,
          },
          processing: false,
        });
      })
      .catch((error) => {
        alert("An error occured while editing.");
      });
  };

  const onFinishEditing = () => {
    setEditorState({ ...editorState, processing: false });
    props.onEditingComplete(editorState.imageData);
    props.onCloseEditor();
  };

  React.useEffect(() => {
    // Reset the state of things and only render the UI
    // when this state has been initialised
    if (!props.visible) {
      setEditorState({ ...initialState, ready: false });
    } else {
      setEditorState({ ...initialState, ready: true });
    }
  }, [props.visible]);

  return (
    <PlatformModal visible={props.visible} transparent animationType="slide">
      <StatusBar hidden />
      {editorState.ready ? (
        <View style={styles.container}>
          <ControlBar
            onPressBack={() =>
              editorState.mode == "operation-select"
                ? props.onCloseEditor()
                : setEditorState({ ...editorState, mode: "operation-select" })
            }
            onPerformCrop={() => onPerformCrop()}
            mode={editorState.mode}
            onChangeMode={(mode) => setEditorState({ ...editorState, mode })}
            onRotate={(angle) => onRotate(angle)}
            onFinishEditing={() => onFinishEditing()}
          />
          <EditingWindow
            imageData={editorState.imageData}
            fixedCropAspectRatio={1 / props.fixedCropAspectRatio}
            lockAspectRatio={props.lockAspectRatio}
            imageBounds={editorState.imageBounds}
            minimumCropDimensions={props.minimumCropDimensions}
            onUpdateImageBounds={(bounds) =>
              setEditorState({ ...editorState, ...bounds })
            }
            accumulatedPan={editorState.accumulatedPan}
            onUpdateAccumulatedPan={(accumulatedPan) => {
              setEditorState({
                ...editorState,
                accumulatedPan: accumulatedPan,
              });
            }}
            cropSize={editorState.cropSize}
            onUpdateCropSize={(size) =>
              setEditorState({ ...editorState, cropSize: size })
            }
            onUpdatePanAndSize={({ accumulatedPan, size }) =>
              setEditorState({ ...editorState, cropSize: size, accumulatedPan })
            }
            isCropping={editorState.mode == "crop" ? true : false}
          />
        </View>
      ) : null}
      {editorState.processing ? <Processing /> : null}
    </PlatformModal>
  );
}

export { ImageEditor };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
});
