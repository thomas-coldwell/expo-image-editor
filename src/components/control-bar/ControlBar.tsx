import * as React from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";
import {useContext} from "react";
import {useRecoilState} from "recoil";
import {editingModeState} from "../../store";
import {IconButton} from "../icon";
import {EditorContext} from "../../constants";
import {useFinishEditing} from "../../hooks";

export function ControlBar() {
    const [editingMode, setEditingMode] = useRecoilState(editingModeState);
    const {backIcon, doneIcon, onCloseEditor} = useContext(EditorContext);
    const onFinishEditing = useFinishEditing()

    const shouldDisableDoneButton = editingMode !== "operation-select";

    const onPressBack = () => {
        if (editingMode === "operation-select") {
            return onCloseEditor();
        }
        setEditingMode("operation-select");
    };

    return editingMode === "operation-select"
        ? (
            <SafeAreaView>
                <View style={styles.container}>
                    <IconButton
                        iconID="arrow-back"
                        icon={backIcon}
                        onPress={onPressBack}
                    />
                    <IconButton
                        iconID="done"
                        icon={doneIcon}
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
        paddingBottom: 16,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
