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
exports.ImageCropOverlay = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const Store_1 = require("./Store");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const horizontalSections = ["top", "middle", "bottom"];
const verticalSections = ["left", "middle", "right"];
function ImageCropOverlay() {
    // Record which section of the fram window has been pressed
    // this determines whether it is a translation or scaling gesture
    const [selectedFrameSection, setSelectedFrameSection] = React.useState("");
    // Shared state and bits passed through recoil to avoid prop drilling
    const [cropSize, setCropSize] = recoil_1.useRecoilState(Store_1.cropSizeState);
    const [imageBounds] = recoil_1.useRecoilState(Store_1.imageBoundsState);
    const [accumulatedPan, setAccumluatedPan] = recoil_1.useRecoilState(Store_1.accumulatedPanState);
    const [fixedAspectRatio] = recoil_1.useRecoilState(Store_1.fixedCropAspectRatioState);
    const [lockAspectRatio] = recoil_1.useRecoilState(Store_1.lockAspectRatioState);
    const [minimumCropDimensions] = recoil_1.useRecoilState(Store_1.minimumCropDimensionsState);
    const [animatedCropSize] = React.useState({
        width: new react_native_1.Animated.Value(cropSize.width),
        height: new react_native_1.Animated.Value(cropSize.height),
    });
    // pan X and Y values to track the current delta of the pan
    // in both directions - this should be zeroed out on release
    // and the delta added onto the accumulatedPan state
    const panX = React.useRef(new react_native_1.Animated.Value(imageBounds.x));
    const panY = React.useRef(new react_native_1.Animated.Value(imageBounds.y));
    React.useEffect(() => {
        // Move the pan to the origin and check the bounds so it clicks to
        // the corner of the image
        checkCropBounds({
            translationX: 0,
            translationY: 0,
        });
        // When the crop size updates make sure the animated value does too!
        animatedCropSize.height.setValue(cropSize.height);
        animatedCropSize.width.setValue(cropSize.width);
    }, [cropSize]);
    React.useEffect(() => {
        // Update the size of the crop window based on the new image bounds
        let newSize = { width: 0, height: 0 };
        const { width, height } = imageBounds;
        const imageAspectRatio = width / height;
        // Then check if the cropping aspect ratio is smaller
        if (fixedAspectRatio < imageAspectRatio) {
            // If so calculate the size so its not greater than the image width
            newSize.height = height;
            newSize.width = height * fixedAspectRatio;
        }
        else {
            // else, calculate the size so its not greater than the image height
            newSize.width = width;
            newSize.height = width / fixedAspectRatio;
        }
        // Set the size of the crop overlay
        setCropSize(newSize);
    }, [imageBounds]);
    // Function that sets which sections allow for translation when
    // pressed
    const isMovingSection = () => {
        return (selectedFrameSection == "topmiddle" ||
            selectedFrameSection == "middleleft" ||
            selectedFrameSection == "middleright" ||
            selectedFrameSection == "middlemiddle" ||
            selectedFrameSection == "bottommiddle");
    };
    // Check what resizing / translation needs to be performed based on which section was pressed
    const isLeft = selectedFrameSection.endsWith("left");
    const isTop = selectedFrameSection.startsWith("top");
    const onOverlayMove = ({ nativeEvent }) => {
        if (selectedFrameSection !== "") {
            // Check if the section pressed is one to translate the crop window or not
            if (isMovingSection()) {
                // If it is then use an animated event to directly pass the tranlation
                // to the pan refs
                react_native_1.Animated.event([
                    {
                        translationX: panX.current,
                        translationY: panY.current,
                    },
                ])(nativeEvent);
            }
            else {
                // Else its a scaling operation
                const { x, y } = getTargetCropFrameBounds(nativeEvent);
                if (isTop) {
                    panY.current.setValue(-y);
                }
                if (isLeft) {
                    panX.current.setValue(-x);
                }
                // Finally update the animated width to the values the crop
                // window has been resized to
                animatedCropSize.width.setValue(cropSize.width + x);
                animatedCropSize.height.setValue(cropSize.height + y);
            }
        }
    };
    const getTargetCropFrameBounds = ({ translationX, translationY, }) => {
        let x = 0;
        let y = 0;
        if (translationX < translationY) {
            x = (isLeft ? -1 : 1) * translationX;
            if (lockAspectRatio) {
                y = x / fixedAspectRatio;
            }
            else {
                y = (isTop ? -1 : 1) * translationY;
            }
        }
        else {
            y = (isTop ? -1 : 1) * translationY;
            if (lockAspectRatio) {
                x = y * fixedAspectRatio;
            }
            else {
                x = (isLeft ? -1 : 1) * translationX;
            }
        }
        return { x, y };
    };
    const onOverlayRelease = (nativeEvent) => {
        // Check if the section pressed is one to translate the crop window or not
        if (isMovingSection()) {
            // Ensure the cropping overlay has not been moved outside of the allowed bounds
            checkCropBounds(nativeEvent);
        }
        else {
            // Else its a scaling op - check that the resizing didnt take it out of bounds
            checkResizeBounds(nativeEvent);
        }
        // Disable the pan responder so the section tiles can register being pressed again
        setSelectedFrameSection("");
    };
    const onHandlerStateChange = ({ nativeEvent, }) => {
        // Handle any state changes from the pan gesture handler
        // only looking at when the touch ends atm
        if (nativeEvent.state === react_native_gesture_handler_1.State.END) {
            onOverlayRelease(nativeEvent);
        }
    };
    const checkCropBounds = ({ translationX, translationY, }) => {
        // Check if the pan in the x direction exceeds the bounds
        let accDx = accumulatedPan.x + translationX;
        // Is the new x pos less than zero?
        if (accDx <= imageBounds.x) {
            // Then set it to be zero and set the pan to zero too
            accDx = imageBounds.x;
        }
        // Is the new x pos plus crop width going to exceed the right hand bound
        else if (accDx + cropSize.width > imageBounds.width + imageBounds.x) {
            // Then set the x pos so the crop frame touches the right hand edge
            let limitedXPos = imageBounds.x + imageBounds.width - cropSize.width;
            accDx = limitedXPos;
        }
        else {
            // It's somewhere in between - no formatting required
        }
        // Check if the pan in the y direction exceeds the bounds
        let accDy = accumulatedPan.y + translationY;
        // Is the new y pos less the top edge?
        if (accDy <= imageBounds.y) {
            // Then set it to be zero and set the pan to zero too
            accDy = imageBounds.y;
        }
        // Is the new y pos plus crop height going to exceed the bottom bound
        else if (accDy + cropSize.height > imageBounds.height + imageBounds.y) {
            // Then set the y pos so the crop frame touches the bottom edge
            let limitedYPos = imageBounds.y + imageBounds.height - cropSize.height;
            accDy = limitedYPos;
        }
        else {
            // It's somewhere in between - no formatting required
        }
        // Record the accumulated pan and reset the pan refs to zero
        panX.current.setValue(0);
        panY.current.setValue(0);
        setAccumluatedPan({ x: accDx, y: accDy });
    };
    const checkResizeBounds = ({ translationX, translationY, }) => {
        // Check we haven't gone out of bounds when resizing - allow it to be
        // resized up to the appropriate bounds if so
        const { width: maxWidth, height: maxHeight } = imageBounds;
        const { width: minWidth, height: minHeight } = minimumCropDimensions;
        const { x, y } = getTargetCropFrameBounds({ translationX, translationY });
        const animatedWidth = cropSize.width + x;
        const animatedHeight = cropSize.height + y;
        let finalHeight = animatedHeight;
        let finalWidth = animatedWidth;
        // Ensure the width / height does not exceed the boundaries -
        // resize to the max it can be if so
        if (animatedHeight > maxHeight) {
            finalHeight = maxHeight;
            if (lockAspectRatio)
                finalWidth = finalHeight * fixedAspectRatio;
        }
        else if (animatedHeight < minHeight) {
            finalHeight = minHeight;
            if (lockAspectRatio)
                finalWidth = finalHeight * fixedAspectRatio;
        }
        if (animatedWidth > maxWidth) {
            finalWidth = maxWidth;
            if (lockAspectRatio)
                finalHeight = finalWidth / fixedAspectRatio;
        }
        else if (animatedWidth < minWidth) {
            finalWidth = minWidth;
            if (lockAspectRatio)
                finalHeight = finalWidth / fixedAspectRatio;
        }
        // Update the accumulated pan with the delta from the pan refs
        setAccumluatedPan({
            x: accumulatedPan.x + (isLeft ? -x : 0),
            y: accumulatedPan.y + (isTop ? -y : 0),
        });
        // Zero out the pan refs
        panX.current.setValue(0);
        panY.current.setValue(0);
        // Update the crop size to the size after resizing
        setCropSize({
            height: finalHeight,
            width: finalWidth,
        });
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_gesture_handler_1.PanGestureHandler enabled={true} onGestureEvent={onOverlayMove} onHandlerStateChange={onHandlerStateChange}>
        <react_native_1.Animated.View style={[
        styles.overlay,
        animatedCropSize,
        {
            transform: [
                { translateX: react_native_1.Animated.add(panX.current, accumulatedPan.x) },
                { translateY: react_native_1.Animated.add(panY.current, accumulatedPan.y) },
            ],
        },
    ]}>
          {
    // For reendering out each section of the crop overlay frame
    horizontalSections.map((hsection) => {
        return (<react_native_1.View style={styles.sectionRow} key={hsection}>
                  {verticalSections.map((vsection) => {
            const key = hsection + vsection;
            return (<react_native_1.TouchableOpacity style={[styles.defaultSection]} key={key} onPressIn={() => __awaiter(this, void 0, void 0, function* () {
                setSelectedFrameSection(key);
            })} activeOpacity={1.0}>
                        {
            // Add the corner markers to the topleft,
            // topright, bottomleft and bottomright corners to indicate resizing
            key == "topleft" ||
                key == "topright" ||
                key == "bottomleft" ||
                key == "bottomright" ? (<react_native_1.View style={[
                styles.cornerMarker,
                hsection == "top"
                    ? { top: -4, borderTopWidth: 7 }
                    : { bottom: -4, borderBottomWidth: 7 },
                vsection == "left"
                    ? { left: -4, borderLeftWidth: 7 }
                    : { right: -4, borderRightWidth: 7 },
            ]}/>) : null}
                      </react_native_1.TouchableOpacity>);
        })}
                </react_native_1.View>);
    })}
        </react_native_1.Animated.View>
      </react_native_gesture_handler_1.PanGestureHandler>
    </react_native_1.View>);
}
exports.ImageCropOverlay = ImageCropOverlay;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        position: "absolute",
    },
    overlay: {
        height: 40,
        width: 40,
        backgroundColor: "#33333355",
        borderColor: "#ffffff88",
        borderWidth: 1,
    },
    sectionRow: {
        flexDirection: "row",
        flex: 1,
    },
    defaultSection: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: "#ffffff88",
        justifyContent: "center",
        alignItems: "center",
    },
    cornerMarker: {
        position: "absolute",
        borderColor: "#ffffff",
        height: 30,
        width: 30,
    },
});
//# sourceMappingURL=ImageCropOverlay.js.map