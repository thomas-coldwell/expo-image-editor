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
exports.OperationBar = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const Icon_1 = require("./components/Icon");
function OperationBar() {
    //
    const [selectedOperation, setSelectedOperation] = React.useState("transform");
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.opRow}></react_native_1.View>
      <react_native_1.View style={styles.modeRow}>
        <react_native_gesture_handler_1.TouchableOpacity style={[
        styles.modeButton,
        selectedOperation === "transform" && { backgroundColor: "#333" },
    ]} onPress={() => setSelectedOperation("transform")}>
          <Icon_1.Icon iconID="transform" text="Transform"/>
        </react_native_gesture_handler_1.TouchableOpacity>
        <react_native_gesture_handler_1.TouchableOpacity style={[
        styles.modeButton,
        selectedOperation === "adjust" && { backgroundColor: "#333" },
    ]} onPress={() => setSelectedOperation("adjust")}>
          <Icon_1.Icon iconID="tune" text="Adjust"/>
        </react_native_gesture_handler_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.OperationBar = OperationBar;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 140,
        width: "100%",
        backgroundColor: "#333",
    },
    opRow: {
        height: 70,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#333",
    },
    modeRow: {
        height: 70,
        width: react_native_1.Platform.OS == "web" ? "100vw" : "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    modeButton: {
        height: 70,
        width: react_native_1.Platform.OS == "web" ? "50vw" : "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
    },
});
//# sourceMappingURL=OperationBar.js.map