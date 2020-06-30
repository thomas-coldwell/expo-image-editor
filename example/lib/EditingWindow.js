"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const ImageCropOverlay_1 = require("./ImageCropOverlay");
function EditingWindow(props) {
    const [state, setState] = React.useState({
        initialisedImageBounds: false,
        imageScaleFactor: null,
        imageLayout: {
            height: null,
            width: null
        }
    });
    const { imageData } = props;
    const getImageFrame = (layout) => {
        onUpdateCropLayout(layout);
    };
    const onUpdateCropLayout = (layout) => {
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
            bounds.x = (((imageAspectRatio - editingWindowAspectRatio) / (imageAspectRatio)) * layout.width) / 2;
            bounds.width = layout.height / imageAspectRatio;
            bounds.height = layout.height;
            imageScaleFactor = imageData.height / layout.height;
        }
        else {
            // Then y is non-zero, x is zero; calculate y...
            bounds.y = ((1 / imageAspectRatio - 1 / editingWindowAspectRatio) / (1 / imageAspectRatio)) * layout.height / 2;
            bounds.width = layout.width;
            bounds.height = layout.width * imageAspectRatio;
            imageScaleFactor = imageData.width / layout.width;
        }
        props.onUpdateImageBounds({
            imageBounds: bounds,
            imageScaleFactor
        });
        setState(Object.assign(Object.assign({}, state), { initialisedImageBounds: true, imageScaleFactor, imageLayout: {
                height: layout.height,
                width: layout.width
            } }));
    };
    React.useEffect(() => {
        onUpdateCropLayout(state.imageLayout);
    }, [props.imageData]);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Image style={styles.image} source={{ uri: imageData.uri }} onLayout={({ nativeEvent }) => getImageFrame(nativeEvent.layout)}/>
      {state.initialisedImageBounds && props.isCropping ?
        <ImageCropOverlay_1.ImageCropOverlay imageBounds={props.imageBounds} fixedAspectRatio={props.fixedCropAspectRatio} lockAspectRatio={props.lockAspectRatio} accumulatedPan={props.accumulatedPan} minimumCropDimensions={props.minimumCropDimensions} onUpdateAccumulatedPan={accumulatedPan => props.onUpdateAccumulatedPan(accumulatedPan)} cropSize={props.cropSize} onUpdateCropSize={size => props.onUpdateCropSize(size)} onUpdatePanAndSize={panAndSize => props.onUpdatePanAndSize(panAndSize)}/>
        :
            null}
    </react_native_1.View>);
}
exports.EditingWindow = EditingWindow;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: 'contain'
    }
});
//# sourceMappingURL=EditingWindow.js.map