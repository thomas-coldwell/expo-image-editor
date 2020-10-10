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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blur = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const IconButton_1 = require("../components/IconButton");
const Store_1 = require("../Store");
const react_native_slider_1 = require("@miblanchard/react-native-slider");
function Blur() {
    //
    const [, setProcessing] = recoil_1.useRecoilState(Store_1.processingState);
    const [imageData, setImageData] = recoil_1.useRecoilState(Store_1.imageDataState);
    const [, setEditingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const [glContext, setGLContext] = recoil_1.useRecoilState(Store_1.glContextState);
    const [glProgram, setGLProgram] = recoil_1.useRecoilState(Store_1.glProgramState);
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
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, viewport[2], viewport[3], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            // attach the texture as the first color attachment
            const attachmentPoint = gl.COLOR_ATTACHMENT0;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, firstPassTexture, 0);
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
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={[styles.row, { justifyContent: "center" }]}>
        <react_native_slider_1.Slider value={blur} onValueChange={(value) => setBlur(value[0])} step={1} minimumValue={1} maximumValue={50} minimumTrackTintColor="#00A3FF" maximumTrackTintColor="#ccc" containerStyle={styles.slider} trackStyle={styles.sliderTrack} thumbStyle={styles.sliderThumb}/>
      </react_native_1.View>
      <react_native_1.View style={styles.row}>
        <IconButton_1.IconButton iconID="close" text="Cancel" onPress={() => onClose()}/>
        <react_native_1.Text style={styles.prompt}>Blur Radius: {blur}</react_native_1.Text>
        <IconButton_1.IconButton iconID="check" text="Done" onPress={() => setEditingMode("operation-select")}/>
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
//# sourceMappingURL=Blur.js.map