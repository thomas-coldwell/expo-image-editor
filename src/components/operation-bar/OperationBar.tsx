import * as React from "react";
import {SafeAreaView, View} from "react-native";
import {useRecoilState} from "recoil";
import {editingModeState} from "../../store";
import {OperationSelection} from "./OperationSelection";
import {Crop} from "./Crop";
import {Rotate} from "./Rotate";

export function OperationBar() {
    const [editingMode] = useRecoilState(editingModeState);

    const getOperationWindow = () => {
        switch (editingMode) {
            case "crop":
                return <Crop/>;
            case "rotate":
                return <Rotate/>;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView>
            {editingMode === "operation-select" && (
                <OperationSelection/>
            )}
            {editingMode !== "operation-select" && (
                <View>
                    {getOperationWindow()}
                </View>
            )}
        </SafeAreaView>
    );
}
