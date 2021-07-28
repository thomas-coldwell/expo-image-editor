import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
function Processing() {
    return (React.createElement(View, { style: styles.container },
        React.createElement(ActivityIndicator, { size: "large", color: "#ffffff" })));
}
export { Processing };
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#33333355',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
