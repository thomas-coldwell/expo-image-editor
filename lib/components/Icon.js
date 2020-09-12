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
exports.Icon = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const vector_icons_1 = require("@expo/vector-icons");
function Icon(props) {
    return (<react_native_1.View style={styles.container}>
      <vector_icons_1.MaterialIcons name={props.iconID} size={30} color={props.disabled ? "grey" : "white"}/>
      <react_native_1.Text style={[styles.text, props.disabled && { color: "grey" }]}>
        {props.text}
      </react_native_1.Text>
    </react_native_1.View>);
}
exports.Icon = Icon;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 64,
        width: 64,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    text: {
        color: "#fff",
        textAlign: "center",
    },
});
//# sourceMappingURL=Icon.js.map