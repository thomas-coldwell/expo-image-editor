"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const ImagePicker = __importStar(require("expo-image-picker"));
const ImageEditor_1 = require("./image-editor/ImageEditor");
function App() {
    const [imageData, setImageData] = react_1.useState({
        uri: undefined,
        width: 0,
        height: 0
    });
    const [editorVisible, setEditorVisible] = react_1.useState(false);
    const [croppedUri, setCroppedUri] = react_1.useState(undefined);
    const selectPhoto = () => __awaiter(this, void 0, void 0, function* () {
        // Get the permission to access the camera roll
        yield ImagePicker.requestCameraRollPermissionsAsync().then((response) => __awaiter(this, void 0, void 0, function* () {
            // If they said yes then launch the image picker
            if (response.granted) {
                yield ImagePicker.launchImageLibraryAsync().then((pickerResult) => __awaiter(this, void 0, void 0, function* () {
                    // Check they didn't cancel the picking
                    if (!pickerResult.cancelled) {
                        // Check whether it is indeed portrait or landscape
                        let landscape = true;
                        yield react_native_1.Image.getSize(pickerResult.uri, (width, height) => {
                            if (height > width) {
                                landscape = false;
                            }
                        }, (error) => console.log(error));
                        // Then set the image uri
                        setImageData({
                            uri: pickerResult.uri,
                            width: landscape ? pickerResult.width : pickerResult.height,
                            height: landscape ? pickerResult.height : pickerResult.width
                        });
                        // And set the image editor to be visible
                        setEditorVisible(true);
                    }
                }));
            }
            else {
                // If not then alert the user they need to enable it
                react_native_1.Alert.alert('Please enable camera roll permissions for this app in your settings.');
            }
        }));
    });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Image style={styles.image} source={{ uri: imageData.uri }}/>
      <react_native_1.Image style={[styles.image, { backgroundColor: '#333' }]} source={{ uri: croppedUri }}/>
      <react_native_1.Button title='Select Photo' onPress={() => selectPhoto()}/>
      <ImageEditor_1.ImageEditor visible={editorVisible} onCloseEditor={() => setEditorVisible(false)} imageData={imageData} fixedCropAspectRatio={16 / 9} onEditingComplete={result => setCroppedUri(result.uri)}/>
    </react_native_1.View>);
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
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
//# sourceMappingURL=App.js.map