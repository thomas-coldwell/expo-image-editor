import {useGesture} from "./use-gesture";

const noScroll = require('no-scroll')

import React from "react";
import {
    Image, LayoutChangeEvent, LayoutRectangle,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View
} from "react-native";
import {
    GestureHandlerRootView,
    PanGestureHandler, PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated from 'react-native-reanimated'
import * as ImageManipulator from 'expo-image-manipulator';
import {
    ImageEditorProps,
    Ratio,
    ImageLayout,
} from "./ImageEditor.type";
import {
    DEVICE_WIDTH,
    RATIOS
} from "./ImageEditor.constant";
import {Footer} from "./Footer";
import {Header} from "./Header";

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

    const [cropAreaLayout, setCropAreaLayout] = React.useState<LayoutRectangle>()
    const [usedRatio, setUsedRatio] = React.useState<Ratio>(RATIOS[1])
    const [image, setImage] = React.useState<ImageLayout>()
    const [scale, setScale] = React.useState<number>(1)

    const {
        gestureHandler,
        pinchHandler,
        animatedStyle
    } = useGesture(scale, image as ImageLayout, cropAreaLayout as LayoutRectangle)

    React.useEffect(() => {
        if (props.visible) {
            noScroll.on()
        } else {
            noScroll.off()
        }
    }, [props.visible])

    React.useEffect(() => {
        if (!!uri) {
            Image.getSize(uri, (width, height) => {
                const ratio = width / height

                let nextRatio: Ratio
                if (ratio <= 0.9) {
                    nextRatio = RATIOS.find(item => item.value === 0.8) as Ratio
                } else if (ratio > 0.9 && ratio < 1.45) {
                    nextRatio = RATIOS.find(item => item.value === 1) as Ratio
                } else {
                    nextRatio = RATIOS.find(item => item.value === 1.91) as Ratio
                }

                ImageManipulator.manipulateAsync(
                    uri,
                    [{
                        resize: {width: DEVICE_WIDTH, height: DEVICE_WIDTH / ratio}
                    }])
                    .then((data) => {
                        setImage(prev => ({...prev, ...data}))
                    })

                setUsedRatio(nextRatio)
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
    }, [cropArea])

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

    return (
        <GestureHandlerRootView>
            <>
                <StatusBar hidden={props.visible}/>
                <Modal
                    visible={props.visible}
                    animationType={"slide"}
                    presentationStyle="pageSheet"
                    statusBarTranslucent
                    onRequestClose={props.onClose}
                >
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
                                    <PanGestureHandler ref={panRef} onGestureEvent={gestureHandler} simultaneousHandlers={pinchRef}>
                                        <Animated.View>
                                            <PinchGestureHandler ref={pinchRef} onGestureEvent={pinchHandler} simultaneousHandlers={panRef}>
                                                <Animated.Image
                                                    onLayout={onImageLayout}
                                                    source={{uri: image.uri}}
                                                    style={[
                                                        styles.image,
                                                        {
                                                            height: image.height,
                                                            width: image.width,
                                                            transform: [
                                                                {
                                                                    scale
                                                                }
                                                            ]
                                                        },
                                                        animatedStyle
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
                        />
                    </SafeAreaView>
                </Modal>
            </>
        </GestureHandlerRootView>
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
    image: {},
    cropArea: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
        marginTop: 'auto'
    }
})
