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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlBar = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const vector_icons_1 = require("@expo/vector-icons");
function ControlBar(props) {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.TouchableOpacity style={styles.backButton} onPress={() => props.onPressBack()}>
        <vector_icons_1.Ionicons name='md-arrow-back' size={32} color='#fff'/>
      </react_native_1.TouchableOpacity>
      <react_native_1.TouchableOpacity style={styles.backButton} onPress={() => props.onPerformCrop()}>
        <vector_icons_1.Ionicons name='md-checkmark' size={32} color='#fff'/>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
exports.ControlBar = ControlBar;
const styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        backgroundColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backButton: {
        height: 64,
        width: 64,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
//# sourceMappingURL=ControlBar.js.map