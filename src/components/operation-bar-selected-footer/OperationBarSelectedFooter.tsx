import React from "react";
import {StyleSheet, View} from "react-native";
import {useRecoilState} from "recoil";
import {Button} from "../button";
import {EditorContext} from "../../constants";
import {editingModeState} from "../../store";

interface Props {
    onCancel?: () => void
    onValidate: () => void
}

export const OperationBarSelectedFooter = (props: Props) => {
    const [_ , setEditingMode] = useRecoilState(editingModeState)
    const {translations} = React.useContext(EditorContext)

    const onCancel = () => {
        props.onCancel?.()
        setEditingMode("operation-select")
    }

    return (
        <View style={styles.footer}>
            <Button
                text={translations?.cancel as string}
                backgroundColor={'#FFF'}
                textColor={'#0028FF'}
                onPress={onCancel}
            />
            <Button
                text={translations?.validate as string}
                backgroundColor={'#0028FF'}
                onPress={props.onValidate}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    footer: {
        padding: 8,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
})
