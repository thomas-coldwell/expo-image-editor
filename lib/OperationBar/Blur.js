"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blur = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const IconButton_1 = require("../components/IconButton");
const Store_1 = require("../Store");
const react_native_slider_1 = require("@miblanchard/react-native-slider");
const expo_asset_1 = require("expo-asset");
const expo_gl_1 = require("expo-gl");
const ImageManinpulator = __importStar(require("expo-image-manipulator"));
const FileSystem = __importStar(require("expo-file-system"));
const lodash_1 = require("lodash");
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
uniform highp float pixelFrequency;
float gauss (float sigma, float x) {
  float g = (1.0/sqrt(2.0*3.142*sigma*sigma))*exp(-0.5*(x*x)/(sigma*sigma));
  return g;
}
void main () {
  float f_radius = float(radius);
  float sigma = (0.5 * f_radius);
  // Get the color of the fragment pixel
  vec4 color = texture2D(texture, vec2(uv.x, uv.y));
  color *= gauss(sigma, 0.0);
  // Loop over the neightbouring pixels
  for (int i = -30; i <= 30; i++) {
    // Make sure we don't include the main pixel which we already sampled!
    if (i != 0) {
      // Check we are on an index that doesn't exceed the blur radius specified
      if (i >= -radius && i <= radius) {
        float index = float(i);
        // Caclulate the current pixel index
        float pixelIndex = 0.0;
        if (pass == 0) {
          pixelIndex = (uv.y) * height;
        }
        else {
          pixelIndex = uv.x * width;
        }
        // Get the neighbouring pixel index
        float offset = index * pixelFrequency;
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
        float g = gauss(sigma, index);
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
  }
  // Return the resulting color
  gl_FragColor = color;
}`;
function Blur() {
    //
    const [, setProcessing] = recoil_1.useRecoilState(Store_1.processingState);
    const [imageData, setImageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [, setEditingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const [glContext, setGLContext] = recoil_1.useRecoilState(Store_1.glContextState);
    const [imageBounds] = recoil_1.useRecoilState(Store_1.imageBoundsState);
    const [throttleBlur] = recoil_1.useRecoilState(Store_1.throttleBlurState);
    const [sliderValue, setSliderValue] = React.useState(15);
    const [blur, setBlur] = React.useState(15);
    const [glProgram, setGLProgram] = React.useState(null);
    const onClose = () => {
        // If closing reset the image back to its original
        setGLContext(null);
        setEditingMode("operation-select");
    };
    const onSaveWithBlur = () => __awaiter(this, void 0, void 0, function* () {
        // Set the processing to true so no UI can be interacted with
        setProcessing(true);
        // Take a snapshot of the GLView's current framebuffer and set that as the new image data
        const gl = glContext;
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        const output = yield expo_gl_1.GLView.takeSnapshotAsync(gl);
        // Do any addtional platform processing of the result and set it as the
        // new image data
        if (react_native_1.Platform.OS === "web") {
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(output.uri);
            fileReaderInstance.onload = () => __awaiter(this, void 0, void 0, function* () {
                const base64data = fileReaderInstance.result;
                const flippedOutput = yield ImageManinpulator.manipulateAsync(base64data, [{ flip: ImageManinpulator.FlipType.Vertical }]);
                setImageData({
                    uri: flippedOutput.uri,
                    width: flippedOutput.width,
                    height: flippedOutput.height,
                });
            });
        }
        else {
            const flippedOutput = yield ImageManinpulator.manipulateAsync(output.uri, [{ flip: ImageManinpulator.FlipType.Vertical }]);
            setImageData({
                uri: flippedOutput.uri,
                width: flippedOutput.width,
                height: flippedOutput.height,
            });
        }
        // Reset back to operation selection mode
        setProcessing(false);
        setGLContext(null);
        // Small timeout so it can set processing state to flase BEFORE
        // Blur component is unmounted...
        setTimeout(() => {
            setEditingMode("operation-select");
        }, 100);
    });
    React.useEffect(() => {
        if (glContext !== null) {
            const setupGL = () => __awaiter(this, void 0, void 0, function* () {
                // Load in the asset and get its height and width
                const gl = glContext;
                // Do some magic instead of using asset.download async as this tries to
                // redownload the file:// uri on android and iOS
                let asset;
                if (react_native_1.Platform.OS !== "web") {
                    asset = {
                        uri: imageData.uri,
                        localUri: imageData.uri,
                        height: imageData.height,
                        width: imageData.width,
                    };
                    yield FileSystem.copyAsync({
                        from: asset.uri,
                        to: FileSystem.cacheDirectory + "blur.jpg",
                    });
                    asset.localUri = FileSystem.cacheDirectory + "blur.jpg";
                }
                else {
                    asset = expo_asset_1.Asset.fromURI(imageData.uri);
                    yield asset.downloadAsync();
                }
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
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset);
                            // Set a bunch of uniforms we want to pass into our fragment shader
                            gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
                            gl.uniform1f(gl.getUniformLocation(program, "width"), asset.width);
                            gl.uniform1f(gl.getUniformLocation(program, "height"), asset.height);
                            // Calculate the pixel frequency to sample at based on the image resolution
                            // as the blur radius is in dp
                            const pixelFrequency = Math.max(Math.round(imageData.width / imageBounds.width / 2), 1);
                            gl.uniform1f(gl.getUniformLocation(program, "pixelFrequency"), pixelFrequency);
                            setGLProgram(program);
                        }
                    }
                }
            });
            setupGL().catch((e) => console.error(e));
        }
    }, [glContext, imageData]);
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
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            // attach the texture as the first color attachment
            const attachmentPoint = gl.COLOR_ATTACHMENT0;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, firstPassTexture, 0);
            //gl.viewport(0, 0, imageData.width, imageData.height);
            // Actually draw using the shader program we setup!
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            //gl.viewport(0, 0, imageData.width, imageData.height);
            gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
            gl.uniform1i(gl.getUniformLocation(program, "pass"), 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.endFrameEXP();
        }
    }, [blur, glContext, glProgram]);
    const throttleSliderBlur = React.useRef(lodash_1.throttle((value) => setBlur(value), 50, { leading: true })).current;
    React.useEffect(() => {
        return () => { };
    });
    if (glContext === null) {
        return null;
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[styles.row, { justifyContent: "center" }]}>
        <react_native_slider_1.Slider value={sliderValue} onValueChange={(value) => {
        setSliderValue(value[0]);
        if (throttleBlur) {
            throttleSliderBlur(Math.round(value[0]));
        }
        else {
            setBlur(Math.round(value[0]));
        }
    }} minimumValue={1} maximumValue={30} minimumTrackTintColor="#00A3FF" maximumTrackTintColor="#ccc" thumbTintColor="#c4c4c4" containerStyle={styles.slider} trackStyle={styles.sliderTrack}/>
      </react_native_1.View>
      <react_native_1.View style={styles.row}>
        <IconButton_1.IconButton iconID="close" text="Cancel" onPress={() => onClose()}/>
        <react_native_1.Text style={styles.prompt}>
          Blur Radius: {Math.round(sliderValue)}
        </react_native_1.Text>
        <IconButton_1.IconButton iconID="check" text="Done" onPress={() => onSaveWithBlur()}/>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.Blur = Blur;
const styles = react_native_1.StyleSheet.create({
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
        paddingHorizontal: "2%",
    },
    slider: {
        height: 20,
        width: "90%",
        maxWidth: 600,
    },
    sliderTrack: {
        borderRadius: 10,
    },
});
//# sourceMappingURL=Blur.js.map