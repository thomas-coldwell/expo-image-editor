import React from "react";
import {LayoutChangeEvent, LayoutRectangle, StyleSheet, View} from "react-native";
import {DEVICE_WIDTH, INITIAL_LAYOUT} from "../ImageEditor.constant";

interface Props {
    cropArea: { height: number, width: number };
    onCropAreaLayout: (event: LayoutChangeEvent) => void
}

export const CropArea = (props: Props) => {
    const { cropArea } = props;

    const [cropAreaWrapperLayout, setCropAreaWrapperLayout] = React.useState<LayoutRectangle>(INITIAL_LAYOUT)

    const opaqueArea = React.useMemo(() => {
        return {
            height: (cropAreaWrapperLayout.height - cropArea.height) / 2,
            width: DEVICE_WIDTH
        }
    }, [ cropArea, cropAreaWrapperLayout ])

    const onCropAreaWrapperLayout = (event: LayoutChangeEvent) => {
        event.persist()
        if (!!event?.nativeEvent?.layout) {
            setCropAreaWrapperLayout(event.nativeEvent.layout)
        }
    }

    return (
        <View
            pointerEvents={'none'}
            style={styles.cropAreaWrapper}
            onLayout={onCropAreaWrapperLayout}
        >
            <View style={[ styles.opaqueArea, opaqueArea]} />
            <View
                onLayout={props.onCropAreaLayout}
                style={[styles.cropArea, cropArea]}
            />
            <View style={[ styles.opaqueArea, opaqueArea]} />
        </View>
    )
}

const styles = StyleSheet.create({
    cropAreaWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    opaqueArea: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    cropArea: {
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
    }
})
