import React from "react";
import {StyleSheet, View} from "react-native";
import {BORDER_WIDTH, CROP_AREA_CELL_SIZE} from "../ImageEditor.constant";
import {Ratio} from "../ImageEditor.type";

interface Props {
    ratio: Ratio
    withoutVBorder?: boolean
    withoutHBorder?: boolean
    withoutTBorder?: boolean
    withoutBBorder?: boolean
}

export const CropAreaRow = (props: Props) => {
    const {ratio, withoutVBorder, withoutBBorder, withoutTBorder} = props;

    const height = React.useMemo(() => {
        return CROP_AREA_CELL_SIZE / ratio.value
    }, [ratio])

    return (
        <View style={styles.row}>
            {Array.from(Array(3)).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.item,
                        {
                            height,
                            borderTopWidth: !withoutVBorder && !withoutTBorder ? BORDER_WIDTH : 0,
                            borderBottomWidth: !withoutVBorder && !withoutBBorder ? BORDER_WIDTH : 0,
                            borderLeftWidth: [0, 1].includes(index) ? 0 : BORDER_WIDTH,
                            borderRightWidth: [1, 2].includes(index) ? 0 : BORDER_WIDTH,

                        },
                    ]}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    item: {
        borderColor: '#FFFFFF',
        width: CROP_AREA_CELL_SIZE
    },
})
