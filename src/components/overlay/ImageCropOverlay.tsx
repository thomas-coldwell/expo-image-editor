import * as React from "react";
import {
    Animated,
    StyleSheet,
} from "react-native";
import {
    PanGestureHandlerGestureEvent,
    State,
} from "react-native-gesture-handler";
import {useRecoilState} from "recoil";
import {useContext} from "react";
import {cropSizeState, imageBoundsState, accumulatedPanState, cropRatioState} from "../../store";
import {EditorContext} from "../../constants";

const horizontalSections = ["top", "middle", "bottom"];
const verticalSections = ["left", "middle", "right"];

export const ImageCropOverlay = () => {
    // Record which section of the fram window has been pressed
    // this determines whether it is a translation or scaling gesture
    const [selectedFrameSection, setSelectedFrameSection] = React.useState("");

    // Shared state and bits passed through recoil to avoid prop drilling
    const [ratio] = useRecoilState(cropRatioState);
    const [cropSize, setCropSize] = useRecoilState(cropSizeState);
    const [imageBounds] = useRecoilState(imageBoundsState);
    const [accumulatedPan, setAccumluatedPan] = useRecoilState(accumulatedPanState);

    // Editor context
    const {lockAspectRatio} = useContext(EditorContext);
    const usedRatio = lockAspectRatio || ratio

    const [animatedCropSize] = React.useState({
        width: new Animated.Value(cropSize.width),
        height: new Animated.Value(cropSize.height),
    });

    // pan X and Y values to track the current delta of the pan
    // in both directions - this should be zeroed out on release
    // and the delta added onto the accumulatedPan state
    const panX = React.useRef(new Animated.Value(imageBounds.x));
    const panY = React.useRef(new Animated.Value(imageBounds.y));

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
        let newSize = {width: 0, height: 0};
        const {width, height} = imageBounds;
        const imageAspectRatio = width / height;

        // TODO: check if === 1.19 or < 0.8 else = 1

        // Then check if the cropping aspect ratio is smaller
        if (usedRatio < imageAspectRatio) {
            // If so calculate the size so its not greater than the image width
            newSize.height = height;
            newSize.width = height * usedRatio;
        } else {
            // else, calculate the size so its not greater than the image height
            newSize.width = width;
            newSize.height = width / usedRatio;
        }
        // Set the size of the crop overlay
        setCropSize(newSize);
    }, [imageBounds, usedRatio]);

    const onOverlayMove = ({nativeEvent}: PanGestureHandlerGestureEvent) => {
        if (selectedFrameSection !== "") {
            Animated.event(
                [
                    {
                        translationX: panX.current,
                        translationY: panY.current,
                    },
                ],
                {useNativeDriver: false}
            )(nativeEvent);
        } else {
            // We need to set which section has been pressed
            const {x, y} = nativeEvent;
            const {width: initialWidth, height: initialHeight} = cropSize;
            let position = "";
            // Figure out where we pressed vertically
            if (y / initialHeight < 0.333) {
                position = position + "top";
            } else if (y / initialHeight < 0.667) {
                position = position + "middle";
            } else {
                position = position + "bottom";
            }
            // Figure out where we pressed horizontally
            if (x / initialWidth < 0.333) {
                position = position + "left";
            } else if (x / initialWidth < 0.667) {
                position = position + "middle";
            } else {
                position = position + "right";
            }
            setSelectedFrameSection(position);
        }
    };

    const onOverlayRelease = (
        nativeEvent: PanGestureHandlerGestureEvent["nativeEvent"]
    ) => {
        checkCropBounds(nativeEvent)
        // Disable the pan responder so the section tiles can register being pressed again
        setSelectedFrameSection("");
    };

    const onHandlerStateChange = ({
                                      nativeEvent,
                                  }: PanGestureHandlerGestureEvent) => {
        // Handle any state changes from the pan gesture handler
        // only looking at when the touch ends atm
        if (nativeEvent.state === State.END) {
            onOverlayRelease(nativeEvent);
        }
    };

    const checkCropBounds = ({
                                 translationX,
                                 translationY,
                             }:
                                 | PanGestureHandlerGestureEvent["nativeEvent"]
                                 | { translationX: number; translationY: number }) => {
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
        } else {
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
        } else {
            // It's somewhere in between - no formatting required
        }
        // Record the accumulated pan and reset the pan refs to zero
        panX.current.setValue(0);
        panY.current.setValue(0);
        setAccumluatedPan({x: accDx, y: accDy});
    };

    return (
        <Animated.View style={[ animatedCropSize, { backgroundColor: 'yellow' } ]}>

        </Animated.View>
    );
};

const styles = StyleSheet.create({

});
