export declare class WatchOptions {
    constructor(levels?: number, properties?: string[]);
    levels: number;
    properties: string[];
}
export declare class Watcher {
    static Watch<Ty>(obj: Ty, options: WatchOptions, listener: (sender: any, property: string, oldval: any, newvalue: any) => any): Ty;
    private static proxyObject<Ty>(obj, currentLevel, maxLevel, properties, listener);
    private static isBasicDataType(obj);
}
