// Author: yanna92yar[at]gmail(dot)com

class LongReturn extends Error {
    constructor(value) {
        super('This got uncaught! That is not supposed to happen.');
        this.value = value;
    }
}

export function give(value) {
    throw new LongReturn(value);
}
/**
 * @callback yourCallback
 */
/**
 * The main wrapper 'recieve' is used to urge a function and it's subsequent stack to 'give' values
 * 
 * Be careful about your callback arguments, if not provided as expected, results are unpredictable
 * @param {yourCallback} callback The function to expect _an eager return somewhere in it's subsequent stack_
 * @param {any} parameters parameters that the callback expects (depending on your own function)
 * @returns Returns whatever your callback should return
 */
export function receive(callback) {
    if (!callback || typeof callback !== 'function') throw new Error('"recieve" needs a function with it\'s parameters.')
    let args = Array.from(arguments)
    args = args.slice(1)
    try {
        return callback(...args)//callback.apply(null, args);
    } catch (err) {
        if (err instanceof LongReturn) return err.value;
        throw err;
    }
}

// ...elsewhere...
// import { give, receive } from "./eager-return.js";

// function func(msg1, msg2) {
//     console.log(msg1 + ' ' + msg2)
//     const retunedValue = func2();
//     console.log('this may or may not execute')
//     return retunedValue
// }

// function func2() {
//     const constraint = Math.random() > 0.5;
//     if (constraint) {
//         return 'slow path'; // normal return
//     } else {
//         give(42); // no return give(42)
//     }
//     console.log('this will never execute')
// }

// const result = receive(func, 'hello', 'world');
// console.log(result)
