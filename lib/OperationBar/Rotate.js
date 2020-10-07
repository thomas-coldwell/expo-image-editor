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
exports.Rotate = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const IconButton_1 = require("../components/IconButton");
const Store_1 = require("../Store");
const ImageManipulator = __importStar(require("expo-image-manipulator"));
function Rotate() {
    //
    const [, setProcessing] = recoil_1.useRecoilState(Store_1.processingState);
    const [imageData, setImageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [, setEditingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const originalImageData = React.useRef(imageData).current;
    console.log(imageData);
    const [rotation, setRotation] = React.useState(0);
    React.useEffect(() => {
        if (rotation !== 0) {
            onRotate(rotation);
        }
        else {
            setImageData(originalImageData);
        }
    }, [rotation]);
    const onRotate = (angle) => __awaiter(this, void 0, void 0, function* () {
        // Rotate the image by the specified angle
        // To get rid of thing white line caused by context its being painted onto
        // crop 1 px border off https://github.com/expo/expo/issues/7325
        const { uri: rotateUri, width: rotateWidth, height: rotateHeight, } = yield ImageManipulator.manipulateAsync(originalImageData.uri, [
            { rotate: angle },
        ]);
        const { uri, width, height } = yield ImageManipulator.manipulateAsync(rotateUri, [
            {
                crop: {
                    originX: 1,
                    originY: 1,
                    width: rotateWidth - 2,
                    height: rotateHeight - 2,
                },
            },
        ]);
        setImageData({ uri, width, height });
    });
    const onClose = () => {
        // If closing reset the image back to its original
        setImageData(originalImageData);
        setEditingMode("operation-select");
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[styles.row, { paddingHorizontal: 200 }]}>
        <IconButton_1.IconButton iconID="rotate-left" text="Rotate -90" onPress={() => setRotation(rotation - 90)}/>
        <IconButton_1.IconButton iconID="rotate-right" text="Rotate +90" onPress={() => setRotation(rotation + 90)}/>
      </react_native_1.View>
      <react_native_1.View style={styles.row}>
        <IconButton_1.IconButton iconID="close" text="Cancel" onPress={() => onClose()}/>
        <react_native_1.Text style={styles.prompt}>Rotate</react_native_1.Text>
        <IconButton_1.IconButton iconID="check" text="Done" onPress={() => setEditingMode("operation-select")}/>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.Rotate = Rotate;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    prompt: {
        color: "#fff",
        fontSize: 24,
        textAlign: "center",
    },
    row: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
    },
});
//# sourceMappingURL=Rotate.js.map