import * as React from "react";
import {StyleSheet, Text, SafeAreaView, View} from "react-native";
import {useRecoilState} from "recoil";
import {IconButton} from "../icon";
import {editingModeState} from "../../store";
import {usePerformCrop} from "../../hooks";

const ratios = [ 1.91, 1, 0.8 ]

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {ratios.map((ratio, index) => (
                    <View
                        key={index}
                        style={{
                            marginHorizontal: 4,
                        }}
                    >
                        <View
                            style={{
                                width: ratio !== 1.91 ? 30 / ratio : 30 * ratio,
                                height: 30,
                                borderColor: 'white',
                                borderWidth: 1,
                            }}
                        />
                        <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center' }}>
                            {ratio}
                        </Text>
                    </View>
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
