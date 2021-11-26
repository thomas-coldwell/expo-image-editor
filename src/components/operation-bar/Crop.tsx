import React, {useContext} from "react";
import {StyleSheet, Text, SafeAreaView, View, TouchableOpacity} from "react-native";
import {useRecoilState} from "recoil";
import {IconButton} from "../icon";
import {cropRatioState, editingModeState} from "../../store";
import {usePerformCrop} from "../../hooks";
import {EditorContext} from "../../constants";

export function Crop() {
    const [ _, setRatio ] = useRecoilState(cropRatioState)
    const [, setEditingMode] = useRecoilState(editingModeState)
    const { availableAspectRatios, lockAspectRatio } = useContext(EditorContext)
    const ratios = lockAspectRatio ? [ lockAspectRatio ] : availableAspectRatios

    const onPerformCrop = usePerformCrop();

    const onPressRatio = (ratio: number) => {
        setRatio(ratio)
    }

    return (
        <SafeAreaView style={styles.container}>
            <IconButton
                iconID="close"
                text="Cancel"
                onPress={() => setEditingMode("operation-select")}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {ratios.map((ratio, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            marginHorizontal: 4,
                        }}
                        onPress={() => onPressRatio(ratio)}
                    >
                        <View
                            style={{
                                width: [1.91, 0.8].includes(ratio) ? 30 * ratio : 30 / ratio,
                                height: 30,
                                borderColor: 'white',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center' }}>
                            {ratio}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
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
