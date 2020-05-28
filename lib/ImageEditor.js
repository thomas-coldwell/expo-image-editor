"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageEditor = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const ControlBar_1 = require("./ControlBar");
const EditingWindow_1 = require("./EditingWindow");
const ImageManipulator = __importStar(require("expo-image-manipulator"));
const Processing_1 = require("./Processing");
const modal_react_native_web_1 = __importDefault(require("modal-react-native-web"));
const PlatformModal = react_native_1.Platform.OS == 'web' ? modal_react_native_web_1.default : react_native_1.Modal;
function ImageEditor(props) {
    const initialState = {
        imageScaleFactor: 1,
        imageBounds: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        accumulatedPan: {
            x: 0.0,
            y: 0.0
        },
        cropSize: {
            width: 0,
            height: 0
        },
        ready: false,
        processing: false
    };
    const [editorState, setEditorState] = React.useState(initialState);
    const onPerformCrop = () => __awaiter(this, void 0, void 0, function* () {
        // Calculate cropping bounds
        const { imageBounds, accumulatedPan, imageScaleFactor, cropSize } = editorState;
        const croppingBounds = {
            originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
            originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
            width: Math.round(cropSize.width * imageScaleFactor),
            height: Math.round(cropSize.height * imageScaleFactor)
        };
        // Set the editor state to processing and perform the crop
        setEditorState(Object.assign(Object.assign({}, editorState), { processing: true }));
        yield ImageManipulator.manipulateAsync(props.imageData.uri, [
            { crop: croppingBounds }
        ])
            .then(({ uri }) => {
            setEditorState(Object.assign(Object.assign({}, editorState), { processing: false }));
            props.onEditingComplete({ uri });
            props.onCloseEditor();
        })
            .catch((error) => {
            // If there's an error dismiss the the editor and alert the user
            setEditorState(Object.assign(Object.assign({}, editorState), { processing: false }));
            props.onCloseEditor();
            react_native_1.Alert.alert('An error occurred while editing.');
        });
    });
    React.useEffect(() => {
        // Reset the state of things and only render the UI
        // when this state has been initialised
        if (!props.visible) {
            setEditorState(Object.assign(Object.assign({}, initialState), { ready: false }));
        }
        else {
            setEditorState(Object.assign(Object.assign({}, initialState), { ready: true }));
        }
    }, [props.visible]);
    return (<PlatformModal visible={props.visible} transparent>
      <react_native_1.StatusBar hidden/>
        {editorState.ready ?
        <react_native_1.View style={styles.container}>
              <ControlBar_1.ControlBar onPressBack={() => props.onCloseEditor()} onPerformCrop={() => onPerformCrop()}/>
              <EditingWindow_1.EditingWindow imageData={props.imageData} fixedCropAspectRatio={1 / props.fixedCropAspectRatio} imageBounds={editorState.imageBounds} onUpdateImageBounds={bounds => setEditorState(Object.assign(Object.assign({}, editorState), bounds))} accumulatedPan={editorState.accumulatedPan} onUpdateAccumulatedPan={accumulatedPan => setEditorState(Object.assign(Object.assign({}, editorState), { accumulatedPan: accumulatedPan }))} cropSize={editorState.cropSize} onUpdateCropSize={size => setEditorState(Object.assign(Object.assign({}, editorState), { cropSize: size }))}/>
            </react_native_1.View>
        : null}
        {editorState.processing ?
        <Processing_1.Processing />
        : null}
    </PlatformModal>);
}
exports.ImageEditor = ImageEditor;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222'
    }
});
//# sourceMappingURL=ImageEditor.js.map