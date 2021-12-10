import * as ImageManipulator from 'expo-image-manipulator';
import {SetStateAction} from "react";
import {ImageLayout} from "../ImageEditor.type";

export const useResize = (baseUri: string, callback: SetStateAction<any>) => {
    return async ({ height, width, uri, } : { height: number, width: number, uri?: string }) => {
        const usedUri = uri || baseUri;
        ImageManipulator.manipulateAsync(
            usedUri,
            [{
                resize: {width, height}
            }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        )
            .then((result) => {
                callback((prev: ImageLayout) => ({ ...prev, ...result }))
            })
    }
}
