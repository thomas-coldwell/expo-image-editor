import React from "react";
import {StyleSheet, Text, TouchableHighlight} from "react-native";

interface Props {
    backgroundColor?: string
    textColor?: string
    text: string
    onPress: () => void
}

export const Button = (props: Props) => {
    const {
        text,
        backgroundColor = '#000',
        textColor = '#FFF',
        onPress,
    } = props

    return (
        <TouchableHighlight
            style={[ styles.button, { backgroundColor } ]}
            underlayColor={backgroundColor}
            onPress={onPress}
        >
            <Text style={[ styles.text, { color: textColor } ]}>
                {text}
            </Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        marginHorizontal: 4,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: "bold"
    }
})
