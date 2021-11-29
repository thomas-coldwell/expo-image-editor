import * as React from "react";
import {Dimensions, Image, ImageBackground, StyleSheet, View} from "react-native";
import {useRecoilState} from "recoil";
import {
    imageDataState,
    imageBoundsState,
    imageScaleFactorState,
    editingModeState,
} from "../../store";
import {ImageCropOverlay} from "../overlay";

type ImageLayout = {
    height: number;
    width: number;
} | null;

export function EditingWindow() {
    const [imageLayout, setImageLayout] = React.useState<ImageLayout>(null);

    const [imageData] = useRecoilState(imageDataState);
    const [, setImageBounds] = useRecoilState(imageBoundsState);
    const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
    const [editingMode] = useRecoilState(editingModeState);

    const imageRatio = imageData.width / imageData.height
    const imageHeightFromWidth = Dimensions.get("window").width / imageRatio;

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
    }, [imageData]);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageBackground
                    style={[{ width: Dimensions.get('window').width, height: imageHeightFromWidth, alignItems: 'center' }]}
                    source={{uri: imageData.uri}}
                    onLayout={(event) => {
                        getImageFrame(event.nativeEvent.layout);
                    }}
                >
                    {isCropping && imageLayout != null ? <ImageCropOverlay /> : null}
                </ImageBackground>
            </View>
        </View>
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
