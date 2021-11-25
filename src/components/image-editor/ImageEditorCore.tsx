const noScroll = require("no-scroll");

import * as React from "react";
import {Platform, StatusBar} from "react-native";
import {useRecoilState} from "recoil";
import * as ImageManipulator from "expo-image-manipulator";
import {editingModeState, imageDataState, readyState} from "../../store";
import {EditorContext} from "../../constants";
import {UniversalModal} from "../modal";
import {ImageEditorProps} from "../../types";
import {ImageEditorView} from "./ImageEditorView";

export const ImageEditorCore = (props: ImageEditorProps) => {
    const {
        mode = "full",
        throttleBlur = true,
        minimumCropDimensions = {width: 0, height: 0},
        fixedCropAspectRatio: fixedAspectRatio = 1.6,
        lockAspectRatio = false,
        allowedTransformOperations,
        allowedAdjustmentOperations,
    } = props;

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
                } else {
                    const {width: pickerWidth, height: pickerHeight} =
                        await ImageManipulator.manipulateAsync(props.imageUri, []);
                    setImageData({
                        uri: props.imageUri,
                        width: pickerWidth,
                        height: pickerHeight,
                    });
                    enableEditor();
                }
            }
        };
        if (props.imageUri && props.visible) {
            void initialise();
        }
    }, [props.imageUri, props.visible]);

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

    return (
        <EditorContext.Provider
            value={{
                mode,
                minimumCropDimensions,
                lockAspectRatio,
                fixedAspectRatio,
                throttleBlur,
                allowedTransformOperations,
                allowedAdjustmentOperations,
                onCloseEditor,
                onEditingComplete: props.onEditingComplete,
            }}
        >
            <StatusBar hidden={props.visible}/>
            {props.asView ? (
                <ImageEditorView {...props} />
            ) : (
                <UniversalModal
                    visible={props.visible}
                    presentationStyle="fullScreen"
                    statusBarTranslucent
                >
                    <ImageEditorView {...props} />
                </UniversalModal>
            )}
        </EditorContext.Provider>
    );
}
