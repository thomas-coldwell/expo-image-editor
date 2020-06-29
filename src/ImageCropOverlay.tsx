import * as React from 'react';
import { 
  Animated, 
  PanResponder, 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  PanResponderGestureState, 
  TouchableOpacity } from 'react-native';
import _ from 'lodash';

const horizontalSections = ['top', 'middle', 'bottom'];
const verticalSections = ['left', 'middle', 'right'];

interface ImageCropOverlayProps {
  imageBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  fixedAspectRatio: number;
  accumulatedPan: {
    x: number;
    y: number;
  };
  minimumCropDimensions: {
    width: number;
    height: number;
  };
  onUpdateAccumulatedPan: (accumulatedPan: any) => void;
  cropSize: {
    width: number;
    height: number;
  };
  onUpdateCropSize: (size: any) => void;
  onUpdatePanAndSize: ({size, accumulatedPan}: { size: any, accumulatedPan: any}) => void;
}

function ImageCropOverlay(props: ImageCropOverlayProps) {

  const [selectedFrameSection, setSelectedFrameSection] = React.useState('middlemiddle');

  const [animatedCropSize] = React.useState({
    width: new Animated.Value(props.cropSize.width),
    height: new Animated.Value(props.cropSize.height)
  });

  const [panResponderEnabled, setPanResponderEnabled] = React.useState(false);

  const { 
    imageBounds, 
    fixedAspectRatio, 
    accumulatedPan, 
    cropSize,
    minimumCropDimensions
  } = props;

  const pan = React.useRef(new Animated.ValueXY({
    x: imageBounds.x,
    y: imageBounds.y
  })).current;

  const panInstance = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => onOverlayMoveGrant(e, gestureState),
    onPanResponderMove: (e, gestureState) => onOverlayMove(e, gestureState),
    onPanResponderRelease: (e, gestureState) => onOverlayRelease(gestureState),
    onPanResponderTerminationRequest: () => false
  });

  const [panResponder, setPanResponder] = React.useState(panInstance);

  React.useEffect(() => {
    console.log('Use effect update: ', accumulatedPan)
    // https://stackoverflow.com/questions/61014169/react-natives-panresponder-has-stale-value-from-usestate
    setPanResponder(panInstance);
  }, [cropSize, accumulatedPan, selectedFrameSection]);

  React.useEffect(() => {
    // Reset the accumulated pan
    // checkCropBounds({dx: 0.0, dy: 0.0});
    checkCropBounds({dx: pan.x._value - accumulatedPan.x, dy: pan.y._value - accumulatedPan.y})
    // When the crop size updates make sure the animated value does too!
    animatedCropSize.height.setValue(cropSize.height);
    animatedCropSize.width.setValue(cropSize.width);
  }, [cropSize])

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
    return (
      selectedFrameSection == 'topmiddle' ||
      selectedFrameSection == 'middleleft' ||
      selectedFrameSection == 'middleright' ||
      selectedFrameSection == 'middlemiddle' ||
      selectedFrameSection == 'bottommiddle'
    );
  }

  const onOverlayMoveGrant = (e: any, gestureState: PanResponderGestureState) => {
    // TODO - Check if the action is to move or resize based on the
    // selected frame section
    if (isMovingSection()) {
      pan.setOffset({
        x: accumulatedPan.x,
        y: accumulatedPan.y
      });
    }
    else {
      // Do nothing
      // pan.x.setValue(accumulatedPan.x);
      // pan.y.setValue(accumulatedPan.y)
    }
  }

  const onOverlayMove = (e: any, gestureState: PanResponderGestureState) => {
    // TODO - Check if the action is to move or resize based on the
    // selected frame section
    if (isMovingSection()) {
      Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ]
      )(e, gestureState);
    }
    else {
      // Else its a scaling operation
      const { dx, dy } = gestureState;
      // Get the new target height / width
      let newWidth = cropSize.width;
      let newHeight = cropSize.height;
      // Check what resizing / translation needs to be performed based on which section was pressed
      if (selectedFrameSection == 'bottomright') {
        if (dx < dy) {
          newWidth += dx;
          newHeight = fixedAspectRatio ? newWidth * fixedAspectRatio : newHeight;
        }
        else {
          newHeight += dy;
          newWidth = fixedAspectRatio ? newHeight / fixedAspectRatio : newWidth;
        }
      }
      else if (selectedFrameSection == 'topright') {
        if (dx < dy) {
          newWidth += dx;
          newHeight = fixedAspectRatio ? newWidth * fixedAspectRatio : newHeight;
        }
        else {
          newHeight -= dy;
          newWidth = fixedAspectRatio ? newHeight / fixedAspectRatio : newWidth;
        }
        pan.y.setValue(accumulatedPan.y + (cropSize.height - newHeight));
      }
      console.log('Accumulated pan: ', accumulatedPan.y)
      console.log('Pan value: ', accumulatedPan.y + (cropSize.height - newHeight))
      // Finally set the new height and width ready for checking if valid in onRelease
      animatedCropSize.width.setValue(newWidth);
      animatedCropSize.height.setValue(newHeight);
    }
  }

  const onOverlayRelease = (gestureState: PanResponderGestureState) => {
    // TODO - Check if the action is to move or resize based on the
    // selected frame section

    if (isMovingSection()) {
      // Flatten the offset to reduce erratic behaviour
      pan.flattenOffset();
      // Ensure the cropping overlay has not been moved outside of the allowed bounds
      checkCropBounds(gestureState);
    }
    else {
      // Else its a scaling op
      checkResizeBounds(gestureState);
      //
    }
    // Disable the pan responder so the section tile can be pressed
    setPanResponderEnabled(false);
  }

  const checkCropBounds = ({dx, dy}: PanResponderGestureState | { dx: number, dy: number }) => {
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
    props.onUpdateAccumulatedPan({x: accDx, y: accDy});
  }

  const checkResizeBounds = ({dx, dy}: PanResponderGestureState | { dx: number, dy: number }) => {
    const { width: maxWidth, height: maxHeight } = imageBounds;
    const { width: minWidth, height: minHeight } = minimumCropDimensions
    const animatedWidth = animatedCropSize.width._value;
    const animatedHeight = animatedCropSize.height._value;
    const finalSize = {
      width: animatedWidth,
      height: animatedHeight
    };

    // Ensure the width / height does not exceed the boundaries - 
    // resize to the max it can be if so
    if (animatedHeight > maxHeight) {
      finalSize.height = maxHeight;
      finalSize.width = fixedAspectRatio ? finalSize.height / fixedAspectRatio : finalSize.width;
    }
    else if (animatedHeight < minHeight) {
      finalSize.height = minHeight;
      finalSize.width = fixedAspectRatio ? finalSize.height / fixedAspectRatio : finalSize.height;
    }
    if (animatedWidth > maxWidth) {
      finalSize.width = maxWidth;
      finalSize.height = fixedAspectRatio ? finalSize.width * fixedAspectRatio : finalSize.width;
    }
    else if (animatedWidth < minWidth) {
      finalSize.width = minWidth;
      finalSize.height = fixedAspectRatio ? finalSize.width * fixedAspectRatio : finalSize.width;
    }

    props.onUpdatePanAndSize({
      size: finalSize,
      accumulatedPan: {
        x: pan.x._value,
        y: pan.y._value
      }
    });
  }

  const panProps = panResponderEnabled ? {...panResponder.panHandlers} : {}

  return(
    <View style={styles.container}
          {...panProps}>
      {/* https://github.com/facebook/react-native/issues/14295#issuecomment-374012339 */}
      <TouchableWithoutFeedback onPress={() => {}}
                                disabled>
        <Animated.View style={[
                        styles.overlay, 
                        animatedCropSize,
                        {transform: [
                          {translateX: pan.x}, 
                          {translateY: pan.y}
                        ]}
                       ]}>
            {
              // For reendering out each section of the crop overlay frame
              horizontalSections.map((hsection) => {
                return (
                  <View style={styles.sectionRow}
                        key={hsection}>
                    {
                      verticalSections.map((vsection) => {
                        const key = hsection + vsection;
                        return (
                          <TouchableOpacity style={[
                                              styles.defaultSection
                                            ]}
                                            key={key}
                                            onPressIn={ async () => {
                                              setSelectedFrameSection(key);
                                              // No good way to asynchronously enable the pan responder
                                              // after tile selection so using a timeout for now...
                                              setTimeout(() => {
                                                setPanResponderEnabled(true);
                                              }, 30);
                                            }}
                                            activeOpacity={1.0}>
                            { 
                              // Add the corner markers to the topleft, 
                              // topright, bottomleft and bottomright corners to indicate resizing
                              key == 'topleft' ||
                              key == 'topright' ||
                              key == 'bottomleft' ||
                              key == 'bottomright' ? 
                                <View style={[
                                        styles.cornerMarker,
                                        hsection == 'top' ?
                                          { top: -4, borderTopWidth: 7 }
                                        : 
                                          { bottom: -4, borderBottomWidth: 7 },
                                        vsection == 'left' ?
                                          { left: -4, borderLeftWidth: 7 }
                                        : 
                                          { right: -4, borderRightWidth: 7 },
                                      ]} />
                              : null
                            }
                          </TouchableOpacity>
                        );
                      })
                    }
                  </View>
                );
              })
            }
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );

}

export { ImageCropOverlay };

const styles = StyleSheet.create({
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
})