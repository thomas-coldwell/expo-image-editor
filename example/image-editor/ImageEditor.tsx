import React from 'react';
import { Modal, StyleSheet, View, StatusBar } from 'react-native';
import { ControlBar } from './ControlBar';
import { EditingWindow } from './EditingWindow';
import { ImageCropOverlay } from './ImageCropOverlay';
import { EditorStateProvider, useEditorState } from './EditorStore';

interface ImageEditorProps {
  visible: boolean;
  onCloseEditor: () => void;
  uri: string | undefined;
  fixedCropAspectRatio: number;
}

function ImageEditor(props: ImageEditorProps) {

  return(
    <Modal visible={props.visible}
           transparent>
      <EditorStateProvider>
        <StatusBar hidden />
        <View style={styles.container}>
          <ControlBar onPressBack={() => props.onCloseEditor()}
                      fixedCropAspectRatio={props.fixedCropAspectRatio} />
          <EditingWindow uri={props.uri}
                         fixedCropAspectRatio={props.fixedCropAspectRatio} />
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