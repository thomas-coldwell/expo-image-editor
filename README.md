# 🌁 Expo Image Editor

A super simple image cropping and rotation tool for Expo that runs on iOS, Android and Web!

| ![Screenshot_20201013-161416](https://user-images.githubusercontent.com/31568400/95880744-c0ac9980-0d6f-11eb-8610-73d291f1013b.jpg) | ![Screenshot_20201013-161447](https://user-images.githubusercontent.com/31568400/95880752-c2765d00-0d6f-11eb-8345-ca7420fabf9b.jpg) | ![Screenshot_20201013-161347](https://user-images.githubusercontent.com/31568400/95880755-c30ef380-0d6f-11eb-9567-4eaf188a18d6.jpg) |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |

Check out the demo on Netlify <a href="https://expo-image-cropping.netlify.app/">here</a>

## Installation

To get started install the package in your Expo project by running:

```
yarn add expo-image-editor
```

or

```
npm i expo-image-editor
```

## Usage

The package exports a single component `ImageEditor` that can be placed anywhere in your project. This renders a modal that then returns the editing result when it is dismissed.

```typescript
// ...
import { ImageEditor } from "expo-image-editor";

function App() {
  const [imageUri, setImageUri] = useState(undefined);

  const [editorVisible, setEditorVisible] = useState(false);

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

  const launchEditor = (uri: string) => {
    // Then set the image uri
    setImageUri(uri);
    // And set the image editor to be visible
    setEditorVisible(true);
  };

  return (
    <View>
      <Image
        style={{ height: 300, width: 300 }}
        source={{ uri: imageData.uri }}
      />
      <Button title="Select Photo" onPress={() => selectPhoto()} />
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={imageUri}
        fixedCropAspectRatio={16 / 9}
        lockAspectRatio={aspectLock}
        minimumCropDimensions={{
          width: 100,
          height: 100,
        }}
        onEditingComplete={(result) => {
          setImageData(result);
        }}
        mode="full"
      />
    </View>
  );
}
```

### Props

| Name                        | Type     | Description                                                                                                                                                                      |
| --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| visible                     | boolean  | Whether the editor should be visible or not.                                                                                                                                     |
| asView                      | boolean  | If `true` this will remove the modal wrapper and return the image editor in a regular `<View />`                                                                                 |
| mode                        | string   | Which mode to use the editor in can be either `full` or `crop-only`.                                                                                                             |
| onCloseEditor               | function | Callback when the editor is dimissed - use this to set hide the editor.                                                                                                          |
| imageUri                    | string   | The uri of the image to be edited                                                                                                                                                |
| fixedCropAspectRatio        | number   | The starting aspect ratio of the cropping window.                                                                                                                                |
| lockAspectRatio             | boolean  | Whether the cropping window should maintain this aspect ratio or not.                                                                                                            |
| minimumCropDimensions       | object   | An object of `{width, height}` specifying the minimum dimensions of the crop window.                                                                                             |
| onEditingComplete           | function | function that will return the result of the image editing which is an object identical to `imageData`                                                                            |
| throttleBlur                | boolean  | Whether to throttle the WebGL update of the blur while adjusting (defaults to false) - useful to set to true on lower performance devices                                        |
| allowedTransformOperations  | string[] | Which transform operations you want to exclusively allow to be used. Can include `crop` and `rotate` e.g. `['crop']` to only allow cropping                                      |
| allowedAdjustmentOperations | string[] | Which image adjustment operations you want to exclusively allow to be used. Only `blur` can be specified at the minute e.g. `['blur']` yo only allow blur as an image adjustment |
