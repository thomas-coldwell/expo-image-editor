import * as React from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";
import {useContext} from "react";
import {useRecoilState} from "recoil";
import {cropRatioState, editingModeState, imageDataState, processingState} from "../../store";
import {IconButton} from "../icon";
import {EditorContext} from "../../constants";

export function ControlBar() {
    const [editingMode, setEditingMode] = useRecoilState(editingModeState);
    const [imageData] = useRecoilState(imageDataState);
    const [ratio] = useRecoilState(cropRatioState)
    const [_, setProcessing] = useRecoilState(processingState);
    const {mode, onCloseEditor, onEditingComplete} = useContext(EditorContext);

    const shouldDisableDoneButton = editingMode !== "operation-select" && mode !== "crop-only";

    const onPressBack = () => {
        if (editingMode === "operation-select") {
            onCloseEditor();
        } else {
            setEditingMode("operation-select");
        }
    };

    const onFinishEditing = async () => {
        setProcessing(false);
        onEditingComplete({
            ...imageData,
            ratio,
        });
        onCloseEditor();
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <IconButton
                    iconID="arrow-back"
                    onPress={onPressBack}
                />
                <IconButton
                    iconID="done"
                    onPress={onFinishEditing}
                    disabled={shouldDisableDoneButton}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingHorizontal: 8,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
