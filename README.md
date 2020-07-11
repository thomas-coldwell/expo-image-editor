# 🌁 Expo Image Editor

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
  const [imageData, setImageData] = useState({
    uri: undefined,
    width: 0,
    height: 0,
  });

  const [editorVisible, setEditorVisible] = useState(false);

  const selectPhoto = async () => {
    // Get the permission to access the camera roll
    await ImagePicker.requestCameraRollPermissionsAsync().then(
      async (response) => {
        // If they said yes then launch the image picker
        if (response.granted) {
          await ImagePicker.launchImageLibraryAsync().then(
            async (pickerResult) => {
              // Check they didn't cancel the picking
              if (!pickerResult.cancelled) {
                // Platform check
                if (Platform.OS == "web") {
                  var img = document.createElement("img");
                  img.onload = () => {
                    launchEditor({
                      uri: pickerResult.uri,
                      width: img.width,
                      height: img.height,
                    });
                  };
                  img.src = pickerResult.uri;
                } else {
                  Image.getSize(
                    pickerResult.uri,
                    (width: number, height: number) => {
                      // Image.getSize gets the right ratio, but incorrect magnitude
                      // whereas expo image picker does vice versa 😅...this fixes it.
                      launchEditor({
                        uri: pickerResult.uri,
                        width:
                          width > height
                            ? pickerResult.width
                            : pickerResult.height,
                        height:
                          width > height
                            ? pickerResult.height
                            : pickerResult.width,
                      });
                    },
                    (error: any) => console.log(error)
                  );
                }
              }
            }
          );
        } else {
          // If not then alert the user they need to enable it
          Alert.alert(
            "Please enable camera roll permissions for this app in your settings."
          );
        }
      }
    );
  };

  const launchEditor = ({ uri, width, height }: any) => {
    // Then set the image uri
    setImageData({
      uri: uri,
      width: width,
      height: height,
    });
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
        imageData={imageData}
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
| imageData             | object   | An object of `{uri, width, height}` specifying the image to edit.                                     |
| fixedCropAspectRatio  | number   | The starting aspect ratio of the cropping window.                                                     |
| lockAspectRatio       | boolean  | Whether the cropping window should maintain this aspect ratio or not.                                 |
| minimumCropDimensions | object   | An object of `{width, height}` specifying the minimum dimensions of the crop window.                  |
| onEditingComplete     | function | function that will return the result of the image editing which is an object identical to `imageData` |
| mode                  | string   | The mode the image editor can be used in - one of `full`, `crop-only` or `rotate-only`                |
