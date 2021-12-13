import React from "react";
import {LayoutChangeEvent, LayoutRectangle} from "react-native";
import Animated from "react-native-reanimated";
import {PanGestureHandler, PinchGestureHandler} from "react-native-gesture-handler";
import {ImageLayout} from "../ImageEditor.type";
import {useGesture} from "../hooks";

interface Props {
    scale: number
    image: ImageLayout
    cropAreaLayout: LayoutRectangle
    onImageLayout: (event: LayoutChangeEvent) => void
}

export const Image = (props: Props) => {
    const {image, scale, cropAreaLayout} = props;

    const panRef = React.createRef()
    const pinchRef = React.createRef()

    const {
        gestureHandler,
        pinchHandler,
        animatedStyle
    } = useGesture(scale, image as ImageLayout, cropAreaLayout as LayoutRectangle)

    return (
        <PanGestureHandler
            ref={panRef}
            onGestureEvent={gestureHandler}
            simultaneousHandlers={pinchRef}
        >
            <Animated.View>
                <PinchGestureHandler
                    ref={pinchRef}
                    onGestureEvent={pinchHandler}
                    simultaneousHandlers={panRef}
                >
                    <Animated.Image
                        onLayout={props.onImageLayout}
                        source={{uri: image.uri}}
                        style={[
                            {
                                height: image.height,
                                width: image.width,
                            },
                            animatedStyle,
                        ]}
                    />
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    )
}
