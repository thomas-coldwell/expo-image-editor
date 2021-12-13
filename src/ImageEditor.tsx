import React from "react";
import {
    Image,
    LayoutChangeEvent,
    LayoutRectangle,
    Modal,
    StatusBar,
    StyleSheet,
    View,
    SafeAreaView
} from "react-native";
import Animated from 'react-native-reanimated'
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PinchGestureHandler,
} from "react-native-gesture-handler";
import {
    ImageEditorProps,
    ImageLayout,
    Ratio,
    RotateValues,
} from "./ImageEditor.type";
import {
    DEVICE_WIDTH,
    PRESENTATION_STYLE,
    RATIOS
} from "./ImageEditor.constant";
import {Footer} from "./Footer";
import {Header} from "./Header";
import {
    useGesture,
    useResize,
    useRotate
} from "./hooks";

const noScroll = require('no-scroll')

export const ImageEditor = (props: ImageEditorProps) => {
    const {
        RenderRotateComponent = null,
        RenderBackIcon = null,
        RenderCheckIcon = null,
        translations = {},
        uri = '',
    } = props

    const panRef = React.createRef()
    const pinchRef = React.createRef()

    const [cropAreaLayout, setCropAreaLayout] = React.useState<LayoutRectangle>({
        width: DEVICE_WIDTH,
        height: DEVICE_WIDTH,
        x: 0,
        y: 0
    })
    const [usedRatio, setUsedRatio] = React.useState<Ratio>(RATIOS[1])
    const [image, setImage] = React.useState<ImageLayout>({width: DEVICE_WIDTH, height: DEVICE_WIDTH})
    const [scale, setScale] = React.useState<number>(1)
    const [rotate, setRotate] = React.useState<RotateValues>(RotateValues.ROTATE_0)

    const {
        gestureHandler,
        pinchHandler,
        animatedStyle
    } = useGesture(scale, image as ImageLayout, cropAreaLayout as LayoutRectangle)
    const onRotate = useRotate()
    const onResize = useResize(image.uri || props.uri, setImage)

    React.useEffect(() => {
        if (props.visible) {
            noScroll.on()
            StatusBar.setHidden(true)
        } else {
            noScroll.off()
            StatusBar.setHidden(false)
        }
    }, [props.visible])

    React.useEffect(() => {
        if (!!uri) {
            Image.getSize(props.uri, (width, height) => {
                const ratio = width / height

                let nextRatio: Ratio
                if (ratio <= 0.9) {
                    nextRatio = RATIOS.find(item => item.value === 0.8) as Ratio
                } else if (ratio > 0.9 && ratio < 1.45) {
                    nextRatio = RATIOS.find(item => item.value === 1) as Ratio
                } else {
                    nextRatio = RATIOS.find(item => item.value === 1.91) as Ratio
                }
                setUsedRatio(nextRatio)

                void onResize({width: DEVICE_WIDTH, height: DEVICE_WIDTH / ratio})
            })
        }
    }, [uri])

    const onUsedRatioChange = React.useCallback((ratio: Ratio) => {
        setUsedRatio(ratio)
    }, [])

    const cropArea = React.useMemo(() => {
        return {
            height: usedRatio.value === 1 ? DEVICE_WIDTH : DEVICE_WIDTH / usedRatio.value,
            width: DEVICE_WIDTH
        }
    }, [usedRatio])

    React.useEffect(() => {
        if (image) {
            if (image.height < cropArea.height) {
                setScale(cropArea.height / image.height)
            } else {
                setScale(1)
            }
        }
    }, [cropArea, image?.uri])

    const onCropAreaLayout = (event: LayoutChangeEvent) => {
        event.persist()
        if (!!event?.nativeEvent?.layout) {
            setCropAreaLayout(event.nativeEvent.layout)
        }
    }

    const onImageLayout = (event: LayoutChangeEvent) => {
        event.persist()
        if (!!event?.nativeEvent?.layout) {
            setImage(prev => ({...prev, ...event?.nativeEvent?.layout}))
        }
    }

    const onRotateEvent = async () => {
        let next: RotateValues

        switch (rotate) {
            case RotateValues.ROTATE_0:
                next = RotateValues.ROTATE_90
                break
            case RotateValues.ROTATE_90:
                next = RotateValues.ROTATE_180
                break
            case RotateValues.ROTATE_180:
                next = RotateValues.ROTATE_270
                break
            case RotateValues.ROTATE_270:
                next = RotateValues.ROTATE_0
                break
        }

        const result = await onRotate(props.uri, next)
        setRotate(next)
        setImage(prev => ({...prev, ...result}))
        Image.getSize(result.uri as string, (width, height) => {
            const ratio = width / height
            void onResize({width: DEVICE_WIDTH, height: DEVICE_WIDTH / ratio, uri: result.uri})
        })
    }

    return (
        <>
            <Modal
                visible={props.visible}
                animationType={"slide"}
                presentationStyle={PRESENTATION_STYLE}
                statusBarTranslucent
                onRequestClose={props.onClose}
            >
                <GestureHandlerRootView style={styles.container}>
                    <SafeAreaView style={styles.container}>
                        <Header
                            translations={translations}
                            RenderBackIcon={RenderBackIcon}
                            RenderCheckIcon={RenderCheckIcon}
                            onClose={props.onClose}
                        />
                        <View
                            collapsable={false}
                            style={styles.imageContainer}
                        >
                            {!!image && (
                                <>
                                    <PanGestureHandler ref={panRef} onGestureEvent={gestureHandler}
                                                       simultaneousHandlers={pinchRef}>
                                        <Animated.View>
                                            <PinchGestureHandler ref={pinchRef} onGestureEvent={pinchHandler}
                                                                 simultaneousHandlers={panRef}>
                                                <Animated.Image
                                                    onLayout={onImageLayout}
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
                                    <View
                                        pointerEvents={'none'}
                                        onLayout={onCropAreaLayout}
                                        style={[styles.cropArea, cropArea]}
                                    />
                                </>
                            )}
                        </View>
                        <Footer
                            usedRatio={usedRatio}
                            onChangeUsedRatio={onUsedRatioChange}
                            RenderRotateComponent={RenderRotateComponent}
                            onRotate={onRotateEvent}
                        />
                    </SafeAreaView>
                </GestureHandlerRootView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        overflow: 'hidden'
    },
    imageContainer: {
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    cropArea: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
        marginTop: 'auto'
    }
})
