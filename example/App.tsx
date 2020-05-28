// import * as React from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View,
//   Button,
//   Image,
//   Alert
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { ImageEditor } from 'expo-image-editor';

// export default function App() {

//   const [imageData, setImageData] = React.useState({
//     uri: undefined,
//     width: 0, 
//     height: 0
//   });
//   const [editorVisible, setEditorVisible] = React.useState(false);

//   const [croppedUri, setCroppedUri] = React.useState<string | undefined>(undefined);

//   const selectPhoto = async () => {
//     // Get the permission to access the camera roll
//     await ImagePicker.requestCameraRollPermissionsAsync().then(async (response) => {
//       // If they said yes then launch the image picker
//       if (response.granted) {
//         await ImagePicker.launchImageLibraryAsync().then(async (pickerResult) => {
//           // Check they didn't cancel the picking
//           if (!pickerResult.cancelled) {
//             // Check whether it is indeed portrait or landscape
//             let landscape = true;
//             await Image.getSize(
//               pickerResult.uri,
//               (width: number, height: number) => {
//                 if (height > width) {
//                   landscape = false;
//                 }
//               },
//               (error: any) => console.log(error)
//             ); 
//             // Then set the image uri
//             setImageData({
//               uri: pickerResult.uri,
//               width: landscape ? pickerResult.width : pickerResult.height,
//               height: landscape ? pickerResult.height : pickerResult.width
//             });
//             // And set the image editor to be visible
//             setEditorVisible(true);
//           }
//         });
//       }
//       else {
//         // If not then alert the user they need to enable it
//         Alert.alert('Please enable camera roll permissions for this app in your settings.')
//       }
//     });
//   }

//   return (
//     <View style={styles.container}>
//       <Image style={styles.image} 
//              source={{uri: imageData.uri}} />
//       <Image style={[styles.image, {backgroundColor: '#333'}]} 
//              source={{uri: croppedUri}} />
//       <Button title='Select Photo' 
//               onPress={() => selectPhoto()}/>
//       <ImageEditor visible={editorVisible}
//                    onCloseEditor={() => setEditorVisible(false)}
//                    imageData={imageData}
//                    fixedCropAspectRatio={16/9}
//                    onEditingComplete={result => setCroppedUri(result.uri)} />
//     </View>
//   );

// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   image: {
//     width: '90%',
//     height: 250,
//     resizeMode: 'contain',
//     backgroundColor: '#ccc',
//     marginBottom: '5%'
//   }
// });

import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { ImageEditor } from 'expo-image-editor';


export default function App() {

  const [visible, setVisible] = React.useState(false);

  const [imageData, setImageData] = React.useState({
    uri: undefined,
    width: 0, 
    height: 0
  });

  return (
    <View style={styles.container}>
      <View style={{height: 40, width: '90%', backgroundColor: '#ff0'}} />
      <Button title='show Modal' onPress={() => setVisible(true)} />
      <ImageEditor visible={visible}
                   onCloseEditor={() => setVisible(false)}
                   imageData={imageData}
                   fixedCropAspectRatio={16/9}
                   onEditingComplete={result => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

