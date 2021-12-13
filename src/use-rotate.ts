import * as ImageManipulator from 'expo-image-manipulator';

export const useRotate = () => {
    return async (uri: string, rotate: number) => {
        const actions: ImageManipulator.Action[] = [
            {
                rotate,
            },
        ]

        const resultRotate = await ImageManipulator.manipulateAsync(
            uri,
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
