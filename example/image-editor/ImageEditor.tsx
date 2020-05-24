import React, { useState } from 'react';
import { Modal, StyleSheet, View, StatusBar } from 'react-native';
import { ControlBar } from './ControlBar';
import { EditingWindow } from './EditingWindow';
import { ImageCropOverlay } from './ImageCropOverlay';
import { EditorStateProvider, useEditorState } from './EditorStore';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageEditorProps {
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
  }
}

function ImageEditor(props: ImageEditorProps) {

  const [editorState, setEditorState] = useState<ImageEditorStore>({
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
    }
  })

  const onPerformCrop = async () => {
    // Calculate cropping bounds
    console.log(editorState)
    const { imageBounds, accumulatedPan, imageScaleFactor, cropSize } = editorState;
    const croppingBounds = {
      originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
      originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
      width: Math.round(cropSize.width * imageScaleFactor),
      height: Math.round(cropSize.height * imageScaleFactor)
    };
    await ImageManipulator.manipulateAsync(props.imageData.uri as string, [
      { crop: croppingBounds }
    ]).then(({uri}) => {
      props.onEditingComplete({uri});
      props.onCloseEditor();
    });
  }

  return(
    <Modal visible={props.visible}
           transparent>
      <EditorStateProvider>
        <StatusBar hidden />
        <View style={styles.container}>
          <ControlBar onPressBack={() => props.onCloseEditor()}
                      onPerformCrop={() => onPerformCrop()} />
          <EditingWindow imageData={props.imageData}
                         fixedCropAspectRatio={props.fixedCropAspectRatio}
                         imageBounds={editorState.imageBounds}
                         onUpdateImageBounds={bounds => setEditorState({...editorState, ...bounds})}
                         accumulatedPan={editorState.accumulatedPan}
                         onUpdateAccumulatedPan={accumulatedPan => setEditorState({...editorState, accumulatedPan: accumulatedPan})}
                         cropSize={editorState.cropSize}
                         onUpdateCropSize={size => setEditorState({...editorState, cropSize: size})} />
        </View>
      </EditorStateProvider>
    </Modal>
  );

}

export { ImageEditor };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  }
})