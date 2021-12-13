import {Ratio} from "./ImageEditor.type";
import {Dimensions, Platform} from "react-native";

export const RATIOS: Ratio[] = [
    {
        value: 0.8,
        label: '4:5',
        exampleSize: { height: 30, width: 24 }
    },
    {
        value: 1,
        label: '1:1',
        exampleSize: { height: 24, width: 24}
    },
    {
        value: 1.91,
        label: '1.91:1',
        exampleSize: { height: 16, width: 34 }
    }
]

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const IS_IOS = Platform.OS === 'ios';
export const PRESENTATION_STYLE = IS_IOS ? 'pageSheet' : 'overFullScreen'
export const INITIAL_LAYOUT = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
}
