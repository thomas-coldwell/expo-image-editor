import React, { useState } from 'react';
import { Image, StyleSheet, LayoutRectangle, View } from 'react-native';
import { ImageCropOverlay } from './ImageCropOverlay';
import { useEditorState } from './EditorStore';

interface EditingWindowProps {
  uri: string | undefined;
  fixedCropAspectRatio: number;
}

function EditingWindow(props: EditingWindowProps) {

  const [state, setState] = useState({
    initialisedCropBounds: false
  });

  const [editorState, setEditorState] = useEditorState();

  const { uri } = props;

  const getImageFrame = async (layout: LayoutRectangle) => {
    // Find the start point of the photo on the screen and its
    // width / height from there
    const editingWindowAspectRatio = layout.height / layout.width;
    let imageActualSize = {
      width: 0,
      height: 0
    };
    await Image.getSize(
      uri as string,
      (width: number, height: number) => {
        imageActualSize.width = width;
        imageActualSize.height = height;
      },
      (error: any) => console.log(error)
    );
    //
    const imageAspectRatio = imageActualSize.height / imageActualSize.width;
    
    let bounds = { x: 0, y: 0, width: 0, height: 0 };
    let imageScaleFactor = 1;
    // Check which is larger 
    if (imageAspectRatio > editingWindowAspectRatio) {
      // Then x is non-zero, y is zero; calculate x...
      bounds.x = (((imageAspectRatio - editingWindowAspectRatio) / (imageAspectRatio)) * layout.width) / 2;
      bounds.width = layout.height / imageAspectRatio;
      bounds.height = layout.height;
      imageScaleFactor = imageActualSize.height / layout.height;
    }
    else {
      // Then y is non-zero, x is zero; calculate y...
      bounds.y = ((1/imageAspectRatio - 1/editingWindowAspectRatio) / (1/imageAspectRatio)) * layout.height / 2;
      bounds.width = layout.width;
      bounds.height = layout.width * imageAspectRatio;
      imageScaleFactor = imageActualSize.width / layout.width;
    }
    setEditorState({
      ...editorState, 
      cropBounds: bounds,
      imageScaleFactor
    });
    setState({...state, initialisedCropBounds: true});
  }

  return(
    <View style={styles.container}>
      <Image style={styles.image}
             source={{ uri }}
             onLayout={({nativeEvent}) => getImageFrame(nativeEvent.layout)} />
      {
        state.initialisedCropBounds ?
          <ImageCropOverlay cropBounds={editorState.cropBounds}
                            fixedAspectRatio={props.fixedCropAspectRatio} />
        :
          null
      }
    </View>
  );

}

export { EditingWindow };

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: 'contain'
  }
})