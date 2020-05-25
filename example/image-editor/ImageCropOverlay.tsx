import React, { useRef, useState, useEffect } from 'react';
import { 
  Animated, 
  PanResponder, 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  PanResponderGestureState, 
  TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';

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
  onUpdateAccumulatedPan: (accumulatedPan: any) => void;
  cropSize: {
    width: number;
    height: number;
  };
  onUpdateCropSize: (size: any) => void;
}

function ImageCropOverlay(props: ImageCropOverlayProps) {

  const [selectedFrameSection, setSelectedFrameSection] = useState('middlemiddle');

  const [panResponderEnabled, setPanResponderEnabled] = useState(false);

  const { imageBounds, fixedAspectRatio, accumulatedPan, cropSize } = props;

  const pan = useRef(new Animated.ValueXY({
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

  const [panResponder, setPanResponder]  = useState(panInstance);

  useEffect(() => {
    // https://stackoverflow.com/questions/61014169/react-natives-panresponder-has-stale-value-from-usestate
    setPanResponder(panInstance);
  }, [cropSize, accumulatedPan, selectedFrameSection]);

  useEffect(() => {
    // Reset the accumulated pan
    checkCropBounds({dx: 0.0, dy: 0.0});
  }, [cropSize])

  useEffect(() => {
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

  const onOverlayMoveGrant = (e: any, gestureState: PanResponderGestureState) => {
    console.log('Start tile: ' + selectedFrameSection)
    if (selectedFrameSection == 'middlemiddle') {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
    }
  }

  const onOverlayMove = (e: any, gestureState: PanResponderGestureState) => {
    console.log('Move tile: ' + selectedFrameSection)
    // Check if the action is to move or resize based on the
    // selected frame section
    if (selectedFrameSection == 'middlemiddle') {
      Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ]
      )(e, gestureState);
    }
  }

  const onOverlayRelease = (gestureState: PanResponderGestureState) => {
    console.log('Release tile: ' + selectedFrameSection)
    if (selectedFrameSection == 'middlemiddle') {
      // Flatten the offset to reduce erratic behaviour
      pan.flattenOffset();
      // Ensure the cropping overlay has not been moved outside of the allowed bounds
      checkCropBounds(gestureState);
    }
    setPanResponderEnabled(false);
  }

  const checkCropBounds = ({dx, dy}: PanResponderGestureState | { dx: number, dy: number }) => {
    // Check if the pan in the x direction exceeds the bounds
    let accDx = accumulatedPan.x + dx;
    // Is the new x pos less than zero?
    if (accDx <= 0) {
      // Then set it to be zero and set the pan to zero too
      accDx = imageBounds.x;
      pan.x.setValue(imageBounds.x);
    }
    // Is the new x pos plus crop width going to exceed the right hand bound
    else if ((accDx + cropSize.width) > imageBounds.width) {
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
    else if ((accDy + cropSize.height) > imageBounds.height) {
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

  // useEffect(() => {
  //   console.log('selected Frame update')
  //   // if (!panResponderEnabled) {
  //     setPanResponderEnabled(true);
  //   // }
  // }, [selectedFrameSection]);

  console.log(panResponderEnabled)

  const panProps = panResponderEnabled ? {...panResponder.panHandlers} : {}

  return(
    <View style={styles.container}
          {...panProps}>
      {/* https://github.com/facebook/react-native/issues/14295#issuecomment-374012339 */}
      <TouchableWithoutFeedback onPress={() => {}}
                                disabled>
        <Animated.View style={[
                        styles.overlay, 
                        cropSize,
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
                                              setSelectedFrameSection(hsection + vsection);
                                              // No good way to asynchronously enabled the pan responder
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
                            {/* {
                              key == 'middlemiddle' ? 
                                <Ionicons name='ios-move' 
                                          size={20}
                                          color='#ffffff88' />
                              : null
                            } */}
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