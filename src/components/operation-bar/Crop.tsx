import React, {useContext} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {useRecoilState} from "recoil";
import {cropRatioState, editingModeState} from "../../store";
import {usePerformCrop} from "../../hooks";
import {EditorContext} from "../../constants";
import {Button} from "../button";

export function Crop() {
    const [ _, setRatio ] = useRecoilState(cropRatioState)
    const [, setEditingMode] = useRecoilState(editingModeState)
    const { availableAspectRatios, lockAspectRatio } = useContext(EditorContext)
    const ratios = lockAspectRatio ? [ lockAspectRatio ] : availableAspectRatios

    const onPerformCrop = usePerformCrop();

    const onPressRatio = (ratio: number) => {
        setRatio(ratio)
    }

    const onValidate = () => {
        return onPerformCrop()
    }

    const onCancel = () => {
        setEditingMode("operation-select")
    }

    return (
        <>
            <View style={styles.ratios}>
                {ratios.map((ratio, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            marginHorizontal: 4,
                        }}
                        onPress={() => onPressRatio(ratio)}
                    >
                        <View
                            style={[
                                styles.ratio,
                                { width: [1.91, 0.8].includes(ratio) ? 30 * ratio : 30 / ratio }
                            ]}
                        />
                        <Text style={styles.ratioText}>
                            {ratio}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.footer}>
                <Button
                    text={'Annuler'}
                    backgroundColor={'#FFF'}
                    textColor={'#0028FF'}
                    onPress={onCancel}
                />
                <Button
                    text={'Valider'}
                    backgroundColor={'#0028FF'}
                    onPress={onValidate}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    ratios: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        height: 50,
    },
    ratio: {
        height: 30,
        borderColor: 'white',
        borderWidth: 1,
    },
    ratioText: {
        color: 'white',
        fontSize: 12,
        alignSelf: 'center'
    },
    footer: {
        paddingTop: 8,
        paddingHorizontal: 4,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
});
