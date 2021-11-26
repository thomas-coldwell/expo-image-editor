import React, {useContext} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {useRecoilState} from "recoil";
import {cropRatioState} from "../../store";
import {usePerformCrop} from "../../hooks";
import {EditorContext, HumanReadabilityRatio} from "../../constants";
import {OperationBarSelectedFooter} from "../operation-bar-selected-footer";

export function Crop() {
    const [_, setRatio] = useRecoilState(cropRatioState)
    const {availableAspectRatios, lockAspectRatio} = useContext(EditorContext)
    const ratios = lockAspectRatio ? [lockAspectRatio] : availableAspectRatios

    const onPerformCrop = usePerformCrop();

    const onPressRatio = (ratio: number) => {
        setRatio(ratio)
    }

    const onValidate = () => {
        return onPerformCrop()
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
                                {width: [1.91, 0.8].includes(ratio) ? 30 * ratio : 30 / ratio}
                            ]}
                        />
                        <Text style={styles.ratioText}>
                            {
                                // @ts-ignore
                                HumanReadabilityRatio[ratio]
                            }
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <OperationBarSelectedFooter onValidate={onValidate}/>
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
});
