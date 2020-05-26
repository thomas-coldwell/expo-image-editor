"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function Processing() {
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ActivityIndicator size="large" color="#ffffff"/>
    </react_native_1.View>);
}
exports.Processing = Processing;
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#33333355',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
//# sourceMappingURL=Processing.js.map