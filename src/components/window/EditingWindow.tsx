import * as React from "react";
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    State
} from "react-native-gesture-handler";
import {Animated, StyleSheet, View} from "react-native";
import {useRecoilState} from "recoil";
import {
    accumulatedPanState, cropRatioState,
    cropSizeState,
    editingModeState,
    imageBoundsState,
    imageDataState,
    imageScaleFactorState, processingState,
} from "../../store";
import {ImageCropOverlay} from "../overlay";
import {DEVICE_WIDTH} from "../../constants";

type ImageLayout = {
    height: number;
    width: number;
} | null;


export function EditingWindow() {
    const [imageLayout, setImageLayout] = React.useState<ImageLayout>(null);

    const [processing] = useRecoilState(processingState)
    const [imageBounds] = useRecoilState(imageBoundsState);
    const [imageData] = useRecoilState(imageDataState);
    const [, setImageBounds] = useRecoilState(imageBoundsState);
    const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
    const [editingMode] = useRecoilState(editingModeState);
    const [cropSize] = useRecoilState(cropSizeState)
    const [cropRatio] = useRecoilState(cropRatioState)
    const [accumulatedPan, setAccumulatedPan] = useRecoilState(accumulatedPanState);

    const isCropping = editingMode === "crop";
    const imageRatio = imageData.width / imageData.height
    const imageHeightFromWidth = DEVICE_WIDTH / imageRatio;
    const allowCropping = isCropping && imageLayout !== null;

    // Merge them into one object
    const panX = React.useRef(new Animated.Value(0));
    const panY = React.useRef(new Animated.Value(0));
    const animatedStyle = {
        transform: [
            {translateX: Animated.add(panX.current, accumulatedPan.x)},
            {translateY: Animated.add(panY.current, accumulatedPan.y)},
        ]
    }

    const getImageFrame = (layout: {
        width: number;
        height: number;
        [key: string]: any;
    }) => {
        onUpdateCropLayout(layout);
    };

    const onUpdateCropLayout = (layout: ImageLayout) => {
        // Check layout is not null
        if (layout) {
            // Find the start point of the photo on the screen and its
            // width / height from there
            const editingWindowAspectRatio = layout.height / layout.width;
            //
            const imageAspectRatio = imageData.height / imageData.width;

            let bounds = {x: 0, y: 0, width: 0, height: 0};
            let imageScaleFactor = 1;
            // Check which is larger
            if (imageAspectRatio > editingWindowAspectRatio) {
                // Then x is non-zero, y is zero; calculate x...
                bounds.x =
                    (((imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio) *
                        layout.width) /
                    2;
                bounds.width = layout.height / imageAspectRatio;
                bounds.height = layout.height;
                imageScaleFactor = imageData.height / layout.height;
            } else {
                // Then y is non-zero, x is zero; calculate y...
                bounds.y =
                    (((1 / imageAspectRatio - 1 / editingWindowAspectRatio) /
                            (1 / imageAspectRatio)) *
                        layout.height) /
                    2;
                bounds.width = layout.width;
                bounds.height = layout.width * imageAspectRatio;
                imageScaleFactor = imageData.width / layout.width;
            }
            setImageBounds(bounds);
            setImageScaleFactor(imageScaleFactor);
            setImageLayout({
                height: layout.height,
                width: layout.width,
            });
        }
    };

    React.useEffect(() => {
        onUpdateCropLayout(imageLayout);
    }, [imageData])

    React.useEffect(() => {
        reset()
    }, [cropRatio, isCropping])

    const onGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
        if (allowCropping) {
            Animated.event(
                [
                    {
                        translationX: panX.current,
                        translationY: panY.current,
                    },
                ],
                { useNativeDriver: false }
            )(nativeEvent);
        }
    }

    const onHandlerStateChange = ({nativeEvent}: PanGestureHandlerGestureEvent) => {
        // Handle any state changes from the pan gesture handler
        // only looking at when the touch ends atm
        if (nativeEvent.state === State.END && allowCropping) {
            const { translationX, translationY } = nativeEvent

            let accDx = accumulatedPan.x + translationX;
            const cropAreaRangeX = [ cropSize.x, cropSize.x + cropSize.width ]
            const isAccDxInsideRangeX = accDx > cropAreaRangeX[0] && accDx < cropAreaRangeX[1]
            const isUnderZeroAndInsideRangeX = accDx < 0 && accDx + imageBounds.width < cropAreaRangeX[1]

            // If the accumulated translation x is under 0 AND inside the crop area range
            if  (isUnderZeroAndInsideRangeX) {
                accDx = -cropSize.x
            // If the accumulated translation x is inside the crop area range
            } else if (isAccDxInsideRangeX) {
                accDx = cropSize.x;
            }


            // Check if the pan in the y direction exceeds the bounds
            let accDy = accumulatedPan.y + translationY;
            const cropAreaRangeY = [ cropSize.y, cropSize.y + cropSize.height ]
            const isAccDyInsideRangeY = accDy > cropAreaRangeY[0] && accDy < cropAreaRangeY[1]
            const isUnderZeroAndInsideRangeY = accDy < 0 && accDy + imageBounds.height < cropAreaRangeY[1]

            // If the accumulated translation y is under 0 AND inside the crop area range
            if  (isUnderZeroAndInsideRangeY) {
                accDy = -cropSize.y
                // If the accumulated translation x is inside the crop area range
            } else if (isAccDyInsideRangeY) {
                accDy = cropSize.y;
            }

            // Record the accumulated pan and reset the pan refs to zero
            panX.current.setValue(0);
            panY.current.setValue(0);
            setAccumulatedPan({ x: accDx, y: accDy });
        }
    };

    const reset = () => {
        panY.current.setValue(0)
        panX.current.setValue(0)
        setAccumulatedPan({ x: 0, y: 0 })
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <View style={styles.imageContainer}>
                    <Animated.Image
                        style={[
                            {
                                width: DEVICE_WIDTH,
                                height: imageHeightFromWidth,
                                alignItems: 'center',
                            },
                            isCropping ? animatedStyle : null
                        ]}
                        source={{ uri: imageData.uri }}
                        onLayout={(event) => {
                            getImageFrame(event.nativeEvent.layout);
                        }}
                    />
                    {allowCropping ? <ImageCropOverlay/> : null}
                </View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});
