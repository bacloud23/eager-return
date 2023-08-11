import { give, receive } from "./eager-return.js";
// This is your own function with its subsequent call-stack
// Somewhere in its subsequent call-stack, use `give(value)` 
// instead of `return`
function func(msg1, msg2) {
    console.log(msg1 + ' ' + msg2)
    const retunedValue = func2();
    console.log('this may or may not execute')
    return retunedValue
}

function func2() {
    const constraint = Math.random() > 0.5;
    if (constraint) {
        return 'slow path'; // normal return
    } else {
        give(42); // no return give(42)
    }
    console.log('this will never execute')
}

const result = receive(func, 'hello', 'world');
console.log(result)