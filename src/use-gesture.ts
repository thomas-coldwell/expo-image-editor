import {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import {AnimatedContext, ImageLayout} from "./ImageEditor.type";
import {LayoutRectangle} from "react-native";
import React from "react";
import {clamp} from "./clamp";
import {PanGestureHandlerGestureEvent, PinchGestureHandlerGestureEvent} from "react-native-gesture-handler";

export const useGesture = (scale: number, imageLayout: ImageLayout, cropAreaLayout: LayoutRectangle) => {
    const x = useSharedValue(0)
    const y = useSharedValue(0)
    const pinchScale = useSharedValue(1)

    const usedScale = useDerivedValue(() => {
        return pinchScale.value !== 1 ? pinchScale.value : scale
    })

    const threshold = useDerivedValue(() => {
        const x = ((imageLayout.width * usedScale.value) - cropAreaLayout.width) / 2
        const y = ((imageLayout.height * usedScale.value) - cropAreaLayout.height) / 2

        return {
            minX: x,
            maxX: -x,
            minY: y,
            maxY: -y
        }
    })

    React.useEffect(() => {
        x.value = 0
        y.value = 0
        pinchScale.value = 1
    }, [scale])

    const verifyImagePosition = () => {
        'worklet'

        x.value = withTiming(clamp(x.value, threshold.value.maxX, threshold.value.minX), {duration: 250})
        y.value = withTiming(clamp(y.value, threshold.value.maxY, threshold.value.minY), {duration: 250})
    }

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, AnimatedContext>({
        onStart: (_, ctx) => {
            ctx.startX = x.value;
            ctx.startY = y.value;
        },
        onActive: (event, ctx) => {
            const nextX = ctx.startX + event.translationX
            const nextY = ctx.startY + event.translationY

            x.value = nextX // max < 0, min > 0
            y.value = nextY // max < 0, min > 0
        },
        onEnd: verifyImagePosition
    });

    const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
        onStart: (_) => {
            pinchScale.value = usedScale.value
        },
        onActive: (event) => {
            pinchScale.value = clamp((event.scale) * pinchScale.value, scale, 5)
        },
        onEnd: verifyImagePosition
    })

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
                    scale: usedScale.value,
                }
            ],
        };
    });

    return {gestureHandler, pinchHandler, animatedStyle}
}
