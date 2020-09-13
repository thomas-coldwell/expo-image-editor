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
const Icon_1 = require("./components/Icon");
const IconButton_1 = require("./components/IconButton");
const operations = {
    transform: [
        {
            title: "Crop",
            iconID: "crop",
        },
        {
            title: "Rotate",
            iconID: "rotate-90-degrees-ccw",
        },
    ],
    adjust: [
        {
            title: "Blur",
            iconID: "blur-on",
        },
    ],
};
function OperationBar() {
    //
    const [selectedOperation, setSelectedOperation] = React.useState("transform");
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ScrollView style={styles.opRow} horizontal>
        {operations[selectedOperation].map((item, index) => (<react_native_1.View style={styles.opContainer}>
            <IconButton_1.IconButton text={item.title} iconID={item.iconID}/>
          </react_native_1.View>))}
      </react_native_1.ScrollView>
      <react_native_1.View style={styles.modeRow}>
        <react_native_1.TouchableOpacity style={[
        styles.modeButton,
        selectedOperation === "transform" && { backgroundColor: "#333" },
    ]} onPress={() => setSelectedOperation("transform")}>
          <Icon_1.Icon iconID="transform" text="Transform"/>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity style={[
        styles.modeButton,
        selectedOperation === "adjust" && { backgroundColor: "#333" },
    ]} onPress={() => setSelectedOperation("adjust")}>
          <Icon_1.Icon iconID="tune" text="Adjust"/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.OperationBar = OperationBar;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 160,
        width: "100%",
        backgroundColor: "#333",
    },
    opRow: {
        flex: 1,
        width: "100%",
        backgroundColor: "#333",
    },
    opContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 16,
    },
    modeRow: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    modeButton: {
        height: 70,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
    },
});
//# sourceMappingURL=OperationBar.js.map