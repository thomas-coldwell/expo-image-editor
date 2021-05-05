import * as React from "react";
import { StyleSheet, View, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "../src/ImageEditor";

export default function App() {
  //
  const [imageUri, setImageUri] = React.useState<undefined | string>(undefined);
  const [editorVisible, setEditorVisible] = React.useState(false);

  const [croppedUri, setCroppedUri] = React.useState<string | undefined>(
    undefined
  );

  const [aspectLock, setAspectLock] = React.useState(false);

  const selectPhoto = async () => {
    // Get the permission to access the camera roll
    const response = await ImagePicker.requestCameraRollPermissionsAsync();
    // If they said yes then launch the image picker
    if (response.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      // Check they didn't cancel the picking
      if (!pickerResult.cancelled) {
        launchEditor(pickerResult.uri);
      }
    } else {
      // If not then alert the user they need to enable it
      Alert.alert(
        "Please enable camera roll permissions for this app in your settings."
      );
    }
  };

  const launchEditor = (uri: any) => {
    // Then set the image uri
    setImageUri(uri);
    // And set the image editor to be visible
    setEditorVisible(true);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUri }} />
      <Image
        style={[styles.image, { backgroundColor: "#333" }]}
        source={{ uri: croppedUri }}
      />
      <View style={styles.buttonRow}>
        <Button title="Select Photo" onPress={() => selectPhoto()} />
        <Button
          title={"Aspect Lock: " + aspectLock}
          onPress={() => setAspectLock(!aspectLock)}
        />
      </View>
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={imageUri}
        fixedCropAspectRatio={1.6}
        lockAspectRatio={aspectLock}
        minimumCropDimensions={{
          width: 100,
          height: 100,
        }}
        onEditingComplete={(result) => {
          setCroppedUri(result.uri);
          console.log(result);
        }}
        throttleBlur={false}
        customLabels={{
          back: 'Voltar',
          done: 'Pronto',
          transform: 'Transformar',
          crop: 'Cortar',
          rotate: 'Rodar',
          adjust: 'Ajustar',
          blur: 'Borrar',
          cancel: 'Cancelar',
          blurRadius: 'Taxa do Borrão',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: 250,
    resizeMode: "contain",
    backgroundColor: "#ccc",
    marginBottom: "5%",
  },
  buttonRow: {
    width: "100%",
    height: 150,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
