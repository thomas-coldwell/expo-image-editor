import React from "react";
import {LayoutChangeEvent, LayoutRectangle} from "react-native";
import Animated, {AnimateStyle} from "react-native-reanimated";
import {
    GestureEvent,
    PanGestureHandler,
    PanGestureHandlerEventPayload,
    PinchGestureHandler,
    PinchGestureHandlerEventPayload
} from "react-native-gesture-handler";
import {ImageLayout} from "../ImageEditor.type";

interface Props {
    scale: number
    image: ImageLayout
    animatedStyle: AnimateStyle<any>
    gestureHandler: ((event: GestureEvent<PanGestureHandlerEventPayload>) => void) | undefined
    pinchHandler: ((event: GestureEvent<PinchGestureHandlerEventPayload>) => void) | undefined
    cropAreaLayout: LayoutRectangle
    onImageLayout: (event: LayoutChangeEvent) => void
}

export const Image = (props: Props) => {
    const {image} = props;

    const panRef = React.createRef()
    const pinchRef = React.createRef()


    return (
        <PanGestureHandler
            ref={panRef}
            onGestureEvent={props.gestureHandler}
            simultaneousHandlers={pinchRef}
        >
            <Animated.View>
                <PinchGestureHandler
                    ref={pinchRef}
                    onGestureEvent={props.pinchHandler}
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
                            props.animatedStyle,
                        ]}
                    />
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    )
}
