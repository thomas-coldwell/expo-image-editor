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
const Store_1 = require("../Store");
const recoil_1 = require("recoil");
const OperationSelection_1 = require("./OperationSelection");
const operations = {
    transform: [
        {
            title: "Crop",
            iconID: "crop",
            operationID: "crop",
        },
        {
            title: "Rotate",
            iconID: "rotate-90-degrees-ccw",
            operationID: "rotate",
        },
    ],
    adjust: [
        {
            title: "Blur",
            iconID: "blur-on",
            operationID: "blur",
        },
    ],
};
function OperationBar() {
    //
    const [editingMode] = recoil_1.useRecoilState(Store_1.editingModeState);
    const getOperationWindow = () => {
        switch (editingMode) {
            case "operation-select":
                return <OperationSelection_1.OperationSelection />;
            default:
                return null;
        }
    };
    return (<react_native_1.Animated.View style={styles.container}>
      {getOperationWindow()}
    </react_native_1.Animated.View>);
}
exports.OperationBar = OperationBar;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 160,
        width: "100%",
        backgroundColor: "#333",
    },
});
//# sourceMappingURL=OperationBar.js.map