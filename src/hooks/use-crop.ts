import {Image, LayoutRectangle} from "react-native";
import Animated from "react-native-reanimated";
import * as ImageManipulator from "expo-image-manipulator";
import {GestureCoordinate, ImageLayout, Ratio, RotateValues} from "../ImageEditor.type";
import {ImageResult} from "expo-image-manipulator";

export const useCrop = (
    uri: string,
    image: ImageLayout,
    crop: LayoutRectangle,
    ratio: Ratio,
    x: GestureCoordinate,
    y: GestureCoordinate,
    scale: Animated.DerivedValue<number>,
    rotate: RotateValues
) => {
    return () => {
        return new Promise<ImageResult>(async (resolve, reject) => {
            const fromRotate = await ImageManipulator.manipulateAsync(uri, [{ rotate }])
            return Image.getSize(
                fromRotate.uri,
                async (width: number) => {
                    const factor = width / (image.width * scale.value)

                    let originX: number
                    let originY: number

                    const restH = ((image.height * scale.value) - crop.height) / 2
                    const restW = ((image.width * scale.value) - crop.width) / 2

                    if (y.value === 0) {
                        originY = restH
                    } else if (y.value < 0) {
                        originY = restH + Math.abs(y.value)
                    } else {
                        originY = restH - y.value
                    }

                    if (x.value === 0) {
                        originX = restW
                    } else if (x.value < 0) {
                        originX = restW + Math.abs(x.value)
                    } else {
                        originX = restW - x.value
                    }

                    const request = {
                        originX: Math.round(originX * factor),
                        originY: Math.round(originY * factor),
                        width: crop.width * factor,
                        height: crop.height * factor,
                    }

                    const actions = [
                        {crop: request},
                        {resize: ratio.finalSize}
                    ]

                    const data = await ImageManipulator.manipulateAsync(
                        fromRotate.uri as string,
                        actions,
                        {format: ImageManipulator.SaveFormat.JPEG, compress: 0.75}
                    )

                    resolve(data)
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }
}
