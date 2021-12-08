import * as React from "react";
import {Modal, StatusBar} from "react-native";
import {useRecoilState} from "recoil";
import * as ImageManipulator from "expo-image-manipulator";
import {imageDataState, readyState} from "../../store";
import {EditorContext} from "../../constants";
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
        availableAspectRatios = [1],
        dimensionByAspectRatios = [{height: 1600, width: 1600}],
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
                const {
                    width: pickerWidth,
                    height: pickerHeight
                } = await ImageManipulator.manipulateAsync(props.imageUri, []);
                setImageData({uri: props.imageUri, width: pickerWidth, height: pickerHeight,});
                setReady(true);
            }
        };
        if (props.imageUri) {
            void initialise()
        }
    }, [props.imageUri, props.visible]);

    const onCloseEditor = () => {
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
            <Modal
                visible={props.visible}
                animationType={"slide"}
                presentationStyle="fullScreen"
                statusBarTranslucent
            >
                <ImageEditorView />
            </Modal>
        </EditorContext.Provider>
    );
}
