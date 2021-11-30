import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps} from "react-native";
import {Icon, IIconProps} from "./Icon";

type IIconButtonProps = IIconProps & TouchableOpacityProps;

export function IconButton(props: IIconButtonProps) {
    const {text, iconID, icon, ...buttonProps} = props;
    const iconProps = {text, icon, iconID, disabled: buttonProps.disabled};
    return (
        <TouchableOpacity {...buttonProps}>
            <Icon {...iconProps} />
        </TouchableOpacity>
    );
}
