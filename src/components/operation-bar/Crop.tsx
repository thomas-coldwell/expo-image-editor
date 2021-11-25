import * as React from "react";
import {StyleSheet, Text, SafeAreaView} from "react-native";
import {useRecoilState} from "recoil";
import {IconButton} from "../icon";
import {editingModeState} from "../../store";
import {usePerformCrop} from "../../hooks";

export function Crop() {
    const [, setEditingMode] = useRecoilState(editingModeState);

    const onPerformCrop = usePerformCrop();

    return (
        <SafeAreaView style={styles.container}>
            <IconButton
                iconID="close"
                text="Cancel"
                onPress={() => setEditingMode("operation-select")}
            />
            <IconButton iconID="check" text="Done" onPress={onPerformCrop}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    prompt: {
        color: "#fff",
        fontSize: 21,
        textAlign: "center",
    },
});
