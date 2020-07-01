"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
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