import * as React from "react";
import {
    Animated, LayoutChangeEvent,
    StyleSheet, View,
} from "react-native";
import {useRecoilState} from "recoil";
import {useContext} from "react";
import {cropSizeState, imageBoundsState, accumulatedPanState, cropRatioState} from "../../store";
import {EditorContext} from "../../constants";

export const ImageCropOverlay = () => {
    // Shared state and bits passed through recoil to avoid prop drilling
    const [ratio] = useRecoilState(cropRatioState);
    const [cropSize, setCropSize] = useRecoilState(cropSizeState);
    const [imageBounds] = useRecoilState(imageBoundsState);

    // Editor context
    const {lockAspectRatio} = useContext(EditorContext);
    const usedRatio = lockAspectRatio || ratio

    const [animatedCropSize] = React.useState({
        width: new Animated.Value(cropSize.width),
        height: new Animated.Value(cropSize.height),
    });

    React.useEffect(() => {
        // When the crop size updates make sure the animated value does too!
        animatedCropSize.height.setValue(cropSize.height);
        animatedCropSize.width.setValue(cropSize.width);
    }, [cropSize]);

    React.useEffect(() => {
        // Update the size of the crop window based on the new image bounds
        let newSize = {width: 0, height: 0};
        const {width, height} = imageBounds;
        const imageAspectRatio = width / height;

        // TODO: check if === 1.19 or < 0.8 else = 1

        // Then check if the cropping aspect ratio is smaller
        if (usedRatio < imageAspectRatio) {
            // If so calculate the size so its not greater than the image width
            newSize.height = height;
            newSize.width = height * usedRatio;
        } else {
            // else, calculate the size so its not greater than the image height
            newSize.width = width;
            newSize.height = width / usedRatio;
        }
        // Set the size of the crop overlay
        setCropSize(prev => ({ ...prev, ...newSize }))
    }, [imageBounds, usedRatio]);

    const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
        const { layout } = nativeEvent
        const { x, y } = layout
        setCropSize(prev => ({...prev, x, y}))
    }

    return (
        <Animated.View
            style={[
                styles.container,
                animatedCropSize,
                styles.borderHorizontal,
                styles.borderVertical,
                styles.borderWhite
            ]}
            onLayout={onLayout}
        >
            <View style={styles.row}>
                <View style={[styles.item]}/>
                <View style={[styles.item, styles.borderHorizontal]}/>
                <View style={[styles.item]}/>
            </View>
            <View style={styles.row}>
                <View style={[styles.item, styles.borderVertical]}/>
                <View style={[styles.item, styles.borderHorizontal, styles.borderVertical]}/>
                <View style={[styles.item, styles.borderVertical]}/>
            </View>
            <View style={styles.row}>
                <View style={[styles.item]}/>
                <View style={[styles.item, styles.borderHorizontal]}/>
                <View style={[styles.item]}/>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    item: {
        flex: 1,
        borderColor: 'white',
    },
    borderWhite: {
        borderColor: 'white',
    },
    borderVertical: {
        borderTopWidth: .5,
        borderBottomWidth: .5,
    },
    borderHorizontal: {
        borderLeftWidth: .5,
        borderRightWidth: .5,
    },

});
