"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebouncedEffect = void 0;
const react_1 = require("react");
exports.useDebouncedEffect = (effect, delay, deps) => {
    const callback = react_1.useCallback(effect, deps);
    react_1.useEffect(() => {
        const handler = setTimeout(() => {
            callback();
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [callback, delay]);
};
//# sourceMappingURL=useDebouncedEffect.js.map