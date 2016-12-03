import * as WatchWithProxy from '../src/';
var totalListeners = 0;
function listener(sender:any, property: string, oldval:any, newval:any) {
    totalListeners++;
    console.log("Updated callback! sender: ", sender.toString(), "property:", property, "old:", oldval, "new:", newval);
}

class embeddedtest1 {
    a:number = 4;
    b:boolean = true;
    c:string = "hello";
    d:string[] = ["a", "b", "c"];

    toString() : string {
        return "embeddedtest";
    }
}

class test1 {
    a:number = 2;
    b:embeddedtest1 = new embeddedtest1();
    toString() : string {
        return "test1";
    }
}

let test2 = { 
    a: "123", 
    b: 123, 
    c: {
        a: true,
        b: [
            {
                a: 1,
                b: 2,
                c: 3
            },
            {
                a: 1,
                b: 2,
                c: 3
            }
        ]
    }
};

let test3 = JSON.parse(JSON.stringify(test2));


let watchedTest1 = WatchWithProxy.Watcher.Watch(new test1(), new WatchWithProxy.WatchOptions(), listener);

let watchedTest2 = WatchWithProxy.Watcher.Watch(test2, new WatchWithProxy.WatchOptions(), listener);

let options = new WatchWithProxy.WatchOptions();
options.levels = 1;
let watchedTest3 = WatchWithProxy.Watcher.Watch(test3, options, listener);

console.log( "**** TEST1 Tests ****" );
console.log("");
// First level
console.log( "Updating test.a from 2 to 7" );
watchedTest1.a = 7;
console.log( "New test.a value: ", watchedTest1.a );
console.log("");
// Second level
console.log( "Updating test.b.a from 4 to 8" );
watchedTest1.b.a = 8;
console.log( "New test.b.a value: ", watchedTest1.b.a );
console.log("");
// Array push
console.log( "Adding to test.b.d array" );
watchedTest1.b.d.push("d");
console.log( "New test.b.d value: ", watchedTest1.b.d );
console.log("");
// Array pop
console.log( "Popping from test.b.d array" );
watchedTest1.b.d.pop();
console.log( "New test.b.d value: ", watchedTest1.b.d );
console.log("");
// Array slice
console.log( "Popping from test.b.d array" );
watchedTest1.b.d.pop();
console.log( "New test.b.d value: ", watchedTest1.b.d );
console.log("");
console.log("");


console.log( "**** TEST2 Tests ****" );
console.log("");
// First level
console.log( "Updating test.a from '123' to '456'" );
watchedTest2.a = "456";
console.log( "New test.a value: ", watchedTest2.a );
console.log("");
console.log( "Adding new property d with value 'hi'" );
(<any>watchedTest2).d = "hi";
console.log( "New test.d value: ", (<any>watchedTest2).d );
console.log("");
// Third level
console.log( "Modifying 2nd level test.c.b[0].b from 0 to 6" );
watchedTest2.c.b[0].b = 6;
console.log( "New test.c.a value: ", watchedTest2.c.b[0].b);
console.log("");
console.log("");


console.log( "**** TEST3 Tests (level = 1) ****" );
console.log("");
// First level
console.log( "Updating test.a from '123' to '456'" );
watchedTest3.a = "456";
console.log( "New test.a value: ", watchedTest3.a );
console.log("");
// Second level
console.log( "Modifying 2nd level test.c.a from true to false" );
watchedTest3.c.a = false;
console.log( "New test.c.a value: ", watchedTest3.c.a);
console.log("");
// Third level
console.log( "Modifying 2nd level test.c.b[0].b from 0 to 6" );
watchedTest3.c.b[0].b = 6;
console.log( "New test.c.a value: ", watchedTest3.c.b[0].b);
console.log("");

console.log("");
console.log("");
console.log("");
console.log("Total listener calls", totalListeners);