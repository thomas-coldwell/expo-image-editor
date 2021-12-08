import {Ratio} from "./ImageEditor.type";
import {Dimensions} from "react-native";

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
