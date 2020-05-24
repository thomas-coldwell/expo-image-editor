import React, { useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity ,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEditorState } from './EditorStore';
import _ from 'lodash';

interface ControlBarProps {
  onPressBack: () => void;
  onPerformCrop: () => void;
}

function ControlBar(props: ControlBarProps) {

  const [editorState, setEditorState] = useEditorState();

  const onPerformCrop = useCallback(() => {
    // Calculate cropping bounds
    const { cropBounds, accumulatedPan, imageScaleFactor, cropSize } = editorState;
    const croppingBounds = {
      originX: (accumulatedPan.x - cropBounds.x) * imageScaleFactor,
      originY: (accumulatedPan.y - cropBounds.y) * imageScaleFactor,
      width: cropSize.width * imageScaleFactor,
      height: cropSize.height * imageScaleFactor
    };
    console.log(croppingBounds);
  }, [editorState])

  return(
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
                        onPress={() => props.onPressBack()}>
        <Ionicons name='md-arrow-back' size={32} color='#fff' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton}
                        onPress={() => props.onPerformCrop()}>
        <Ionicons name='md-checkmark' size={32} color='#fff' />
      </TouchableOpacity>
    </View>
  );

}

export { ControlBar };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  }
});