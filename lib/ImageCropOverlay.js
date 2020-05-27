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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageCropOverlay = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const horizontalSections = ['top', 'middle', 'bottom'];
const verticalSections = ['left', 'middle', 'right'];
function ImageCropOverlay(props) {
    const [selectedFrameSection, setSelectedFrameSection] = React.useState('middlemiddle');
    const [panResponderEnabled, setPanResponderEnabled] = React.useState(false);
    const { imageBounds, fixedAspectRatio, accumulatedPan, cropSize } = props;
    const pan = React.useRef(new react_native_1.Animated.ValueXY({
        x: imageBounds.x,
        y: imageBounds.y
    })).current;
    const panInstance = react_native_1.PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => onOverlayMoveGrant(e, gestureState),
        onPanResponderMove: (e, gestureState) => onOverlayMove(e, gestureState),
        onPanResponderRelease: (e, gestureState) => onOverlayRelease(gestureState),
        onPanResponderTerminationRequest: () => false
    });
    const [panResponder, setPanResponder] = React.useState(panInstance);
    React.useEffect(() => {
        // https://stackoverflow.com/questions/61014169/react-natives-panresponder-has-stale-value-from-usestate
        setPanResponder(panInstance);
    }, [cropSize, accumulatedPan, selectedFrameSection]);
    React.useEffect(() => {
        // Reset the accumulated pan
        checkCropBounds({ dx: 0.0, dy: 0.0 });
    }, [cropSize]);
    React.useEffect(() => {
        let newSize = { width: 0, height: 0 };
        const { width, height } = imageBounds;
        const imageAspectRatio = height / width;
        // Then check if the cropping aspect ratio is smaller
        if (fixedAspectRatio < imageAspectRatio) {
            // If so calculate the size so its not greater than the image width
            newSize.width = width;
            newSize.height = width * fixedAspectRatio;
        }
        else {
            // else, calculate the size so its not greater than the image height
            newSize.width = height / fixedAspectRatio;
            newSize.height = height;
        }
        // Set the size of the crop overlay
        props.onUpdateCropSize(newSize);
    }, [imageBounds]);
    const isMovingSection = () => {
        return (selectedFrameSection == 'topmiddle' ||
            selectedFrameSection == 'middleleft' ||
            selectedFrameSection == 'middleright' ||
            selectedFrameSection == 'middlemiddle' ||
            selectedFrameSection == 'bottommiddle');
    };
    const onOverlayMoveGrant = (e, gestureState) => {
        // TODO - Check if the action is to move or resize based on the
        // selected frame section
        pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
        });
    };
    const onOverlayMove = (e, gestureState) => {
        // TODO - Check if the action is to move or resize based on the
        // selected frame section
        react_native_1.Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ])(e, gestureState);
    };
    const onOverlayRelease = (gestureState) => {
        // TODO - Check if the action is to move or resize based on the
        // selected frame section
        // Flatten the offset to reduce erratic behaviour
        pan.flattenOffset();
        // Ensure the cropping overlay has not been moved outside of the allowed bounds
        checkCropBounds(gestureState);
        // Disable the pan responder so the section tile can be pressed
        setPanResponderEnabled(false);
    };
    const checkCropBounds = ({ dx, dy }) => {
        // Check if the pan in the x direction exceeds the bounds
        let accDx = accumulatedPan.x + dx;
        // Is the new x pos less than zero?
        if (accDx <= imageBounds.x) {
            // Then set it to be zero and set the pan to zero too
            accDx = imageBounds.x;
            pan.x.setValue(imageBounds.x);
        }
        // Is the new x pos plus crop width going to exceed the right hand bound
        else if ((accDx + cropSize.width) > (imageBounds.width + imageBounds.x)) {
            // Then set the x pos so the crop frame touches the right hand edge
            let limitedXPos = imageBounds.x + imageBounds.width - cropSize.width;
            accDx = limitedXPos;
            pan.x.setValue(limitedXPos);
        }
        else {
            // It's somewhere in between - no formatting required
        }
        // Check if the pan in the y direction exceeds the bounds
        let accDy = accumulatedPan.y + dy;
        // Is the new y pos less the top edge?
        if (accDy <= imageBounds.y) {
            // Then set it to be zero and set the pan to zero too
            accDy = imageBounds.y;
            pan.y.setValue(imageBounds.y);
        }
        // Is the new y pos plus crop height going to exceed the bottom bound
        else if ((accDy + cropSize.height) > (imageBounds.height + imageBounds.y)) {
            // Then set the y pos so the crop frame touches the bottom edge
            let limitedYPos = imageBounds.y + imageBounds.height - cropSize.height;
            accDy = limitedYPos;
            pan.y.setValue(limitedYPos);
        }
        else {
            // It's somewhere in between - no formatting required
        }
        // Record the accumulated pan
        props.onUpdateAccumulatedPan({ x: accDx, y: accDy });
    };
    const panProps = panResponderEnabled ? Object.assign({}, panResponder.panHandlers) : {};
    return (<react_native_1.View style={styles.container} {...panProps}>
      
      <react_native_1.TouchableWithoutFeedback onPress={() => { }} disabled>
        <react_native_1.Animated.View style={[
        styles.overlay,
        cropSize,
        { transform: [
                { translateX: pan.x },
                { translateY: pan.y }
            ] }
    ]}>
            {
    // For reendering out each section of the crop overlay frame
    horizontalSections.map((hsection) => {
        return (<react_native_1.View style={styles.sectionRow} key={hsection}>
                    {verticalSections.map((vsection) => {
            const key = hsection + vsection;
            return (<react_native_1.TouchableOpacity style={[
                styles.defaultSection
            ]} key={key} onPressIn={() => __awaiter(this, void 0, void 0, function* () {
                setSelectedFrameSection(hsection + vsection);
                // No good way to asynchronously enabled the pan responder
                // after tile selection so using a timeout for now...
                setTimeout(() => {
                    setPanResponderEnabled(true);
                }, 30);
            })} activeOpacity={1.0}>
                            {
            // Add the corner markers to the topleft, 
            // topright, bottomleft and bottomright corners to indicate resizing
            key == 'topleft' ||
                key == 'topright' ||
                key == 'bottomleft' ||
                key == 'bottomright' ?
                <react_native_1.View style={[
                    styles.cornerMarker,
                    hsection == 'top' ?
                        { top: -4, borderTopWidth: 7 }
                        :
                            { bottom: -4, borderBottomWidth: 7 },
                    vsection == 'left' ?
                        { left: -4, borderLeftWidth: 7 }
                        :
                            { right: -4, borderRightWidth: 7 },
                ]}/>
                : null}
                          </react_native_1.TouchableOpacity>);
        })}
                  </react_native_1.View>);
    })}
        </react_native_1.Animated.View>
      </react_native_1.TouchableWithoutFeedback>
    </react_native_1.View>);
}
exports.ImageCropOverlay = ImageCropOverlay;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    overlay: {
        height: 40,
        width: 40,
        backgroundColor: '#33333355',
        borderColor: '#ffffff88',
        borderWidth: 1
    },
    sectionRow: {
        flexDirection: 'row',
        flex: 1
    },
    defaultSection: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#ffffff88',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cornerMarker: {
        position: 'absolute',
        borderColor: '#ffffff',
        height: 30,
        width: 30
    }
});
//# sourceMappingURL=ImageCropOverlay.js.map