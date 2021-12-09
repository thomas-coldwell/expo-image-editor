import {useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring,} from "react-native-reanimated";
import {AnimatedContext, ImageLayout} from "./ImageEditor.type";
import {LayoutRectangle} from "react-native";
import React from "react";
import {clamp} from "./clamp";
import {GestureEvent, PinchGestureHandlerGestureEvent} from "react-native-gesture-handler";

type Gesture = PinchGestureHandlerGestureEvent & GestureEvent

export const useGesture = (scale: number, imageLayout: ImageLayout, cropAreaLayout: LayoutRectangle) => {
    const x = useSharedValue(0)
    const y = useSharedValue(0)

    React.useEffect(() => {
        x.value = 0
        y.value = 0
    }, [ scale ])

    const gestureHandler = useAnimatedGestureHandler<
        Gesture,
        AnimatedContext
        >({
        onStart: (_, ctx) => {
            console.log(_)
            ctx.startX = x.value;
            ctx.startY = y.value;
        },
        onActive: (event, ctx) => {
            if (imageLayout && cropAreaLayout) {

                // @ts-ignore
                const nextX = ctx.startX + event.translationX
                // @ts-ignore
                const nextY = ctx.startY + event.translationY

                const minX = ((imageLayout.width * scale) - cropAreaLayout.width) / 2
                const maxX = -minX

                const minY = ((imageLayout.height * scale) - cropAreaLayout.height) / 2
                const maxY =  -minY

                x.value = clamp(nextX, maxX, minX) // max < 0, min > 0
                y.value = clamp(nextY, maxY, minY) // max < 0, min > 0
            }
        },
        onEnd: (_) => {
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: x.value,
                },
                {
                    translateY: y.value,
                },
                {
                    scale,
                }
            ],
        };
    });

    return {gestureHandler, animatedStyle}
}
