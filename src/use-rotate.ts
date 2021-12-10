import * as ImageManipulator from 'expo-image-manipulator';
import {ImageLayout} from "./ImageEditor.type";

export const useRotate = (image: ImageLayout) => {
    return async () => {
        const actions: ImageManipulator.Action[] = [
            {
                rotate: 90,
            },
        ]

        const resultRotate = await ImageManipulator.manipulateAsync(
            image.uri as string,
            actions,
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        )
        return await ImageManipulator.manipulateAsync(
            resultRotate.uri,
            [
                {
                    crop: {
                        originX: 0,
                        originY: 0,
                        width: resultRotate.width - 1,
                        height: resultRotate.height - 1,
                    },
                },
            ],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        )
    }
}
