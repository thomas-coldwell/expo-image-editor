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
exports.EditingWindow = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const ImageCropOverlay_1 = require("./ImageCropOverlay");
const recoil_1 = require("recoil");
const Store_1 = require("./Store");
const expo_gl_1 = require("expo-gl");
function EditingWindow() {
    //
    const [state, setState] = React.useState({
        imageScaleFactor: null,
        imageLayout: {
            height: null,
            width: null,
        },
    });
    const [imageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [, setImageBounds] = recoil_1.useRecoilState(Store_1.imageBoundsState);
    const [, setImageScaleFactor] = recoil_1.useRecoilState(Store_1.imageScaleFactorState);
    const [editingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const [, setGLContext] = recoil_1.useRecoilState(Store_1.glContextState);
    // Get some readable boolean states
    const isCropping = editingMode === "crop";
    const isBlurring = editingMode === "blur";
    const usesGL = isBlurring;
    const getImageFrame = (layout) => {
        onUpdateCropLayout(layout);
    };
    const onUpdateCropLayout = (layout) => {
        // Check layout is not null
        if (layout.height != null && layout.width != null) {
            // Find the start point of the photo on the screen and its
            // width / height from there
            const editingWindowAspectRatio = layout.height / layout.width;
            //
            const imageAspectRatio = imageData.height / imageData.width;
            let bounds = { x: 0, y: 0, width: 0, height: 0 };
            let imageScaleFactor = 1;
            // Check which is larger
            if (imageAspectRatio > editingWindowAspectRatio) {
                // Then x is non-zero, y is zero; calculate x...
                bounds.x =
                    (((imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio) *
                        layout.width) /
                        2;
                bounds.width = layout.height / imageAspectRatio;
                bounds.height = layout.height;
                imageScaleFactor = imageData.height / layout.height;
            }
            else {
                // Then y is non-zero, x is zero; calculate y...
                bounds.y =
                    (((1 / imageAspectRatio - 1 / editingWindowAspectRatio) /
                        (1 / imageAspectRatio)) *
                        layout.height) /
                        2;
                bounds.width = layout.width;
                bounds.height = layout.width * imageAspectRatio;
                imageScaleFactor = imageData.width / layout.width;
            }
            setImageBounds(bounds);
            setImageScaleFactor(imageScaleFactor);
            setState(Object.assign(Object.assign({}, state), { imageScaleFactor, imageLayout: {
                    height: layout.height,
                    width: layout.width,
                } }));
        }
    };
    const getGLLayout = () => {
        const { height: windowHeight, width: windowWidth } = state.imageLayout;
        const windowAspectRatio = windowWidth / windowHeight;
        const { height: imageHeight, width: imageWidth } = imageData;
        const imageAspectRatio = imageWidth / imageHeight;
        // If the window is taller than img...
        if (windowAspectRatio < imageAspectRatio) {
            return { width: windowWidth, height: windowWidth / imageAspectRatio };
        }
        else {
            return { height: windowHeight, width: windowHeight * imageAspectRatio };
        }
    };
    React.useEffect(() => {
        onUpdateCropLayout(state.imageLayout);
    }, [imageData]);
    const onGLContextCreate = (gl) => __awaiter(this, void 0, void 0, function* () {
        setGLContext(gl);
    });
    return (<react_native_1.View style={styles.container}>
      {usesGL ? (<react_native_1.View style={styles.glContainer}>
          <expo_gl_1.GLView style={[
        {
            height: 1,
            width: 1,
            backgroundColor: "#ccc",
            transform: [{ scaleY: -1 }],
        },
        getGLLayout(),
    ]} onContextCreate={onGLContextCreate}/>
        </react_native_1.View>) : (<react_native_1.Image style={styles.image} source={{ uri: imageData.uri }} onLayout={({ nativeEvent }) => getImageFrame(nativeEvent.layout)}/>)}
      {isCropping && state.imageLayout.height != null ? (<ImageCropOverlay_1.ImageCropOverlay />) : null}
    </react_native_1.View>);
}
exports.EditingWindow = EditingWindow;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "contain",
    },
    glContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
//# sourceMappingURL=EditingWindow.js.map