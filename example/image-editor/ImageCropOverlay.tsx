import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, View, TouchableWithoutFeedback, PanResponderGestureState } from 'react-native';
import _ from 'lodash';
import { useEditorState } from './EditorStore';

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

  const { imageBounds, fixedAspectRatio, accumulatedPan, cropSize } = props;

  const pan = useRef(new Animated.ValueXY({
    x: imageBounds.x,
    y: imageBounds.y
  })).current;

  const panInstance = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
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

  useEffect(() => {
    // https://stackoverflow.com/questions/61014169/react-natives-panresponder-has-stale-value-from-usestate
    setPanResponder(panInstance);
  }, [cropSize, accumulatedPan]);

  useEffect(() => {
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

  const onOverlayRelease = (gestureState: PanResponderGestureState) => {
    // Flatten the offset to reduce erratic behaviour
    pan.flattenOffset();
    // Ensure the cropping overlay has not been moved outside of the allowed bounds
    checkCropBounds(gestureState);
  }

  const checkCropBounds = ({dx, dy}: PanResponderGestureState | { dx: number, dy: number }) => {
    // Check if the pan in the x direction exceeds the bounds
    let accDx = accumulatedPan.x + dx;
    // Is the new x pos less than zero?
    if (accDx < 0) {
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
    if (accDy < imageBounds.y) {
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

  return(
    <View style={styles.container}
          {...panResponder.panHandlers}>
      {/* https://github.com/facebook/react-native/issues/14295#issuecomment-374012339 */}
      <TouchableWithoutFeedback onPress={() => {}}>
        <Animated.View style={[
                        styles.overlay, 
                        cropSize,
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