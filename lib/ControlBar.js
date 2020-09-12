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
exports.ControlBar = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const recoil_1 = require("recoil");
const Store_1 = require("./Store");
const IconButton_1 = require("./components/IconButton");
function ControlBar(props) {
    //
    const [editingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    return (<react_native_1.View style={styles.container}>
      <IconButton_1.IconButton iconID="arrow-back" text="Back" onPress={() => props.onPressBack()}/>
      <IconButton_1.IconButton iconID="done" text="Done" onPress={() => props.onFinishEditing()} disabled={editingMode !== "operation-select"}/>
    </react_native_1.View>);
}
exports.ControlBar = ControlBar;
const styles = react_native_1.StyleSheet.create({
    container: {
        width: "100%",
        height: 64,
        backgroundColor: "#333",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
    },
});
//# sourceMappingURL=ControlBar.js.map