import * as React from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";
import {useContext} from "react";
import {useRecoilState} from "recoil";
import {cropRatioState, editingModeState, imageDataState, processingState} from "../../store";
import {IconButton} from "../icon";
import {EditorContext} from "../../constants";
import {useResizeToDesiredDimensions} from "../../hooks";

export function ControlBar() {
    const [editingMode, setEditingMode] = useRecoilState(editingModeState);
    const [ratio] = useRecoilState(cropRatioState)
    const [_, setProcessing] = useRecoilState(processingState);
    const {onCloseEditor, onEditingComplete} = useContext(EditorContext);

    const shouldDisableDoneButton = editingMode !== "operation-select";
    const resizeToDesiredDimensions = useResizeToDesiredDimensions()

    const onPressBack = () => {
        if (editingMode === "operation-select") {
            onCloseEditor();
        } else {
            setEditingMode("operation-select");
        }
    };

    const onFinishEditing = async () => {
        const data = await resizeToDesiredDimensions()


        setProcessing(false);
        onEditingComplete({...data, ratio,});
        onCloseEditor();
    };

    return editingMode === "operation-select"
        ? (
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
        )
        : null
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
