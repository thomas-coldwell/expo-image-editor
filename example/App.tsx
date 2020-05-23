import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageEditor } from './image-editor/ImageEditor';
import { ImageCropOverlay } from './image-editor/ImageCropOverlay';

export default function App() {

  const [uri, setUri] = useState<string | undefined>(undefined);
  const [editorVisible, setEditorVisible] = useState(false);

  const selectPhoto = async () => {
    // Get the permission to access the camera roll
    await ImagePicker.requestCameraRollPermissionsAsync().then(async (response) => {
      // If they said yes then launch the image picker
      if (response.granted) {
        await ImagePicker.launchImageLibraryAsync().then((pickerResult) => {
          // Check they didn't cancel the picking
          if (!pickerResult.cancelled) {
            // Then set the image uri
            setUri(pickerResult.uri);
            // And set the image editor to be visible
            setEditorVisible(true);
          }
        });
      }
      else {
        // If not then alert the user they need to enable it
        Alert.alert('Please enable camera roll permissions for this app in your settings.')
      }
    });
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} 
             source={{uri}} />
      <Button title='Select Photo' 
              onPress={() => selectPhoto()}/>
      <ImageEditor visible={editorVisible}
                   onCloseEditor={() => setEditorVisible(false)}
                   uri={uri} />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: 400,
    resizeMode: 'contain',
    backgroundColor: '#ccc',
    marginBottom: '5%'
  }
});
