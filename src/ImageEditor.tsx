import * as React from 'react';
import { Modal as RNModal, StyleSheet, View, StatusBar, Alert, Platform } from 'react-native';
import { ControlBar } from './ControlBar';
import { EditingWindow } from './EditingWindow';
import * as ImageManipulator from 'expo-image-manipulator';
import { Processing } from './Processing';
import Modal from 'modal-react-native-web';

const PlatformModal = Platform.OS == 'web' ? Modal : RNModal;

export interface ImageEditorProps {
  visible: boolean;
  onCloseEditor: () => void;
  imageData: {
    uri: string | undefined;
    width: number;
    height: number;
  };
  fixedCropAspectRatio: number;
  onEditingComplete: (result: any) => void;
}

interface ImageEditorStore {
  imageScaleFactor: number;
  imageBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  accumulatedPan: {
    x: number;
    y: number;
  },
  cropSize: {
    width: number;
    height: number;
  },
  ready: boolean;
  processing: boolean;
}

function ImageEditor(props: ImageEditorProps) {

  const initialState = {
    imageScaleFactor: 1,
    imageBounds: {
      x: 0, 
      y: 0,
      width: 0,
      height: 0
    },
    accumulatedPan: {
      x: 0.0,
      y: 0.0
    },
    cropSize: {
      width: 0,
      height: 0
    },
    ready: false,
    processing: false
  };

  const [editorState, setEditorState] = React.useState<ImageEditorStore>(initialState);

  const onPerformCrop = async () => {
    // Calculate cropping bounds
    const { imageBounds, accumulatedPan, imageScaleFactor, cropSize } = editorState;
    const croppingBounds = {
      originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
      originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
      width: Math.round(cropSize.width * imageScaleFactor),
      height: Math.round(cropSize.height * imageScaleFactor)
    };
    // Set the editor state to processing and perform the crop
    setEditorState({...editorState, processing: true});
    await ImageManipulator.manipulateAsync(props.imageData.uri as string, [
      { crop: croppingBounds }
    ])
    .then(({uri}) => {
      setEditorState({...editorState, processing: false});
      props.onEditingComplete({uri});
      props.onCloseEditor();
    })
    .catch((error) => {
      // If there's an error dismiss the the editor and alert the user
      setEditorState({...editorState, processing: false});
      props.onCloseEditor();
      Alert.alert('An error occurred while editing.');
    });
  }

  React.useEffect(() => {
    // Reset the state of things and only render the UI
    // when this state has been initialised
    if (!props.visible) {
      setEditorState({...initialState, ready: false});
    }
    else {
      setEditorState({...initialState, ready: true});
    }
  }, [props.visible]);

  return(
    <PlatformModal visible={props.visible}
           transparent>
      <StatusBar hidden />
        { 
          editorState.ready ? 
            <View style={styles.container}>
              <ControlBar onPressBack={() => props.onCloseEditor()}
                          onPerformCrop={() => onPerformCrop()} />
              <EditingWindow imageData={props.imageData}
                              fixedCropAspectRatio={1/props.fixedCropAspectRatio}
                              imageBounds={editorState.imageBounds}
                              onUpdateImageBounds={bounds => setEditorState({...editorState, ...bounds})}
                              accumulatedPan={editorState.accumulatedPan}
                              onUpdateAccumulatedPan={accumulatedPan => setEditorState({...editorState, accumulatedPan: accumulatedPan})}
                              cropSize={editorState.cropSize}
                              onUpdateCropSize={size => setEditorState({...editorState, cropSize: size})} />
            </View>
          : null 
        }
        {
          editorState.processing ? 
            <Processing />
          : null
        }
    </PlatformModal>
  );

}

export { ImageEditor };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  }
})