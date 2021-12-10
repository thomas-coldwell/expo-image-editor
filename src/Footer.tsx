import React, {ReactElement} from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Ratio} from "./ImageEditor.type";
import {RATIOS} from "./ImageEditor.constant";

interface Props {
    usedRatio: Ratio,
    onChangeUsedRatio: (ratio: Ratio) => void,
    RenderRotateComponent: ReactElement | null
    onRotate: () => void
}

export const Footer = React.memo(
    ({usedRatio, onChangeUsedRatio, RenderRotateComponent, onRotate}: Props) => (
        <View style={styles.footer}>
            <View style={styles.ratioWrapper}>
                {RATIOS.map((ratio, index) => {
                    return (
                        <TouchableHighlight
                            key={'ratio-' + index}
                            style={styles.ratioItem}
                            underlayColor={'#000000'}
                            onPress={() => onChangeUsedRatio(ratio)}
                        >
                            <>
                                <Text
                                    style={[
                                        styles.label,
                                        {...(ratio.value === usedRatio.value && styles.selectedLabel)}
                                    ]}
                                >
                                    {ratio.label}
                                </Text>
                                <View
                                    style={[
                                        styles.ratio,
                                        ratio.exampleSize,
                                        {...(ratio.value === usedRatio.value && styles.selectedRatio)}
                                    ]}
                                />
                            </>
                        </TouchableHighlight>
                    )
                })}
            </View>
            <TouchableHighlight
                underlayColor={'#000000'}
                onPress={onRotate}
            >
                {RenderRotateComponent}
            </TouchableHighlight>
        </View>
    )
)

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    ratioWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    ratioItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 4,
        color: '#868686'
    },
    selectedLabel: {
        color: '#FFFFFF'
    },
    ratio: {
        backgroundColor: '#101010',
        borderColor: '#868686',
        borderWidth: .5,
        borderRadius: 2,
    },
    selectedRatio: {
        borderColor: '#FFFFFF',
    }
})
