import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, View, TouchableWithoutFeedback, PanResponderGestureState } from 'react-native';
import _ from 'lodash';

interface ImageCropOverlayProps {
  cropBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  fixedAspectRatio: number;
}

function ImageCropOverlay(props: ImageCropOverlayProps) {

  const { cropBounds, fixedAspectRatio } = props;

  const pan = useRef(new Animated.ValueXY({
    x: cropBounds.x,
    y: cropBounds.y
  })).current;

  const panInstance = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
    },
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ]
    ),
    onPanResponderRelease: (e, gestureState) => onOverlayRelease(gestureState),
    onPanResponderTerminationRequest: () => false
  });

  const [panResponder, setPanResponder]  = useState(panInstance);

  const [size, setSize] = useState({
    width: 0,
    height: 0
  });

  const [accumulatedPan, setAccumulatedPan] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    // https://stackoverflow.com/questions/61014169/react-natives-panresponder-has-stale-value-from-usestate
    setPanResponder(panInstance);
  }, [size, accumulatedPan]);

  useEffect(() => {
    let newSize = { width: 0, height: 0 };
    const { width, height } = cropBounds;
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
    setSize(newSize);
  }, [cropBounds]);

  const onOverlayRelease = (gestureState) => {
    // Flatten the offset to reduce erratic behaviour
    pan.flattenOffset();
    // Ensure the cropping overlay has not been moved outside of the allowed bounds
    checkCropBounds(gestureState);
  }

  const checkCropBounds = ({dx, dy}: PanResponderGestureState) => {
    // Check if the pan in the x direction exceeds the bounds
    let accDx = accumulatedPan.x + dx;
    // Is the new x pos less than zero?
    if (accDx < 0) {
      // Then set it to be zero and set the pan to zero too
      accDx = cropBounds.x;
      pan.x.setValue(cropBounds.x);
    }
    // Is the new x pos plus crop width going to exceed the right hand bound
    else if ((accDx + size.width) > cropBounds.width) {
      // Then set the x pos so the crop frame touches the right hand edge
      let limitedXPos = cropBounds.x + cropBounds.width - size.width;
      accDx = limitedXPos;
      pan.x.setValue(limitedXPos);
    }
    else {
      // It's somewhere in between - no formatting required
    }

    // Check if the pan in the y direction exceeds the bounds
    let accDy = accumulatedPan.y + dy;
    // Is the new y pos less the top edge?
    if (accDy < cropBounds.y) {
      // Then set it to be zero and set the pan to zero too
      accDy = cropBounds.y;
      pan.y.setValue(cropBounds.y);
    }
    // Is the new y pos plus crop height going to exceed the bottom bound
    else if ((accDy + size.height) > cropBounds.height) {
      // Then set the y pos so the crop frame touches the bottom edge
      let limitedYPos = cropBounds.y + cropBounds.height - size.height;
      accDy = limitedYPos;
      pan.y.setValue(limitedYPos);
    }
    else {
      // It's somewhere in between - no formatting required
    }

    // Record the accumulated pan
    setAccumulatedPan({x: accDx, y: accDy})
  }

  return(
    <View style={styles.container}
          {...panResponder.panHandlers}>
      {/* https://github.com/facebook/react-native/issues/14295#issuecomment-374012339 */}
      <TouchableWithoutFeedback onPress={() => {}}>
        <Animated.View style={[
                        styles.overlay, 
                        size,
                        {transform: [
                          {translateX: pan.x}, 
                          {translateY: pan.y}
                        ]}
                       ]}>

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
    backgroundColor: '#ff00ff44'
  }
})