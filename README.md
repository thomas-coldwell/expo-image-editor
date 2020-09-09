# 🌁 Expo Image Editor

[![NPM](https://nodei.co/npm/<package>.png?compact=true)](https://npmjs.org/package/expo-image-editor)

A super simple image cropping and rotation tool for Expo that runs on iOS, Android and Web!

|                                                               iOS & Android                                                                |                                                                    Web                                                                     |
| :----------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
| ![Screenshot 2020-07-11 at 14 03 57](https://user-images.githubusercontent.com/31568400/87224753-af727c00-c37f-11ea-8f87-157d19b6111e.png) | ![Screenshot 2020-07-11 at 14 03 41](https://user-images.githubusercontent.com/31568400/87224756-b3060300-c37f-11ea-97d5-625ff2a791cb.png) |

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
        mode="crop-only"
      />
    </View>
  );
}
```

### Props

| Name                  | Type     | Description                                                                                           |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| visible               | boolean  | Whether the editor should be visible or not.                                                          |
| onCloseEditor         | function | Callback when the editor is dimissed - use this to set hide the editor.                               |
| imageUri              | string   | The uri of the image to be edited                                                                     |
| fixedCropAspectRatio  | number   | The starting aspect ratio of the cropping window.                                                     |
| lockAspectRatio       | boolean  | Whether the cropping window should maintain this aspect ratio or not.                                 |
| minimumCropDimensions | object   | An object of `{width, height}` specifying the minimum dimensions of the crop window.                  |
| onEditingComplete     | function | function that will return the result of the image editing which is an object identical to `imageData` |
| mode                  | string   | The mode the image editor can be used in - one of `full`, `crop-only` or `rotate-only`                |

## Acknowledgements

- Inspiration from <a href="https://github.com/brunon80/expo-image-crop">this</a> repo
