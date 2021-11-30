const noScroll = require("no-scroll");

import * as React from "react";
import {Platform, StatusBar} from "react-native";
import {useRecoilState} from "recoil";
import * as ImageManipulator from "expo-image-manipulator";
import {imageDataState, readyState} from "../../store";
import {EditorContext} from "../../constants";
import {UniversalModal} from "../modal";
import {ImageEditorProps} from "../../types";
import {ImageEditorView} from "./ImageEditorView";

export const ImageEditorCore = (props: ImageEditorProps) => {
    const {
        cropIcon = undefined,
        doneIcon = undefined,
        backIcon = undefined,
        rotateIcon = undefined,
        rotateRightIcon = undefined,
        rotateLeftIcon = undefined,
        availableAspectRatios = [ 1 ],
        dimensionByAspectRatios = [ { height: 1600, width: 1600 } ],
        lockAspectRatio = undefined,
        translations = {
            cancel: 'Cancel',
            validate: 'Validate'
        }
    } = props;

    const [, setImageData] = useRecoilState(imageDataState);
    const [, setReady] = useRecoilState(readyState);

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
        if (props.imageUri) {
            void initialise()
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
    }, [props.visible]);

    return (
        <EditorContext.Provider
            value={{
                backIcon,
                cropIcon,
                doneIcon,
                rotateIcon,
                rotateLeftIcon,
                rotateRightIcon,
                lockAspectRatio,
                availableAspectRatios,
                dimensionByAspectRatios,
                translations,
                onCloseEditor,
                onEditingComplete: props.onEditingComplete,
            }}
        >
            <StatusBar hidden={props.visible}/>
            <UniversalModal
                visible={props.visible}
                animationType={"slide"}
                presentationStyle="fullScreen"
                statusBarTranslucent
            >
                <ImageEditorView />
            </UniversalModal>
        </EditorContext.Provider>
    );
}
