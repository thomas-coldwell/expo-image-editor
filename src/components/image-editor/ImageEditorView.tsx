import {StyleSheet, View} from "react-native";
import * as React from "react";
import {useRecoilState} from "recoil";
import {ControlBar} from "../control-bar";
import {EditingWindow} from "../window";
import {OperationBar} from "../operation-bar";
import {Processing} from "../processing";
import {processingState, readyState} from "../../store";

export function ImageEditorView() {
    const [ready] = useRecoilState(readyState);
    const [processing] = useRecoilState(processingState);

    return (
        <View style={styles.container}>
            {ready ? (
                <View style={styles.container}>
                    <ControlBar/>
                    <EditingWindow/>
                    <OperationBar/>
                </View>
            ) : null}
            {processing ? <Processing/> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
});
