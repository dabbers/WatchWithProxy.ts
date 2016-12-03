# WatchWithProxy.ts
This small library, written in Typescript, uses the Proxy object from ecma6 to monitor objects for changes. It then signals a function with the details of the change. 

The class itself is fairly simple. It's similar to Watch.js, but written in Typescript, uses Proxies, and doesn't rely on timers to get the addition of new properties. This class is much lighter than Watch.js.

## Usage

```
import * as WatchWithProxy from '../src/';

let options = new WatchWithProxy.WatchOptions();
options.levels = 1;
function listener(sender:any, property: string, oldval:any, newval:any) {
    console.log("Updated callback! sender: ", sender.toString(), "property:", property, "old:", oldval, "new:", newval);
}
let watchedTest3 = WatchWithProxy.Watcher.Watch(test3, options, listener);

```

After that, all changes to the object watchedtest3 are going to be signaled in the listener function. This module supports arrays and their methods too.

So you can track push, pop, shift, etc... 

I may have missed some methods that modify properties. Feel free to add them and send a pull request my way.

The test/index.ts shows a sample showing the various ways to use it. 