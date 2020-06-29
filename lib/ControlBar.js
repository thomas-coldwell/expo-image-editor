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
      <Button iconID='md-arrow-back' source='ion' onPress={() => props.onPressBack()}/>
      {props.mode == 'operation-select' ?
        <react_native_1.View style={styles.buttonRow}>
            <Button iconID='crop' source='md' onPress={() => props.onChangeMode('crop')}/>
            <Button iconID='rotate-left' source='md' onPress={() => props.onRotate(-90)}/>
            <Button iconID='rotate-right' source='md' onPress={() => props.onRotate(90)}/>
          </react_native_1.View>
        :
            <Button iconID='md-checkmark' source='ion' onPress={() => props.onPerformCrop()}/>}
    </react_native_1.View>);
}
exports.ControlBar = ControlBar;
function Button(props) {
    return (<react_native_1.TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
      {props.source == 'ion' ?
        <vector_icons_1.Ionicons name={props.iconID} size={32} color='#fff'/>
        :
            <vector_icons_1.MaterialIcons name={props.iconID} size={32} color='#fff'/>}
    </react_native_1.TouchableOpacity>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        backgroundColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        height: 64,
        width: 64,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonRow: {
        flexShrink: 1,
        flexDirection: 'row'
    }
});
//# sourceMappingURL=ControlBar.js.map