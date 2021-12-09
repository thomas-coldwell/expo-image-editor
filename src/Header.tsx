import React, {ReactElement} from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Translations} from "./ImageEditor.type";

interface Props {
    translations: Translations
    RenderBackIcon: ReactElement | null
    RenderCheckIcon: ReactElement | null
    onClose: () => void
}

export const Header = ({ translations, RenderBackIcon, RenderCheckIcon, onClose }: Props) => {
    return (
        <View style={styles.header}>
            <TouchableHighlight
                style={styles.button}
                underlayColor={'#000000'}
                onPress={onClose}
            >
                <>
                    {RenderBackIcon}
                    <Text style={styles.backLabel}>
                        {translations.back}
                    </Text>
                </>
            </TouchableHighlight>
            <TouchableHighlight
                style={[styles.button, styles.validate]}
                underlayColor={'#000000'}
            >
                <>
                    <Text style={styles.validateLabel}>
                        {translations.validate}
                    </Text>
                    {RenderCheckIcon}
                </>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        height: 48,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 8,
    },
    validate: {
        height: 24,
        width: 79,
        backgroundColor: '#0028FF',
        borderRadius: 50,
        alignItems: 'center',
    },
    validateLabel: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 12,
        marginRight: 4,
    }
})
