import * as React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { useRecoilState } from "recoil";
import { IconButton } from "../components/IconButton";
import { editingModeState, imageDataState, processingState } from "../Store";
import * as ImageManipulator from "expo-image-manipulator";
export function Rotate() {
    //
    const [, setProcessing] = useRecoilState(processingState);
    const [imageData, setImageData] = useRecoilState(imageDataState);
    const [, setEditingMode] = useRecoilState(editingModeState);
    const [originalImageData] = React.useState(imageData);
    const [rotation, setRotation] = React.useState(0);
    React.useEffect(() => {
        if (rotation !== 0) {
            onRotate(rotation);
        }
        else {
            setImageData(originalImageData);
        }
    }, [rotation]);
    const onRotate = async (angle) => {
        setProcessing(true);
        // Rotate the image by the specified angle
        // To get rid of thing white line caused by context its being painted onto
        // crop 1 px border off https://github.com/expo/expo/issues/7325
        const { uri: rotateUri, width: rotateWidth, height: rotateHeight, } = await ImageManipulator.manipulateAsync(originalImageData.uri, [
            { rotate: angle },
        ]);
        const { uri, width, height } = await ImageManipulator.manipulateAsync(rotateUri, [
            {
                crop: {
                    originX: 1,
                    originY: 1,
                    width: rotateWidth - 2,
                    height: rotateHeight - 2,
                },
            },
        ]);
        setImageData({ uri, width, height });
        setProcessing(false);
    };
    const onClose = () => {
        // If closing reset the image back to its original
        setImageData(originalImageData);
        setEditingMode("operation-select");
    };
    const rotate = (direction) => {
        const webDirection = Platform.OS === "web" ? 1 : -1;
        let rotateBy = rotation - 90 * webDirection * (direction === "cw" ? 1 : -1);
        // keep it in the -180 to 180 range
        if (rotateBy > 180) {
            rotateBy = -90;
        }
        else if (rotateBy < -180) {
            rotateBy = 90;
        }
        setRotation(rotateBy);
    };
    return (React.createElement(View, { style: styles.container },
        React.createElement(View, { style: [styles.row, { paddingHorizontal: "20%" }] },
            React.createElement(IconButton, { iconID: "rotate-left", text: "Rotate -90", onPress: () => rotate("ccw") }),
            React.createElement(IconButton, { iconID: "rotate-right", text: "Rotate +90", onPress: () => rotate("cw") })),
        React.createElement(View, { style: styles.row },
            React.createElement(IconButton, { iconID: "close", text: "Cancel", onPress: () => onClose() }),
            React.createElement(Text, { style: styles.prompt }, "Rotate"),
            React.createElement(IconButton, { iconID: "check", text: "Done", onPress: () => setEditingMode("operation-select") }))));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    prompt: {
        color: "#fff",
        fontSize: 21,
        textAlign: "center",
    },
    row: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "2%",
    },
});
