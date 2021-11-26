import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

export interface IIconProps {
    disabled?: boolean;
    iconID: React.ComponentProps<typeof MaterialIcons>["name"];
    text?: string;
}

export function Icon(props: IIconProps) {
    return (
        <View style={styles.container}>
            <MaterialIcons
                name={props.iconID}
                size={26}
                color={props.disabled ? "grey" : "white"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: 40,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        textAlign: "center",
    },
});
