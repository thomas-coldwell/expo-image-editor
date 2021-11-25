import {StyleSheet, View} from "react-native";
import * as React from "react";
import {useRecoilState} from "recoil";
import {ControlBar} from "../control-bar";
import {EditingWindow} from "../window";
import {OperationBar} from "../operation-bar";
import {Processing} from "../processing";
import {processingState, readyState} from "../../store";
import {ImageEditorProps} from "../../types";

export function ImageEditorView(props: ImageEditorProps) {
    const {mode = "full"} = props;

    const [ready, setReady] = useRecoilState(readyState);
    console.log("ready", ready)
    const [processing, setProcessing] = useRecoilState(processingState);

    return (
        <>
            {ready ? (
                <View style={styles.container}>
                    <ControlBar/>
                    <EditingWindow/>
                    {mode === "full" && <OperationBar/>}
                </View>
            ) : null}
            {processing ? <Processing/> : null}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
    },
});
