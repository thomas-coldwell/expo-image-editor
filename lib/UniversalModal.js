import React from "react";
import { Modal as RNModal, Platform } from "react-native";
//@ts-ignore
import WebModal from "modal-enhanced-react-native-web";
export const UniversalModal = (props) => {
    if (Platform.OS === "web") {
        return (React.createElement(WebModal, { isVisible: props.visible, style: { margin: 0 } }, props.children));
    }
    return React.createElement(RNModal, { ...props });
};
