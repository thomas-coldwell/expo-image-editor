import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button,
  Image,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageEditor, Mode } from './lib/ImageEditor';

export default function App() {

  const [imageData, setImageData] = React.useState({
    uri: undefined,
    width: 0, 
    height: 0
  });
  const [editorVisible, setEditorVisible] = React.useState(false);

  const [croppedUri, setCroppedUri] = React.useState<string | undefined>(undefined);

  const [mode, setMode] = React.useState<Mode>('full');

  const [aspectLock, setAspectLock] = React.useState(false);

  const selectPhoto = async () => {
    // Get the permission to access the camera roll
    await ImagePicker.requestCameraRollPermissionsAsync().then(async (response) => {
      // If they said yes then launch the image picker
      if (response.granted) {
        await ImagePicker.launchImageLibraryAsync().then(async (pickerResult) => {
          // Check they didn't cancel the picking
          if (!pickerResult.cancelled) {
            // Platform check
            if (Platform.OS == 'web') {
              var img = document.createElement('img');
              img.onload = () => {
                launchEditor({
                  uri: pickerResult.uri,
                  width: img.width,
                  height: img.height
                });
              }
              img.src = pickerResult.uri;
            }
            else {
              Image.getSize(
                pickerResult.uri,
                (width: number, height: number) => {
                  // Image.getSize gets the right ratio, but incorrect magnitude
                  // whereas expo image picker does vice versa 😅...this fixes it.
                  launchEditor({
                    uri: pickerResult.uri,
                    width: width > height ? pickerResult.width : pickerResult.height,
                    height: width > height ? pickerResult.height : pickerResult.width
                  });
                },
                (error: any) => console.log(error)
              ); 
            }
          }
        });
      }
      else {
        // If not then alert the user they need to enable it
        Alert.alert('Please enable camera roll permissions for this app in your settings.')
      }
    });
  }

  const launchEditor = ({uri, width, height}: any) => {
    // Then set the image uri
    setImageData({
      uri: uri,
      width: width,
      height: height
    });
    // And set the image editor to be visible
    setEditorVisible(true);
  }

  const toggleMode = () => {
    // Chaneg the mode to either full, crop-only or rotate only
    if (mode == 'full') {
      setMode('crop-only');
    }
    else if (mode == 'crop-only') {
      setMode('rotate-only');
    }
    else {
      setMode('full');
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} 
             source={{uri: imageData.uri}} />
      <Image style={[styles.image, {backgroundColor: '#333'}]} 
             source={{uri: croppedUri}} />
      <View style={styles.buttonRow}>
        <Button title='Select Photo' 
                onPress={() => selectPhoto()}/>
        <Button title={'Mode: ' + mode}
                onPress={() => toggleMode()} />
        <Button title={'Aspect Lock: ' + aspectLock}
                onPress={() => setAspectLock(!aspectLock)} />
      </View>
      <ImageEditor visible={editorVisible}
                   onCloseEditor={() => setEditorVisible(false)}
                   imageData={imageData}
                   fixedCropAspectRatio={16/9}
                   lockAspectRatio={aspectLock}
                   minimumCropDimensions={{
                     width: 100,
                     height: 100
                   }}
                   onEditingComplete={result => {
                     setCroppedUri(result.uri);
                     console.log(result)
                   }}
                   mode={mode} />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '90%',
    height: 250,
    resizeMode: 'contain',
    backgroundColor: '#ccc',
    marginBottom: '5%'
  },
  buttonRow: {
    width: '100%',
    height: 150,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});

