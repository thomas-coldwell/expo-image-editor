import * as React from "react";
import { StyleSheet, View, Text, PixelRatio } from "react-native";
import { useRecoilState } from "recoil";
import { IconButton } from "../components/IconButton";
import {
  editingModeState,
  glContextState,
  glProgramState,
  imageDataState,
  processingState,
} from "../Store";
import { Slider } from "@miblanchard/react-native-slider";

export function Blur() {
  //
  const [, setProcessing] = useRecoilState(processingState);
  const [imageData, setImageData] = useRecoilState(imageDataState);
  const [, setEditingMode] = useRecoilState(editingModeState);
  const [glContext, setGLContext] = useRecoilState(glContextState);
  const [glProgram, setGLProgram] = useRecoilState(glProgramState);

  const [blur, setBlur] = React.useState(1);

  const onClose = () => {
    // If closing reset the image back to its original
    setGLProgram(null);
    setGLContext(null);
    setEditingMode("operation-select");
  };

  React.useEffect(() => {
    const gl = glContext;
    const program = glProgram;
    if (gl !== null && program !== null) {
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
      gl.uniform1i(gl.getUniformLocation(program, "radius"), blur);
      gl.uniform1i(gl.getUniformLocation(program, "pass"), 0);
      // Setup so first pass renders to a texture rather than to canvas
      // Create and bind the framebuffer
      const firstPassTexture = gl.createTexture();
      // Set the active texture to the texture 0 binding (0-30)
      gl.activeTexture(gl.TEXTURE1);
      // Bind the texture to WebGL stating what type of texture it is
      gl.bindTexture(gl.TEXTURE_2D, firstPassTexture);
      // Set some parameters for the texture
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // Then set the data of this texture using texImage2D
      const viewport = gl.getParameter(gl.VIEWPORT);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        viewport[2],
        viewport[3],
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      // attach the texture as the first color attachment
      const attachmentPoint = gl.COLOR_ATTACHMENT0;
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachmentPoint,
        gl.TEXTURE_2D,
        firstPassTexture,
        0
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Actually draw using the shader program we setup!
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
      gl.uniform1i(gl.getUniformLocation(program, "pass"), 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.endFrameEXP();
    }
  }, [blur, glContext, glProgram]);

  if (glContext === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: "center" }]}>
        <Slider
          value={blur}
          onValueChange={(value) => setBlur(value[0])}
          step={1}
          minimumValue={1}
          maximumValue={50}
          minimumTrackTintColor="#00A3FF"
          maximumTrackTintColor="#ccc"
          containerStyle={styles.slider}
          trackStyle={styles.sliderTrack}
          thumbStyle={styles.sliderThumb}
        />
      </View>
      <View style={styles.row}>
        <IconButton iconID="close" text="Cancel" onPress={() => onClose()} />
        <Text style={styles.prompt}>Blur Radius: {blur}</Text>
        <IconButton
          iconID="check"
          text="Done"
          onPress={() => setEditingMode("operation-select")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prompt: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
  row: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  slider: {
    height: 20,
    width: "90%",
    maxWidth: 600,
  },
  sliderTrack: {
    borderRadius: 10,
  },
  sliderThumb: {
    backgroundColor: "#c4c4c4",
  },
});
