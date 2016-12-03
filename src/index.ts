
export class WatchOptions {
    constructor(levels: number = -1, properties: string[] = []) {
        this.levels = levels;
        this.properties = properties;
    }
    levels: number = -1; //  -1 means no limit
    properties: string[] = []; // array with properties to watch.
}

export class Watcher {

    static Watch<Ty>(obj:Ty, options:WatchOptions, listener: (sender:any, property:string, oldval:any, newvalue:any) => any) :Ty {
        return Watcher.proxyObject(obj, 0, options.levels, options.properties, listener);
    }

    private static proxyObject<Ty>(obj:Ty, currentLevel:number, maxLevel:number, properties:string[], listener: (sender:any, property:string, oldval:any, newvalue:any) => any): Ty{
        
        // If we are attempting to proxy a basic data type, don't bother.
        if ( Watcher.isBasicDataType(obj) ) return obj;
        let getAll = false;
        if (properties.length == 0) {
            getAll = true;
            properties = Object.keys(obj);
        }

        for(let i in properties) {
            if (! Watcher.isBasicDataType( (<any>obj)[properties[i]] ) ) {
                // It's either an array or an object. We need to determine if we are to proxy this object next
                if (currentLevel < maxLevel || maxLevel == -1) {
                    (<any>obj)[properties[i]] = Watcher.proxyObject( (<any>obj)[properties[i]], currentLevel+1, maxLevel, [], listener);
                }
            }
        }

        // Wrap object in a proxy, to capture all requests.
        return new Proxy<Ty>(obj, function(properties:string[], listnr:(sender:any, property:string, oldval:any, newvalue:any) => any) {
            return {
                set: (p:any, k:string, v:any) => {
                    if (properties.length == 0 || properties.indexOf(k) != -1 )
                        listnr(p, k, p[k], v);
                    p[k] = v;
                    return true;
                },
                get: (p:any, k:string) => {
                    switch(k) {
                        case "push":
                        case "splice":
                        case "shift":
                            return (...args:any[]) => {
                                listnr(p, k, undefined, args);

                                p[k].apply(p, args);
                            };
                        case "unshift":
                        case "pop":
                            return (...args:any[]) => {
                                let re = p[k].apply(p, args);
                                listnr(p, k, re, undefined);
                            };
                        default:
                            return p[k];
                    }
                },
                deleteProperty: (p:any, k:string) => {
                    listnr(p, k, p[k], undefined);
                    delete p[k];
                    return true;
                }
            };
        }( getAll ? [] : properties, listener));
    }

    private static isBasicDataType(obj:any) : boolean {
        return (obj instanceof Number || obj instanceof String || obj instanceof Boolean ||
            typeof obj == "number" || typeof obj == "string" || typeof obj == "boolean");
    }
}