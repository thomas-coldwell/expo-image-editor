import * as React from "react";
import {
  Image,
  StyleSheet,
  LayoutRectangle,
  View,
  PixelRatio,
} from "react-native";
import { ImageCropOverlay } from "./ImageCropOverlay";
import { useRecoilState } from "recoil";
import {
  imageDataState,
  imageBoundsState,
  imageScaleFactorState,
  editingModeState,
  glContextState,
  glProgramState,
} from "./Store";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Asset } from "expo-asset";

function EditingWindow() {
  //
  const [state, setState] = React.useState({
    imageScaleFactor: null,
    imageLayout: {
      height: null,
      width: null,
    },
  });

  const [imageData] = useRecoilState(imageDataState);
  const [, setImageBounds] = useRecoilState(imageBoundsState);
  const [, setImageScaleFactor] = useRecoilState(imageScaleFactorState);
  const [editingMode] = useRecoilState(editingModeState);
  const [glContext, setGLContext] = useRecoilState(glContextState);

  const isCropping = editingMode === "crop";
  const isBlurring = editingMode === "blur";

  const usesGL = isBlurring;

  const getImageFrame = (layout: {
    width: number;
    height: number;
    [key: string]: any;
  }) => {
    onUpdateCropLayout(layout);
  };

  const onUpdateCropLayout = (layout) => {
    // Check layout is not null
    if (layout.height != null && layout.width != null) {
      // Find the start point of the photo on the screen and its
      // width / height from there
      const editingWindowAspectRatio = layout.height / layout.width;
      //
      const imageAspectRatio = imageData.height / imageData.width;
      let bounds = { x: 0, y: 0, width: 0, height: 0 };
      let imageScaleFactor = 1;
      // Check which is larger
      if (imageAspectRatio > editingWindowAspectRatio) {
        // Then x is non-zero, y is zero; calculate x...
        bounds.x =
          (((imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio) *
            layout.width) /
          2;
        bounds.width = layout.height / imageAspectRatio;
        bounds.height = layout.height;
        imageScaleFactor = imageData.height / layout.height;
      } else {
        // Then y is non-zero, x is zero; calculate y...
        bounds.y =
          (((1 / imageAspectRatio - 1 / editingWindowAspectRatio) /
            (1 / imageAspectRatio)) *
            layout.height) /
          2;
        bounds.width = layout.width;
        bounds.height = layout.width * imageAspectRatio;
        imageScaleFactor = imageData.width / layout.width;
      }
      setImageBounds(bounds);
      setImageScaleFactor(imageScaleFactor);
      setState({
        ...state,
        imageScaleFactor,
        imageLayout: {
          height: layout.height,
          width: layout.width,
        },
      });
    }
  };

  React.useEffect(() => {
    onUpdateCropLayout(state.imageLayout);
  }, [imageData]);

  const onGLContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    setGLContext(gl);
  };

  return (
    <View style={styles.container}>
      {usesGL ? (
        <View style={styles.glContainer}>
          <GLView
            style={{
              height: "100%",
              width:
                state.imageLayout.height * (imageData.width / imageData.height),
              transform: [{ scaleY: -1 }],
            }}
            onContextCreate={onGLContextCreate}
          />
        </View>
      ) : (
        <Image
          style={styles.image}
          source={{ uri: imageData.uri }}
          onLayout={({ nativeEvent }) => getImageFrame(nativeEvent.layout)}
        />
      )}
      {isCropping && state.imageLayout.height != null ? (
        <ImageCropOverlay />
      ) : null}
    </View>
  );
}

export { EditingWindow };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  glContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
