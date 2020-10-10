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
  editingModeState,, glContextState, glProgramState
} from "./Store";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Asset } from "expo-asset";

const vertShader = `
precision highp float;
attribute vec2 position;
varying vec2 uv;
void main () {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * uv, 0, 1);
}`;

const fragShader = `
precision highp float;
precision highp int;
uniform sampler2D texture;
uniform highp float width;
uniform highp float height;
varying vec2 uv;
uniform highp int radius;
uniform highp int pass;
float gauss (float sigma, float x) {
  float g = (1.0/sqrt(2.0*3.142*sigma*sigma))*exp(-0.5*(x*x)/(sigma*sigma));
  return g;
}
void main () {
  float f_radius = float(radius);
  float sigma = ((0.5 * f_radius) + exp(-0.05 * f_radius));
  // Get the color of the fragment pixel
  vec4 color = texture2D(texture, vec2(uv.x, uv.y));
  color *= gauss(sigma, 0.0);
  for (int i = -50; i <= 50; i++) {
    if (i >= -radius && i <= radius) {
      float offset = float(i);
      // Caclulate the current pixel index
      float pixelIndex = 0.0;
      if (pass == 0) {
        pixelIndex = (uv.y) * height;
      }
      else {
        pixelIndex = uv.x * width;
      }
      // Get the neighbouring pixel index
      pixelIndex += offset;
      // Normalise the new index back into the 0.0 to 1.0 range
      if (pass == 0) {
        pixelIndex /= height;
      }
      else {
        pixelIndex /= width;
      }
      // Pad the UV 
      if (pixelIndex < 0.0) {
        pixelIndex = 0.0;
      }
      if (pixelIndex > 1.0) {
        pixelIndex = 1.0;
      }
      // Get gaussian amplitude
      float g = gauss(sigma, offset);
      // Get the color of neighbouring pixel
      vec4 previousColor = vec4(0.0, 0.0, 0.0, 0.0);
      if (pass == 0) {
        previousColor = texture2D(texture, vec2(uv.x, pixelIndex)) * g;
      }
      else {
        previousColor = texture2D(texture, vec2(pixelIndex, uv.y)) * g;
      }
      color += previousColor;
    }
  }
  // Return the resulting color
  gl_FragColor = color;
}`;

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
  const [glProgram, setGLProgram] = useRecoilState(glProgramState);

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
    // Load in the asset and get its height and width
    let asset = Asset.fromURI(imageData.uri);
    await asset.downloadAsync();
    asset.height = imageData.height;
    asset.width = imageData.width;
    if (asset.width && asset.height) {
      // Setup the shaders for our GL context so it draws from texImage2D
      const vert = gl.createShader(gl.VERTEX_SHADER);
      const frag = gl.createShader(gl.FRAGMENT_SHADER);
      if (vert && frag) {
        // Set the source of the shaders and compile them
        gl.shaderSource(vert, vertShader);
        gl.compileShader(vert);
        gl.shaderSource(frag, fragShader);
        gl.compileShader(frag);
        // Create a WebGL program so we can link the shaders together
        const program = gl.createProgram();
        if (program) {
          // Attach both the vertex and frag shader to the program
          gl.attachShader(program, vert);
          gl.attachShader(program, frag);
          // Link the program - ensures that vetex and frag shaders are compatible
          // with each other
          gl.linkProgram(program);
          // Tell GL we ant to now use this program
          gl.useProgram(program);
          // Create a buffer on the GPU and assign its type as array buffer
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          // Create the verticies for WebGL to form triangles on the screen
          // using the vertex shader which forms a square or rectangle in this case
          const verts = new Float32Array([
            -1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            -1,
            1,
            1,
            1,
          ]);
          // Actually pass the verticies into the buffer and tell WebGL this is static
          // for optimisations
          gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
          // Get the index in memory for the position attribute defined in the
          // vertex shader
          const positionAttrib = gl.getAttribLocation(program, "position");
          gl.enableVertexAttribArray(positionAttrib); // Enable it i guess
          // Tell the vertex shader how to process this attribute buffer
          gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
          // Fetch an expo asset which can passed in as the source for the
          // texImage2D

          // Create some space in memory for a texture
          const texture = gl.createTexture();
          // Set the active texture to the texture 0 binding (0-30)
          gl.activeTexture(gl.TEXTURE0);
          // Bind the texture to WebGL stating what type of texture it is
          gl.bindTexture(gl.TEXTURE_2D, texture);
          // Set some parameters for the texture
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          // Then set the data of this texture using texImage2D
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            asset as any
          );
          console.log(asset);
          // Set a bunch of uniforms we want to pass into our fragement shader
          gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
          gl.uniform1f(gl.getUniformLocation(program, "width"), asset.width);
          gl.uniform1f(gl.getUniformLocation(program, "height"), asset.height);
          setGLContext(gl);
          setGLProgram(program);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {usesGL ? (
        <View style={styles.glContainer}>
          <GLView
            onLayout={({nativeEvent: { layout }}) => console.log(layout, PixelRatio.get())}
            style={{
              height: "100%",
              aspectRatio: imageData.width / imageData.height,
              backgroundColor: "#ccc",
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
    transform: [{ scaleX: -1 }],
  },
});
