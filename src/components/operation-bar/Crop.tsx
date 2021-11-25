import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import {useRecoilState} from "recoil";
import {IconButton} from "../icon";
import {editingModeState} from "../../store";
import {usePerformCrop} from "../../hooks";

export function Crop() {
    const [, setEditingMode] = useRecoilState(editingModeState);

    const onPerformCrop = usePerformCrop();

    return (
        <View style={styles.container}>
            <IconButton
                iconID="close"
                text="Cancel"
                onPress={() => setEditingMode("operation-select")}
            />
            <Text style={styles.prompt}>Adjust window to crop</Text>
            <IconButton iconID="check" text="Done" onPress={onPerformCrop}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "2%",
    },
    prompt: {
        color: "#fff",
        fontSize: 21,
        textAlign: "center",
    },
});
