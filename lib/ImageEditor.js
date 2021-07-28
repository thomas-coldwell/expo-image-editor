import * as React from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { ControlBar } from "./ControlBar";
import { EditingWindow } from "./EditingWindow";
import * as ImageManipulator from "expo-image-manipulator";
import { Processing } from "./Processing";
import { useRecoilState, RecoilRoot } from "recoil";
import { processingState, imageDataState, editingModeState, readyState, } from "./Store";
import { OperationBar } from "./OperationBar/OperationBar";
import { UniversalModal } from "./UniversalModal";
const noScroll = require("no-scroll");
export const EditorContext = React.createContext({
    throttleBlur: true,
    minimumCropDimensions: {
        width: 0,
        height: 0,
    },
    fixedAspectRatio: 1.6,
    lockAspectRatio: false,
    mode: "full",
    onCloseEditor: () => { },
    onEditingComplete: () => { },
});
function ImageEditorCore(props) {
    //
    const { mode = "full", throttleBlur = true, minimumCropDimensions = { width: 0, height: 0 }, fixedCropAspectRatio: fixedAspectRatio = 1.6, lockAspectRatio = false, allowedTransformOperations, allowedAdjustmentOperations, } = props;
    const [, setImageData] = useRecoilState(imageDataState);
    const [, setReady] = useRecoilState(readyState);
    const [, setEditingMode] = useRecoilState(editingModeState);
    // Initialise the image data when it is set through the props
    React.useEffect(() => {
        const initialise = async () => {
            if (props.imageUri) {
                const enableEditor = () => {
                    setReady(true);
                    // Set no-scroll to on
                    noScroll.on();
                };
                // Platform check
                if (Platform.OS === "web") {
                    let img = document.createElement("img");
                    img.onload = () => {
                        setImageData({
                            uri: props.imageUri ?? "",
                            height: img.height,
                            width: img.width,
                        });
                        enableEditor();
                    };
                    img.src = props.imageUri;
                }
                else {
                    const { width: pickerWidth, height: pickerHeight } = await ImageManipulator.manipulateAsync(props.imageUri, []);
                    setImageData({
                        uri: props.imageUri,
                        width: pickerWidth,
                        height: pickerHeight,
                    });
                    enableEditor();
                }
            }
        };
        initialise();
    }, [props.imageUri]);
    const onCloseEditor = () => {
        // Set no-scroll to off
        noScroll.off();
        props.onCloseEditor();
    };
    React.useEffect(() => {
        // Reset the state of things and only render the UI
        // when this state has been initialised
        if (!props.visible) {
            setReady(false);
        }
        // Check if ther mode is set to crop only if this is the case then set the editingMode
        // to crop
        if (mode === "crop-only") {
            setEditingMode("crop");
        }
    }, [props.visible]);
    return (React.createElement(EditorContext.Provider, { value: {
            mode,
            minimumCropDimensions,
            lockAspectRatio,
            fixedAspectRatio,
            throttleBlur,
            allowedTransformOperations,
            allowedAdjustmentOperations,
            onCloseEditor,
            onEditingComplete: props.onEditingComplete,
        } },
        React.createElement(StatusBar, { hidden: props.visible }),
        props.asView ? (React.createElement(ImageEditorView, { ...props })) : (React.createElement(UniversalModal, { visible: props.visible, presentationStyle: "fullScreen", statusBarTranslucent: true },
            React.createElement(ImageEditorView, { ...props })))));
}
export function ImageEditorView(props) {
    //
    const { mode = "full" } = props;
    const [ready, setReady] = useRecoilState(readyState);
    const [processing, setProcessing] = useRecoilState(processingState);
    return (React.createElement(React.Fragment, null,
        ready ? (React.createElement(View, { style: styles.container },
            React.createElement(ControlBar, null),
            React.createElement(EditingWindow, null),
            mode === "full" && React.createElement(OperationBar, null))) : null,
        processing ? React.createElement(Processing, null) : null));
}
export function ImageEditor(props) {
    return (React.createElement(RecoilRoot, null,
        React.createElement(ImageEditorCore, { ...props })));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
    },
});
