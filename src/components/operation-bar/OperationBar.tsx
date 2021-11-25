import * as React from "react";
import {StyleSheet, View} from "react-native";
import {useRecoilState} from "recoil";
import {editingModeState} from "../../store";
import {OperationSelection} from "./OperationSelection";
import {Crop} from "./Crop";
import {Rotate} from "./Rotate";
import {Blur} from "./Blur";

export function OperationBar() {
    const [editingMode] = useRecoilState(editingModeState);

    const getOperationWindow = () => {
        switch (editingMode) {
            case "crop":
                return <Crop/>;
            case "rotate":
                return <Rotate/>;
            case "blur":
                return <Blur/>;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <OperationSelection/>
            {editingMode !== "operation-select" && (
                <View style={[styles.container, {position: "absolute"}]}>
                    {getOperationWindow()}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 160,
        width: "100%",
        backgroundColor: "#333",
        justifyContent: "center",
    },
});
