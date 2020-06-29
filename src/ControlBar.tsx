import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity ,
  Text
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';

type Mode = 'operation-select' | 'crop';

interface ControlBarProps {
  onPressBack: () => void;
  onPerformCrop: () => void;
  mode: Mode;
  onChangeMode: (mode: Mode) => void;
  onRotate: (angle: number) => void;
}

function ControlBar(props: ControlBarProps) {

  return(
    <View style={styles.container}>
      <Button iconID='md-arrow-back'
              source='ion'
              onPress={() => props.onPressBack()} />
      {
        props.mode == 'operation-select' ?
          <View style={styles.buttonRow}>
            <Button iconID='crop'
                    source='md'
                    onPress={() => props.onChangeMode('crop')} />
            <Button iconID='rotate-left'
                    source='md'
                    onPress={() => props.onRotate(-90)} />
            <Button iconID='rotate-right'
                    source='md'
                    onPress={() => {}} />
          </View>
        :
          <Button iconID='md-checkmark'
                  source='ion'
                  onPress={() => props.onPerformCrop()} />
      }
    </View>
  );

}

export { ControlBar };

interface ControlBarButtonProps {
  onPress: () => void;
  iconID: string;
  source: 'ion' | 'md';
}

function Button(props: ControlBarButtonProps) {
  return (
    <TouchableOpacity style={styles.button}
                      onPress={() => props.onPress()}>
      {
        props.source == 'ion' ?
          <Ionicons name={props.iconID} size={32} color='#fff' />
        :
          <MaterialIcons name={props.iconID} size={32} color='#fff' />
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonRow: {
    flexShrink: 1,
    flexDirection: 'row'
  }
});