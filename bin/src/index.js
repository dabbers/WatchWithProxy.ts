"use strict";
class WatchOptions {
    constructor() {
        this.levels = -1;
        this.properties = [];
    }
}
exports.WatchOptions = WatchOptions;
class Watcher {
    static Watch(obj, options, listener) {
        return Watcher.proxyObject(obj, 0, options.levels, options.properties, listener);
    }
    static proxyObject(obj, currentLevel, maxLevel, properties, listener) {
        if (Watcher.isBasicDataType(obj))
            return obj;
        let getAll = false;
        if (properties.length == 0) {
            getAll = true;
            properties = Object.keys(obj);
        }
        for (let i in properties) {
            if (!Watcher.isBasicDataType(obj[properties[i]])) {
                if (currentLevel < maxLevel || maxLevel == -1) {
                    obj[properties[i]] = Watcher.proxyObject(obj[properties[i]], currentLevel + 1, maxLevel, [], listener);
                }
            }
        }
        return new Proxy(obj, function (properties, listnr) {
            return {
                set: (p, k, v) => {
                    if (properties.length == 0 || properties.indexOf(k) != -1)
                        listnr(p, k, p[k], v);
                    p[k] = v;
                    return true;
                },
                get: (p, k) => {
                    switch (k) {
                        case "push":
                        case "splice":
                        case "shift":
                            return (...args) => {
                                listnr(p, k, undefined, args);
                                p[k].apply(p, args);
                            };
                        case "unshift":
                        case "pop":
                            return (...args) => {
                                let re = p[k].apply(p, args);
                                listnr(p, k, re, undefined);
                            };
                        default:
                            return p[k];
                    }
                },
                deleteProperty: (p, k) => {
                    listnr(p, k, p[k], undefined);
                    delete p[k];
                    return true;
                }
            };
        }(getAll ? [] : properties, listener));
    }
    static isBasicDataType(obj) {
        return (obj instanceof Number || obj instanceof String || obj instanceof Boolean ||
            typeof obj == "number" || typeof obj == "string" || typeof obj == "boolean");
    }
}
exports.Watcher = Watcher;
//# sourceMappingURL=index.js.map