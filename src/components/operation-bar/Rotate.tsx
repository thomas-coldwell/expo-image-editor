import * as React from "react";
import {StyleSheet, View, Platform} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import {useRecoilState} from "recoil";
import {IconButton} from "../icon";
import {editingModeState, imageDataState, processingState} from "../../store";
import {OperationBarSelectedFooter} from "../operation-bar-selected-footer";
import {EditorContext} from "../../constants";

export function Rotate() {
    const { rotateLeftIcon, rotateRightIcon } = React.useContext(EditorContext)
    const [, setProcessing] = useRecoilState(processingState);
    const [imageData, setImageData] = useRecoilState(imageDataState);
    const [, setEditingMode] = useRecoilState(editingModeState);

    const [originalImageData] = React.useState(imageData);
    const [rotation, setRotation] = React.useState(0);

    React.useEffect(() => {
        if (rotation !== 0) {
            onRotate(rotation);
        } else {
            setImageData(originalImageData);
        }
    }, [rotation]);

    const onRotate = async (angle: number) => {
        setProcessing(true);
        // Rotate the image by the specified angle
        // To get rid of thing white line caused by context its being painted onto
        // crop 1 px border off https://github.com/expo/expo/issues/7325
        const {
            uri: rotateUri,
            width: rotateWidth,
            height: rotateHeight,
        } = await ImageManipulator.manipulateAsync(originalImageData.uri, [
            {rotate: angle},
        ]);
        const {uri, width, height} = await ImageManipulator.manipulateAsync(
            rotateUri,
            [
                {
                    crop: {
                        originX: 1,
                        originY: 1,
                        width: rotateWidth - 2,
                        height: rotateHeight - 2,
                    },
                },
            ]
        );
        setImageData({uri, width, height});
        setProcessing(false);
    };

    const onClose = () => {
        // If closing reset the image back to its original
        setImageData(originalImageData);
    };

    const onValidate = () => {
        setEditingMode("operation-select");
    }

    const rotate = (direction: "cw" | "ccw") => {
        const webDirection = Platform.OS === "web" ? 1 : -1;
        let rotateBy = rotation - 90 * webDirection * (direction === "cw" ? 1 : -1);
        // keep it in the -180 to 180 range
        if (rotateBy > 180) {
            rotateBy = -90;
        } else if (rotateBy < -180) {
            rotateBy = 90;
        }
        setRotation(rotateBy);
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <IconButton iconID="rotate-left" icon={rotateLeftIcon} onPress={() => rotate("ccw")}/>
                <IconButton iconID="rotate-right" icon={rotateRightIcon} onPress={() => rotate("cw")}/>
            </View>
            <OperationBarSelectedFooter onCancel={onClose} onValidate={onValidate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 16,
    },
});
