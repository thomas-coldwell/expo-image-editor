import React from 'react';
import { Modal, StyleSheet, View, StatusBar } from 'react-native';
import { ControlBar } from './ControlBar';
import { EditingWindow } from './EditingWindow';
import { ImageCropOverlay } from './ImageCropOverlay';

interface ImageEditorProps {
  visible: boolean;
  onCloseEditor: () => void;
  uri: string | undefined;
}

function ImageEditor(props: ImageEditorProps) {
  

  return(
    <Modal visible={props.visible}
           transparent>
      <StatusBar hidden />
      <View style={styles.container}>
        <ControlBar onPressBack={() => props.onCloseEditor()}/>
        <EditingWindow uri={props.uri}/>
      </View>
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