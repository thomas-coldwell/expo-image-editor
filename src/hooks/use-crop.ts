/**
 TODO:
 - calculate origins
 - set dimensions from ratio
 */
import {Image, LayoutRectangle} from "react-native";
import Animated from "react-native-reanimated";
import * as ImageManipulator from "expo-image-manipulator";
import {useRotate} from "./use-rotate";
import {GestureCoordinate, ImageLayout, Ratio} from "../ImageEditor.type";

export const useCrop = (
    uri: string,
    image: ImageLayout,
    crop: LayoutRectangle,
    ratio: Ratio,
    x: GestureCoordinate,
    y: GestureCoordinate,
    scale: Animated.DerivedValue<number>
) => {
    const rotate = useRotate()

    return async () => {
        Image.getSize(uri,
            async (width: number, height: number) => {
                // Calculer taille réduit (device)
                // Multiplier vers taille réelle
                // Bulk manipulation ?
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
                    originX: Math.round(originX),
                    originY: Math.round(originY),
                    width: crop.width,
                    height: crop.height,
                }

                const fromCrop = await ImageManipulator.manipulateAsync(image.uri as string, [
                    {resize: {width: image.width * scale.value, height: image.height * scale.value}},
                    {crop: request},
                    {resize: ratio.finalSize}
                ])

                console.log('Result uri:', fromCrop.uri)
            },
            (error) => {
                console.error('Failed to get image size', error)
            }
        )
    }
}
