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
import { ImageEditor } from 'expo-image-editor';

export default function App() {

  const [imageData, setImageData] = useState({
    uri: undefined,
    width: 0, 
    height: 0
  });
  const [editorVisible, setEditorVisible] = useState(false);

  const [croppedUri, setCroppedUri] = useState<string | undefined>(undefined);

  const selectPhoto = async () => {
    // Get the permission to access the camera roll
    await ImagePicker.requestCameraRollPermissionsAsync().then(async (response) => {
      // If they said yes then launch the image picker
      if (response.granted) {
        await ImagePicker.launchImageLibraryAsync().then(async (pickerResult) => {
          // Check they didn't cancel the picking
          if (!pickerResult.cancelled) {
            // Check whether it is indeed portrait or landscape
            let landscape = true;
            await Image.getSize(
              pickerResult.uri,
              (width: number, height: number) => {
                if (height > width) {
                  landscape = false;
                }
              },
              (error: any) => console.log(error)
            ); 
            // Then set the image uri
            setImageData({
              uri: pickerResult.uri,
              width: landscape ? pickerResult.width : pickerResult.height,
              height: landscape ? pickerResult.height : pickerResult.width
            });
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
      {/* <Image style={styles.image} 
             source={{uri: imageData.uri}} />
      <Image style={[styles.image, {backgroundColor: '#333'}]} 
             source={{uri: croppedUri}} /> */}
      <Button title='Select Photo' 
              onPress={() => selectPhoto()}/>
      <ImageEditor visible={editorVisible}
                   onCloseEditor={() => setEditorVisible(false)}
                   imageData={imageData}
                   fixedCropAspectRatio={16/9}
                   onEditingComplete={result => setCroppedUri(result.uri)} />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: 250,
    resizeMode: 'contain',
    backgroundColor: '#ccc',
    marginBottom: '5%'
  }
});
