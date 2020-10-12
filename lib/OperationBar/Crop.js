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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crop = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const IconButton_1 = require("../components/IconButton");
const Store_1 = require("../Store");
const ImageManipulator = __importStar(require("expo-image-manipulator"));
function Crop() {
    const [accumulatedPan] = recoil_1.useRecoilState(Store_1.accumulatedPanState);
    const [imageBounds] = recoil_1.useRecoilState(Store_1.imageBoundsState);
    const [imageScaleFactor] = recoil_1.useRecoilState(Store_1.imageScaleFactorState);
    const [cropSize] = recoil_1.useRecoilState(Store_1.cropSizeState);
    const [, setProcessing] = recoil_1.useRecoilState(Store_1.processingState);
    const [imageData, setImageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [, setEditingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
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
        const cropResult = yield ImageManipulator.manipulateAsync(imageData.uri, [
            { crop: croppingBounds },
        ]);
        // Check if on web - currently there is a weird bug where it will keep
        // the canvas from ImageManipualtor at originX + width and so we'll just crop
        // the result again for now if on web - TODO write github issue!
        if (react_native_1.Platform.OS == "web") {
            const webCorrection = yield ImageManipulator.manipulateAsync(cropResult.uri, [{ crop: Object.assign(Object.assign({}, croppingBounds), { originX: 0, originY: 0 }) }]);
            const { uri, width, height } = webCorrection;
            setImageData({ uri, width, height });
        }
        else {
            const { uri, width, height } = cropResult;
            setImageData({ uri, width, height });
        }
        setProcessing(false);
        setEditingMode("operation-select");
    });
    return (<react_native_1.View style={styles.container}>
      <IconButton_1.IconButton iconID="close" text="Cancel" onPress={() => setEditingMode("operation-select")}/>
      <react_native_1.Text style={styles.prompt}>Adjust window to crop</react_native_1.Text>
      <IconButton_1.IconButton iconID="check" text="Done" onPress={() => onPerformCrop().catch(() => {
        // If there's an error dismiss the the editor and alert the user
        setProcessing(false);
        react_native_1.Alert.alert("An error occurred while editing.");
    })}/>
    </react_native_1.View>);
}
exports.Crop = Crop;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "2%",
    },
    prompt: {
        color: "#fff",
        fontSize: 24,
        textAlign: "center",
    },
});
//# sourceMappingURL=Crop.js.map