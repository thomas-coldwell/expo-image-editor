import * as React from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";
import {useContext, useEffect} from "react";
import {useRecoilState} from "recoil";
import {editingModeState, imageDataState, processingState} from "../../store";
import {IconButton} from "../icon";
import {EditorContext} from "../../constants";
import {usePerformCrop} from "../../hooks";

export function ControlBar() {
    const [editingMode, setEditingMode] = useRecoilState(editingModeState);
    const [imageData] = useRecoilState(imageDataState);
    const [processing, setProcessing] = useRecoilState(processingState);
    const {mode, onCloseEditor, onEditingComplete} = useContext(EditorContext);

    const shouldDisableDoneButton = editingMode !== "operation-select" && mode !== "crop-only";

    const onPressBack = () => {
        if (mode === "full") {
            if (editingMode === "operation-select") {
                onCloseEditor();
            } else {
                setEditingMode("operation-select");
            }
        } else if (mode === "crop-only") {
            onCloseEditor();
        }
    };

    const onFinishEditing = async () => {
        if (mode === "full") {
            setProcessing(false);
            onEditingComplete(imageData);
            onCloseEditor();
        } else if (mode === "crop-only") {
            await usePerformCrop();
        }
    };

    // Complete the editing process if we are in crop only mode after the editingMode gets set
    // back to operation select (happens internally in usePerformCrop) - can't do it in onFinishEditing
    // else it gets stale state - may need to refactor the hook as this feels hacky
    useEffect(() => {
        if (
            mode === "crop-only" &&
            imageData.uri &&
            editingMode === "operation-select"
        ) {
            onEditingComplete(imageData);
            onCloseEditor();
        }
    }, [imageData, editingMode]);

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
