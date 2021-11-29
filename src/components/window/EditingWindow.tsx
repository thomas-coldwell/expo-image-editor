import * as React from "react";
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    State
} from "react-native-gesture-handler";
import {Animated, Dimensions, StyleSheet, View} from "react-native";
import {useRecoilState} from "recoil";
import {
    accumulatedPanState,
    cropSizeState,
    editingModeState,
    imageBoundsState,
    imageDataState,
    imageScaleFactorState,
} from "../../store";
import {ImageCropOverlay} from "../overlay";

type ImageLayout = {
    height: number;
    width: number;
} | null;


export function EditingWindow() {
    const [imageLayout, setImageLayout] = React.useState<ImageLayout>(null);

    const [imageBounds] = useRecoilState(imageBoundsState);
    const [imageData] = useRecoilState(imageDataState);
    const [, setImageBounds] = useRecoilState(imageBoundsState);
    const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
    const [editingMode] = useRecoilState(editingModeState);
    const [cropSize] = useRecoilState(cropSizeState)
    const [accumulatedPan, setAccumulatedPan] = useRecoilState(accumulatedPanState);

    const imageRatio = imageData.width / imageData.height
    const imageHeightFromWidth = Dimensions.get("window").width / imageRatio;

    const panX = React.useRef(new Animated.Value(imageBounds.x));
    const panY = React.useRef(new Animated.Value(imageBounds.y));

    // Get some readable boolean states
    const isCropping = editingMode === "crop";

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

    const onGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
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

    const onHandlerStateChange = ({nativeEvent,}: PanGestureHandlerGestureEvent) => {
        // Handle any state changes from the pan gesture handler
        // only looking at when the touch ends atm
        if (nativeEvent.state === State.END) {
            console.log("END", {cropSize, nativeEvent})
            const { translationX, translationY } = nativeEvent

            let accDx = accumulatedPan.x + translationX;

            const cropAreaRangeX = [ cropSize.x, cropSize.x + cropSize.width ]
            const isAccDxInsideRangeX = accDx > cropAreaRangeX[0] && accDx < cropAreaRangeX[1]
            const isUnderZeroAndInsideRangeX = accDx < 0 && accDx + imageBounds.width < cropAreaRangeX[1]

            if  (isUnderZeroAndInsideRangeX) {
                accDx = -cropSize.x
            } else if (isAccDxInsideRangeX) {
                // Then set the x pos so the crop frame touches the right hand edge
                accDx = cropSize.x;
            } else {
                // It's somewhere in between - no formatting required
            }
            // Check if the pan in the y direction exceeds the bounds
            let accDy = accumulatedPan.y + translationY;
            // Is the new y pos less the top edge?
            if (accDy <= imageBounds.y) {
                // Then set it to be zero and set the pan to zero too
                accDy = imageBounds.y;
            }
            // Is the new y pos plus crop height going to exceed the bottom bound
            else if (accDy + cropSize.height > imageBounds.height + imageBounds.y) {
                // Then set the y pos so the crop frame touches the bottom edge
                let limitedYPos = imageBounds.y + imageBounds.height - cropSize.height;
                accDy = limitedYPos;
            } else {
                // It's somewhere in between - no formatting required
            }

            // Record the accumulated pan and reset the pan refs to zero
            panX.current.setValue(0);
            panY.current.setValue(0);
            setAccumulatedPan({ x: accDx, y: accDy });
        }
    };

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
                                width: Dimensions.get('window').width,
                                height: imageHeightFromWidth,
                                alignItems: 'center',

                            },
                            {
                                transform: [
                                    { translateX: Animated.add(panX.current, accumulatedPan.x) },
                                    { translateY: Animated.add(panY.current, accumulatedPan.y) },
                                ],
                            },
                        ]}
                        source={{ uri: imageData.uri }}
                        onLayout={(event) => {
                            getImageFrame(event.nativeEvent.layout);
                        }}
                    />
                    {isCropping && imageLayout != null ? <ImageCropOverlay/> : null}
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
