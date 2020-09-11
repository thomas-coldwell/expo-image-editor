import * as React from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PanResponderGestureState,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
import { useRecoilState } from "recoil";
import {
  cropSizeState,
  imageBoundsState,
  accumulatedPanState,
  fixedCropAspectRatioState,
  lockAspectRatioState,
  minimumCropDimensionsState,
} from "./Store";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";

const horizontalSections = ["top", "middle", "bottom"];
const verticalSections = ["left", "middle", "right"];

function ImageCropOverlay() {
  //
  const [selectedFrameSection, setSelectedFrameSection] = React.useState(
    "middlemiddle"
  );

  const [cropSize, setCropSize] = useRecoilState(cropSizeState);
  const [imageBounds] = useRecoilState(imageBoundsState);
  const [accumulatedPan, setAccumluatedPan] = useRecoilState(
    accumulatedPanState
  );

  const [animatedCropSize] = React.useState({
    width: new Animated.Value(cropSize.width),
    height: new Animated.Value(cropSize.height),
  });

  const [panResponderEnabled, setPanResponderEnabled] = React.useState(false);

  const [fixedAspectRatio] = useRecoilState(fixedCropAspectRatioState);
  const [lockAspectRatio] = useRecoilState(lockAspectRatioState);
  const [minimumCropDimensions] = useRecoilState(minimumCropDimensionsState);

  const panX = React.useRef(new Animated.Value(imageBounds.x));
  const panY = React.useRef(new Animated.Value(imageBounds.y));

  React.useEffect(() => {
    checkCropBounds({
      translationX: 0,
      translationY: 0,
    });
    // When the crop size updates make sure the animated value does too!
    animatedCropSize.height.setValue(cropSize.height);
    animatedCropSize.width.setValue(cropSize.width);
  }, [cropSize]);

  React.useEffect(() => {
    let newSize = { width: 0, height: 0 };
    const { width, height } = imageBounds;
    const imageAspectRatio = width / height;
    // Then check if the cropping aspect ratio is smaller
    if (fixedAspectRatio < imageAspectRatio) {
      // If so calculate the size so its not greater than the image width
      newSize.height = height;
      newSize.width = height * fixedAspectRatio;
    } else {
      // else, calculate the size so its not greater than the image height
      newSize.width = width;
      newSize.height = width / fixedAspectRatio;
    }
    // Set the size of the crop overlay
    setCropSize(newSize);
  }, [imageBounds]);

  const isMovingSection = () => {
    return (
      selectedFrameSection == "topmiddle" ||
      selectedFrameSection == "middleleft" ||
      selectedFrameSection == "middleright" ||
      selectedFrameSection == "middlemiddle" ||
      selectedFrameSection == "bottommiddle"
    );
  };

  const onOverlayMove = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    // TODO - Check if the action is to move or resize based on the
    // selected frame section
    console.log(nativeEvent);
    if (isMovingSection()) {
      Animated.event([
        {
          translationX: panX.current,
          translationY: panY.current,
        },
      ])(nativeEvent);
    } else {
      // Else its a scaling operation
      const { translationX, translationY } = nativeEvent;
      // Get the new target height / width
      let newWidth = cropSize.width;
      let newHeight = cropSize.height;
      // Check what resizing / translation needs to be performed based on which section was pressed
      if (selectedFrameSection == "bottomright") {
        if (translationX < translationY) {
          newWidth += translationX;
          lockAspectRatio
            ? (newHeight = newWidth / fixedAspectRatio)
            : (newHeight += translationY);
        } else {
          newHeight += translationY;
          lockAspectRatio
            ? (newWidth = newHeight * fixedAspectRatio)
            : (newWidth += translationX);
        }
      } else if (selectedFrameSection == "topright") {
        if (translationX < translationY) {
          newWidth += translationX;
          lockAspectRatio
            ? (newHeight = newWidth / fixedAspectRatio)
            : (newHeight -= translationY);
        } else {
          newHeight -= translationY;
          lockAspectRatio
            ? (newWidth = newHeight * fixedAspectRatio)
            : (newWidth += translationX);
        }
        panY.current.setValue(cropSize.height - newHeight);
      } else if (selectedFrameSection == "bottomleft") {
        if (translationX < translationY) {
          newWidth -= translationX;
          lockAspectRatio
            ? (newHeight = newWidth / fixedAspectRatio)
            : (newHeight += translationY);
        } else {
          newHeight += translationY;
          lockAspectRatio
            ? (newWidth = newHeight * fixedAspectRatio)
            : (newWidth -= translationX);
        }
        panX.current.setValue(cropSize.width - newWidth);
      } else if (selectedFrameSection == "topleft") {
        if (translationX < translationY) {
          newWidth -= translationX;
          lockAspectRatio
            ? (newHeight = newWidth / fixedAspectRatio)
            : (newHeight -= translationY);
        } else {
          newHeight -= translationY;
          lockAspectRatio
            ? (newWidth = newHeight * fixedAspectRatio)
            : (newWidth -= translationX);
        }
        panX.current.setValue(cropSize.width - newWidth);
        panY.current.setValue(cropSize.height - newHeight);
      }
      // Finally set the new height and width ready for checking if valid in onRelease
      animatedCropSize.width.setValue(newWidth);
      animatedCropSize.height.setValue(newHeight);
    }
  };

  const onOverlayRelease = (
    nativeEvent: PanGestureHandlerGestureEvent["nativeEvent"]
  ) => {
    // TODO - Check if the action is to move or resize based on the
    // selected frame section
    if (isMovingSection()) {
      // Ensure the cropping overlay has not been moved outside of the allowed bounds
      //checkCropBounds(nativeEvent);
    } else {
      // Else its a scaling op
      checkResizeBounds(nativeEvent);
      //
    }
    // Disable the pan responder so the section tile can be pressed
    setPanResponderEnabled(false);
  };

  const onHandlerStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
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
      panX.current.setValue(0);
    }
    // Is the new x pos plus crop width going to exceed the right hand bound
    else if (accDx + cropSize.width > imageBounds.width + imageBounds.x) {
      // Then set the x pos so the crop frame touches the right hand edge
      let limitedXPos = imageBounds.x + imageBounds.width - cropSize.width;
      accDx = limitedXPos;
      panX.current.setValue(0);
    } else {
      // It's somewhere in between - no formatting required
    }

    // Check if the pan in the y direction exceeds the bounds
    let accDy = accumulatedPan.y + translationY;
    // Is the new y pos less the top edge?
    if (accDy <= imageBounds.y) {
      // Then set it to be zero and set the pan to zero too
      accDy = imageBounds.y;
      panY.current.setValue(0);
    }
    // Is the new y pos plus crop height going to exceed the bottom bound
    else if (accDy + cropSize.height > imageBounds.height + imageBounds.y) {
      // Then set the y pos so the crop frame touches the bottom edge
      let limitedYPos = imageBounds.y + imageBounds.height - cropSize.height;
      accDy = limitedYPos;
      panY.current.setValue(0);
    } else {
      // It's somewhere in between - no formatting required
    }
    // Record the accumulated pan
    setAccumluatedPan({ x: accDx, y: accDy });
  };

  const checkResizeBounds = ({
    translationX,
    translationY,
  }:
    | PanGestureHandlerGestureEvent["nativeEvent"]
    | { translationX: number; translationY: number }) => {
    const { width: maxWidth, height: maxHeight } = imageBounds;
    const { width: minWidth, height: minHeight } = minimumCropDimensions;
    const animatedWidth = animatedCropSize.width._value;
    const animatedHeight = animatedCropSize.height._value;
    const finalSize = {
      width: animatedWidth,
      height: animatedHeight,
    };

    // Ensure the width / height does not exceed the boundaries -
    // resize to the max it can be if so
    if (animatedHeight > maxHeight) {
      finalSize.height = maxHeight;
      finalSize.width = lockAspectRatio
        ? finalSize.height * fixedAspectRatio
        : finalSize.width;
    } else if (animatedHeight < minHeight) {
      finalSize.height = minHeight;
      finalSize.width = lockAspectRatio
        ? finalSize.height * fixedAspectRatio
        : finalSize.width;
    }
    if (animatedWidth > maxWidth) {
      finalSize.width = maxWidth;
      finalSize.height = lockAspectRatio
        ? finalSize.width / fixedAspectRatio
        : finalSize.height;
    } else if (animatedWidth < minWidth) {
      finalSize.width = minWidth;
      finalSize.height = lockAspectRatio
        ? finalSize.width / fixedAspectRatio
        : finalSize.height;
    }
    // Update together else one gets replaced with stale state
    setAccumluatedPan({
      x: accumulatedPan.x + panX.current._value,
      y: accumulatedPan.y + panY.current._value,
    });
    panX.current.setValue(0);
    panY.current.setValue(0);
    setCropSize(finalSize);
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        enabled={panResponderEnabled}
        onGestureEvent={onOverlayMove}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.overlay,
            animatedCropSize,
            {
              transform: [
                { translateX: Animated.add(panX.current, accumulatedPan.x) },
                { translateY: Animated.add(panY.current, accumulatedPan.y) },
              ],
            },
          ]}
        >
          {
            // For reendering out each section of the crop overlay frame
            horizontalSections.map((hsection) => {
              return (
                <View style={styles.sectionRow} key={hsection}>
                  {verticalSections.map((vsection) => {
                    const key = hsection + vsection;
                    return (
                      <TouchableOpacity
                        style={[styles.defaultSection]}
                        key={key}
                        onPressIn={async () => {
                          setSelectedFrameSection(key);
                          // No good way to asynchronously enable the pan responder
                          // after tile selection so using a timeout for now...
                          setTimeout(() => {
                            setPanResponderEnabled(true);
                          }, 30);
                        }}
                        activeOpacity={1.0}
                      >
                        {
                          // Add the corner markers to the topleft,
                          // topright, bottomleft and bottomright corners to indicate resizing
                          key == "topleft" ||
                          key == "topright" ||
                          key == "bottomleft" ||
                          key == "bottomright" ? (
                            <View
                              style={[
                                styles.cornerMarker,
                                hsection == "top"
                                  ? { top: -4, borderTopWidth: 7 }
                                  : { bottom: -4, borderBottomWidth: 7 },
                                vsection == "left"
                                  ? { left: -4, borderLeftWidth: 7 }
                                  : { right: -4, borderRightWidth: 7 },
                              ]}
                            />
                          ) : null
                        }
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })
          }
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

export { ImageCropOverlay };

const styles = StyleSheet.create({
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
