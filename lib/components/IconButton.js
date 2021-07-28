import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "./Icon";
export function IconButton(props) {
    const { text, iconID, ...buttonProps } = props;
    const iconProps = { text, iconID, disabled: buttonProps.disabled };
    return (React.createElement(TouchableOpacity, { ...buttonProps },
        React.createElement(Icon, { ...iconProps })));
}
