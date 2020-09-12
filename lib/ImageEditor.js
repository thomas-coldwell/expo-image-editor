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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
const recoil_1 = require("recoil");
const Store_1 = require("./Store");
const OperationBar_1 = require("./OperationBar");
const noScroll = require("no-scroll");
const PlatformModal = react_native_1.Platform.OS == "web" ? modal_react_native_web_1.default : react_native_1.Modal;
// Stop ARIA errors
if (react_native_1.Platform.OS == "web") {
    PlatformModal.setAppElement("#root");
}
function ImageEditorCore(props) {
    const [imageBounds, setImageBounds] = recoil_1.useRecoilState(Store_1.imageBoundsState);
    const [imageData, setImageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [accumulatedPan, setAccumulatedPan] = recoil_1.useRecoilState(Store_1.accumulatedPanState);
    const [imageScaleFactor] = recoil_1.useRecoilState(Store_1.imageScaleFactorState);
    const [cropSize, setCropSize] = recoil_1.useRecoilState(Store_1.cropSizeState);
    const [ready, setReady] = recoil_1.useRecoilState(Store_1.readyState);
    const [processing, setProcessing] = recoil_1.useRecoilState(Store_1.processingState);
    const [editingMode, setEditingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const [, setFixedCropAspectRatio] = recoil_1.useRecoilState(Store_1.fixedCropAspectRatioState);
    const [, setLockAspectRatio] = recoil_1.useRecoilState(Store_1.lockAspectRatioState);
    const [, setMinimumCropDimensions] = recoil_1.useRecoilState(Store_1.minimumCropDimensionsState);
    // Initialise the image data when it is set through the props
    React.useEffect(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            if (props.imageUri) {
                const enableEditor = () => {
                    setReady(true);
                    // Set no-scroll to on
                    noScroll.on();
                };
                // Platform check
                if (react_native_1.Platform.OS == "web") {
                    var img = document.createElement("img");
                    img.onload = () => {
                        setImageData({
                            uri: props.imageUri,
                            height: img.height,
                            width: img.width,
                        });
                        enableEditor();
                    };
                    img.src = props.imageUri;
                }
                else {
                    const { width: pickerWidth, height: pickerHeight, } = yield ImageManipulator.manipulateAsync(props.imageUri, []);
                    react_native_1.Image.getSize(props.imageUri, (width, height) => {
                        // Image.getSize gets the right ratio, but incorrect magnitude
                        // whereas expo image picker does vice versa 😅...this fixes it.
                        setImageData({
                            uri: props.imageUri,
                            width: width > height ? pickerWidth : pickerHeight,
                            height: width > height ? pickerHeight : pickerWidth,
                        });
                        enableEditor();
                    }, (error) => console.log(error));
                }
            }
        }))();
    }, [props.imageUri]);
    // Initialise / update the editing mode set through props
    React.useEffect(() => {
        setEditingMode(props.mode === "crop-only" ? "crop" : "operation-select");
    }, [props.mode]);
    // Initialise / update the crop AR / AR lock / min crop dims set through props
    React.useEffect(() => {
        setFixedCropAspectRatio(props.fixedCropAspectRatio);
    }, [props.fixedCropAspectRatio]);
    React.useEffect(() => {
        setLockAspectRatio(props.lockAspectRatio);
    }, [props.lockAspectRatio]);
    React.useEffect(() => {
        setMinimumCropDimensions(props.minimumCropDimensions);
    }, [props.minimumCropDimensions]);
    const onPerformCrop = () => __awaiter(this, void 0, void 0, function* () {
        // Calculate cropping bounds
        const croppingBounds = {
            originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
            originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
            width: Math.round(cropSize.width * imageScaleFactor),
            height: Math.round(cropSize.height * imageScaleFactor),
        };
        // Set the editor state to processing and perform the crop
        setProcessing(true);
        yield ImageManipulator.manipulateAsync(imageData.uri, [
            { crop: croppingBounds },
        ])
            .then(({ uri, width, height }) => __awaiter(this, void 0, void 0, function* () {
            // Check if on web - currently there is a weird bug where it will keep
            // the canvas from ImageManipualtor at originX + width and so we'll just crop
            // the result again for now if on web - TODO write github issue!
            if (react_native_1.Platform.OS == "web") {
                yield ImageManipulator.manipulateAsync(uri, [
                    { crop: Object.assign(Object.assign({}, croppingBounds), { originX: 0, originY: 0 }) },
                ])
                    .then(({ uri, width, height }) => {
                    if (props.mode == "crop-only") {
                        setProcessing(false);
                        props.onEditingComplete({ uri, width, height });
                        onCloseEditor();
                    }
                    else {
                        setProcessing(false);
                        setImageData({ uri, width, height });
                        setEditingMode("operation-select");
                    }
                })
                    .catch((error) => {
                    // If there's an error dismiss the the editor and alert the user
                    setProcessing(false);
                    onCloseEditor();
                    react_native_1.Alert.alert("An error occurred while editing.");
                });
            }
            else {
                if (props.mode == "crop-only") {
                    setProcessing(false);
                    props.onEditingComplete({ uri, width, height });
                    onCloseEditor();
                }
                else {
                    setProcessing(false);
                    setImageData({ uri, width, height });
                    setEditingMode("operation-select");
                }
            }
        }))
            .catch((error) => {
            // If there's an error dismiss the the editor and alert the user
            setProcessing(false);
            onCloseEditor();
            react_native_1.Alert.alert("An error occurred while editing.");
        });
    });
    const onRotate = (angle) => __awaiter(this, void 0, void 0, function* () {
        // Rotate the image by the specified angle
        setProcessing(false);
        yield ImageManipulator.manipulateAsync(imageData.uri, [{ rotate: angle }])
            .then(({ uri, width, height }) => __awaiter(this, void 0, void 0, function* () {
            // Set the image data
            setProcessing(false);
            setImageData({ uri, width, height });
        }))
            .catch((error) => {
            alert("An error occured while editing.");
        });
    });
    const onFinishEditing = () => __awaiter(this, void 0, void 0, function* () {
        setProcessing(false);
        props.onEditingComplete(imageData);
        onCloseEditor();
    });
    const onCloseEditor = () => {
        // Set no-scroll to off
        noScroll.off();
        props.onCloseEditor();
    };
    React.useEffect(() => {
        // Reset the state of things and only render the UI
        // when this state has been initialised
        if (!props.visible) {
            setReady(false);
        }
    }, [props.visible]);
    return (<PlatformModal visible={props.visible} transparent animationType="slide">
      <react_native_1.StatusBar hidden/>
      {ready ? (<react_native_1.View style={styles.container}>
          <ControlBar_1.ControlBar onPressBack={() => editingMode == "operation-select"
        ? props.onCloseEditor()
        : setEditingMode("operation-select")} onPerformCrop={() => onPerformCrop()} onRotate={(angle) => onRotate(angle)} onFinishEditing={() => onFinishEditing()} mode={props.mode}/>
          <EditingWindow_1.EditingWindow />
          <OperationBar_1.OperationBar />
        </react_native_1.View>) : null}
      {processing ? <Processing_1.Processing /> : null}
    </PlatformModal>);
}
function ImageEditor(props) {
    return (<recoil_1.RecoilRoot>
      <ImageEditorCore {...props}/>
    </recoil_1.RecoilRoot>);
}
exports.ImageEditor = ImageEditor;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
    },
});
//# sourceMappingURL=ImageEditor.js.map