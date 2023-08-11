# Eager return
## Context

It is common to call a function to do a *task* and *return* results *as soon as possible*. Sometimes we call a function that calls other functions to look for that same results. In this particular situation, we need to return results to the top most code as soon as possible.

## Example

```js
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
```

## Comments

By definition, every function would like to be deterministic and to have full control over its code and memory.  
This is to say it is uncommon (generally uneeded) to let the callee function take control over its caller. I think it is unecessary and time wasting to find situations where we need that because of course we could find such situations but it is very uncommon in the mindset of programming.

Nevertheless, I think the example we raised earlier is an exception as it is very common and well defined. It is also well guarded as the _callee_ function doesn't take control of its _caller_ undefinitly, there is the _give & recieve_ agreement.

## Proposale

In the context described above, I would like to see a new kind of `return` defined and added to JavaScript.  

I think defining a `return` that goes through the stack to the top most calling code is unfeasible and/or too confusing. We should think of an agreement between the _caller_ and the _callee_ functions so that the developer could decide clearly and declare this particular situation.

*(We already had `async function_n(){}` with `await function_n()` added to JavaScript without any problems but with new solutions !)*

My propositions is to add two keywords similar as `async` and `await` to describe this situation. Something like `give` and `receive` (I'm not English native, maybe not the best words).

### Edit 1:
- Visibility this is similar to `try,catch/throw` in regard of the flow of execution. 

### Edit 2:
- (use of `try-catch`, counter intuitive, as we are using throw error native flow of execution to return values. But it does the job)

_@theScottyJam comment on this:_ 

    I think you're right about this idea being fairly similar to try/catch/throw. In fact, I don't think it would be too much effort to implement something like this in userland.

    Instead of this:

    ```js
    function `give` caller(x, y) { ... }
    ```

    write this:

    ```js
    function caller(give, x, y) { ... }
    ```

    And instead of this:

    ```js
    `found` return42();
    ```

    write this:

    ```js
    give(return42());
    ```

    Then use a utility `receive()` function to capture the eager-return value, and voila! With a small user-land library, you have this feature.

### Current solution (this library)

> After the [discussion](https://es.discourse.group/t/eager-return/1346), [theScottyJam](https://github.com/theScottyJam) came up with a JS solution (using `throw/catch` flow as imagined before). It is yet our wish to see it in native JavaScript.

Meanwhile, You can now use the library as the following:

```js
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
```

### Final note
This is a practical solution, but has its limit, because `receive` function doesn't know that `func` `gives` some value somewhere in its call-stack. Using this helper library the developer _knows_ that.

The purpose of the proposal is to introduce this to JavaScript so that `receive/give` is an agreement, just like `await/async` is.

## License
Author: yanna92yar(14)[at]gmail(dot)com  
Co-author: moussa(dot)tnm51[at]gmail(dot)com  
MIT
